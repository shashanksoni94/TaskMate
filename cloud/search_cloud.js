//search cloud code
Parse.Cloud.define("searchUser", function(request, response) {
    var name=request.params.searchInput;
    var query = new Parse.Query(Parse.User);
    query.startsWith("fullName",name);
    var array=[];
    if(name==""){
      response.success(array);
      return;
    }
    query.find({
      success: function(results) {
    //alert("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
    //var array=[];
    
    var arrayOfFollowings=Parse.User.current().get('following');
    for (var i = 0; i < results.length; i++) { 
      var object = results[i];
      
      if(object.id==Parse.User.current().id){
        continue;
      }
      var followStatus="Follow";
      for(var j=0;j<arrayOfFollowings.length;j++){
        if(arrayOfFollowings[j]==object.id){

          followStatus="Following";
        }
      }
      
      //loading profile pic
      var pic = object.get('profilePicture');
      if (pic == null)
      {
        var picURL = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';
      }
      else
      {
        var picURL = pic.url();
      }
      var page='/profile.html?' + object.id;
      var user=object.get('firstName')+" "+object.get('lastName');
      //alert(user);
      array.push({
        profilePage: page,
        fullName: user,
        profilePicture: picURL,
        follow: followStatus,
      });
    }
    
    response.success(array);
    return;
  },
  error: function(error) {
  	//alert("error here");
    response.error("Error: " + error.code + " " + error.message);
    return;
  }
});
});

    
 



//follow cloud code
Parse.Cloud.define("follow", function(request, response) {
  var currentUser = request.user;
  var followingArray=currentUser.get('following');
  var userId=request.params.followingId;
  followingArray.push(userId);

  currentUser.set("following",followingArray);
  currentUser.save(null, {
    success: function(currentUser) {
    // Execute any logic that should take place after the object is saved.
    response.success("Now following user #" + request.params.followingId);
    return;
  },
  error: function(currentUser, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    response.error("Error: " + error.code + " " + error.message);
    return;
  }
});
});


//unfollow cloud code
Parse.Cloud.define("unfollow", function(request, response) {
  var currentUser = request.user;
  console.log(currentUser);
  var followingArray=currentUser.get('following');
  var userId=request.params.followingId;
  var position=0;

  for(var i=0; i<followingArray.length; i++){

    if(followingArray[i]==userId){
      position=i;
      break;
    }
  }

  followingArray.splice(position,1);

  currentUser.set("following",followingArray);
  currentUser.save(null, {
    success: function(currentUser) {
    // Execute any logic that should take place after the object is saved.
    response.success("No longer following user #" + request.params.followingId);
    return;
  },
  error: function(currentUser, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    response.error("Error: " + error.code + " " + error.message);
    return;
  }
});
});



//make notification cloud code
Parse.Cloud.define("createNotification", function(request, response) {
  var userId=request.params.followingId;
  var currentUser = request.user;
  var Notification = Parse.Object.extend("Notification");
  var notif = new Notification();
  Parse.Cloud.useMasterKey();
  var User = Parse.Object.extend("User");
  var user_query = new Parse.Query(User);
  user_query.include("owner");
  user_query.get(userId, {
    success: function(result) {
        // The object was retrieved successfully.
        var anotherUser=result;
        notif.set("owner",userId);
        notif.set("outgoing",currentUser.id);
        notif.set("user", currentUser);                   
        notif.set("type","follow");
        var notif_content = currentUser.get('firstName')+" "+currentUser.get('lastName') + " started following you.";
        notif.set("content",notif_content);
        notif.save(null, {
          success: function(notif) {
            var numNotif = anotherUser.get('numNotif');
            anotherUser.set('numNotif',numNotif+1);
            anotherUser.save(null, {
              success: function(anotherUser) {
                
                response.success("Successfully updated user.");
              },
              error: function(gameScore, error) {
                
                response.error("Could not save changes to user.");
              }
            });

            response.success("Notification object created.");
            return;
          },
          error: function(currentUser, error) {
            response.error("Error: " + error.code + " " + error.message);
            return;
          }
        });
      },
      error: function(object, error) {
        response.error("Error: " + error.code + " " + error.message);
        return;
      }
    }); 
});




