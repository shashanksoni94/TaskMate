Parse.Cloud.define("changeNumLike", function(request, response){

  //get the newsfeed ID
	var postID = request.params.newsfeedID;

    //query the newsfeed using newsfeedID
    var query = new Parse.Query('Newsfeed');
    query.include("owner");
    query.get(postID, {
      success: function(newsfeed){

        //get the current user ID 
        var currentId = Parse.User.current().id; 

        //get the liked array
        var likedArray = newsfeed.get('liked');


        //if likedArray is undefined, make it an empty array
        if(likedArray == undefined)
          likedArray = [];

        //if currentId is in the array, result is the index. Otherwise, result is -1
        var result = -1;
        for(var i = 0; i < likedArray.length; i++){
          if(likedArray[i] === currentId){
            result = i;
            break;
          }
        }

        //put result into results array
        var results = [];
        results[0] = result;

        //user like a post
        if (result === -1){

          //create a notification object when user likes a post
          var Notification = Parse.Object.extend("Notification");
          var notif = new Notification();
          var owner = newsfeed.get('owner').id;

          notif.set("owner", owner);
          var content = Parse.User.current().get('firstName') + " " + Parse.User.current().get('lastName') + " liked your post.";
          notif.set("content", content);
          notif.set("type", "like");
          notif.set("user", Parse.User.current());
          notif.set("outgoing", newsfeed.id);
          notif.save();

          //increment numLikes of the newsfeed object
          newsfeed.increment('numLikes');

          //add the currentID to the likedArray
          newsfeed.add('liked', currentId);
          newsfeed.save();

          //set results[1] to be the updated numLikes
          results[1] = newsfeed.get("numLikes");

          //return results array
          response.success(results);
        }

        //user unlike a post
        else {

          //decrement the newsfeed numLikes
          newsfeed.set('numLikes', newsfeed.get('numLikes') - 1);
          newsfeed.get('liked').splice(result, 1);
          newsfeed.save();
          results[1] = newsfeed.get("numLikes");

          //return results array
          response.success(results);
        }

      },

      //error messages
      error: function(object, error) {
        response.error("Error: " + error.code + " " + error.message);
        return;
      }
    });
});