//initialize parse database
Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63",
    "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

//redirect to newsfeed page
function goHome() {
    window.location.href = "../newsfeed.html";
}

//redirect to search page
function redirect(){
	var text = document.getElementById("searchInput").value;
	window.location.href = "../search.html?" + text;
};


//redirect to profile page
function goToProfile(){
	var text = Parse.User.current().id;
	window.location.href = "../profile.html?" + text;
};


//log out the user
function logOut(){
	Parse.User.logOut(); 
  window.location.href = "../index.html";
};


//redirect to about us page
function goToAboutUs(){
  window.location.href = "../aboutus.html";
};


//redirect to notifications page
function goToNotification(){
  window.location.href = "../notifications.html";
};

//create a new angular app for newsfeed
var newsfeedApp = angular.module("newsfeedApp", []);

//newsfeed controller
newsfeedApp.controller("newsfeedCtrl", ["$scope", function newsfeedCtrl($scope){
    Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

    //query for all the newsfeed objects
    var query = new Parse.Query("Newsfeed");

    //update the query limit to be 1000
    query.limit(1000);

    //make query to be ascending
    query.ascending("createdAt");
    query.include("owner");

    //get the current user id
    var id = Parse.User.current().id;

    //query for user
    idQuery = new Parse.Query(Parse.User);
    idQuery.equalTo("objectId", id);
    idQuery.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {

                var object = results[i];
                //get the following array of the user
                var following = object.get("following");
                query.find({
                    success: function(newsfeeds) {
                        // newsfeeds now contains an array of newsfeed object retrieved from Parse
                        //alert("Successfully retrieved " + newsfeeds.length + " Newsfeed objects.");
                        $scope.posts = []; //array for Newsfeed

                        var postsCount = 0; //count for $scope.posts array

                        for (var i = 0; i < newsfeeds.length; i++){
                            //get the newsfeed object
                            var newsfeed = newsfeeds[newsfeeds.length - i - 1];

                            //filter for newsfeed from both the current user and the people the current user is following
                            if($.inArray(newsfeed.get('owner').id, following) !== -1 || newsfeed.get('owner').id === Parse.User.current().id){

                                //set the properties of posts objects
                                $scope.posts[postsCount] = {};
                                $scope.posts[postsCount].message = newsfeed.get('message');
                                $scope.posts[postsCount].numLikes = newsfeed.get('numLikes');
                                $scope.posts[postsCount].numComments = newsfeed.get('numComments');
                                $scope.posts[postsCount].objectId = newsfeed.id;

                                //set the like button text
                                if($.inArray(Parse.User.current().id, newsfeed.get('liked')) == -1)
                                    $scope.posts[postsCount].btnText = 'Like';
                                else
                                    $scope.posts[postsCount].btnText = 'Unlike';

                                $scope.posts[postsCount].firstName = newsfeed.get('owner').get('firstName');
                                $scope.posts[postsCount].lastName = newsfeed.get('owner').get('lastName');
                                if(newsfeed.get('owner').get('profilePicture') != undefined)
                                    $scope.posts[postsCount].picURL = newsfeed.get('owner').get('profilePicture').url();
                                else
                                    $scope.posts[postsCount].picURL = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';

                                postsCount++;

                                $scope.$digest();
                            }



                        }



                    },
                    //error message
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
        },
        //error message
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

  //set the numNotif
  $scope.numberOfNotification = Parse.User.current().get('numNotif');


  //set the profile picture URL
  $scope.profilePictureURL = "img/glyphicons-4-user.png";

  picture = Parse.User.current().get("profilePicture");
  if (picture != undefined) {
    $scope.profilePictureURL = picture.url();
  }

  //redirect to newsfeed page
  $scope.goHome = function() {
      window.location.href = "./newsfeed.html";
  }

  //redirect to notification
  $scope.goNotification = function() {
    window.location.href = "./notifications.html";
  }

  //redirect to search
  $scope.search = function(){
    window.location.href = "./search.html?" + $scope.searchInput;
  };

  //redirect to profile
  $scope.goProfile = function(){
    window.location.href = "./profile.html?" + Parse.User.current().id;
  };

  //log out the current user
  $scope.logOut = function(){
    Parse.User.logOut();
    window.location.href = "./index.html";
  };


  //redirect to post page
  $scope.goToPost = function(index){
    window.location.href = "../post.html?" + $scope.posts[index].objectId;
  };


  //increment numLikes
  $scope.plusOne = function(index) {

    //get the id of the newsfeed
    var id = $scope.posts[index].objectId;

    //run the cloud code to change the numLikes
    Parse.Cloud.run('changeNumLike', {newsfeedID: id}, {
      success: function(result){

        //update within angular
        if(result[0] === -1){
          $scope.posts[index].numLikes = result[1];
          $scope.posts[index].btnText = 'Unlike';
          $scope.$digest();
        }
        else {
          $scope.posts[index].numLikes = result[1];
          $scope.posts[index].btnText = 'Like';
          $scope.$digest();
        }
      },

      //error message
      error: function(error){
        alert("Error: " + error.code + " " + error.message);
      }
    });


    /*var query = new Parse.Query('Newsfeed');
    query.include("owner");
    query.get($scope.posts[index].objectId, {
      success: function(newsfeed){

        var currentId = Parse.User.current().id; 
        var likedArray = newsfeed.get('liked');
        var result = $.inArray(currentId, likedArray);

        //user like a post
        if (result === -1){
          var Notification = Parse.Object.extend("Notification");
          var notif = new Notification();
          var owner = newsfeed.get('owner').id;


          //var ownerPtr = newsfeed.get('owner');
          //console.log("numNotif is " + ownerPtr.get("numNotif"));
          //ownerPtr.set("numNotif", 100);
          //console.log("numNotif is " + ownerPtr.get("numNotif"));

          notif.set("owner", owner);
          var content = Parse.User.current().get('firstName') + " " + Parse.User.current().get('lastName') + " liked your post.";
          notif.set("content", content);
          notif.set("type", "like");
          notif.set("user", Parse.User.current());
          notif.set("outgoing", newsfeed.id);
          notif.save();

          newsfeed.increment('numLikes');
          newsfeed.add('liked', currentId);
          newsfeed.save();
          $scope.posts[index].numLikes = newsfeed.get('numLikes');
          $scope.posts[index].btnText = 'Unlike';
          $scope.$digest();
        }

        //user unlike a post
        else {
          newsfeed.set('numLikes', newsfeed.get('numLikes') - 1);
          newsfeed.get('liked').splice(result, 1);
          newsfeed.save();
          $scope.posts[index].numLikes = newsfeed.get('numLikes');
          $scope.posts[index].btnText = 'Like';
          $scope.$digest();
        }

      },
      error: function(object, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    }); */

 
  };

  //when click on name or profilepic, redirect to the corresponding profile page
  $scope.redirectToProfile = function(index)  {
      var query = new Parse.Query("Newsfeed");
    query.include("owner");
    query.get($scope.posts[index].objectId, {
      success: function(newsfeed){
        var profileId = newsfeed.get('owner').id;
        window.location.href = "../profile.html?" + profileId;

      },

      //error message
      error: function(object, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

  }

}]);
