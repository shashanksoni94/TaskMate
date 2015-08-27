
/* Controller for search */
var SearchController=function ($scope){

  /* Initialize Parse database */
  Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

  /* Get the id pass in search page */
  var id = location.search;

  /* Get the name to search */
  var name = id.substring(1,id.length);
  $scope.searchInput = name;

  /* Check if it searching a name */
  if(name == "undefined"){
    $scope.searchInput="";
  }
  else{
    $scope.searchInput=name; 
  }

  /* Get the number of notifications */
  $scope.numberOfNotification = Parse.User.current().get('numNotif');

  /* Initialize the profile picture in navigation bar */
  $scope.profilePictureURL = "img/glyphicons-4-user.png";

  /* Check if user have profile picture */
  picture = Parse.User.current().get("profilePicture");
  if (picture != undefined) {
    $scope.profilePictureURL = picture.url();
  }

  /* Home button for navigation bar */
  $scope.goHome = function() {
      window.location.href = "./newsfeed.html";
  }

  /* Notification button for navigation bar */
  $scope.goNotification = function() {
    window.location.href = "./notifications.html";
  }

  /* About us button for navigation bar */
  function goToAboutUs(){
    window.location.href = "../aboutus.html";
  };

  /* Search function */
  $scope.search = function(){
    /* Get the current searching name */
    var name = $scope.searchInput;
    name = name.toLowerCase().trim();

    /* Check if it searching */
    if(name == ""){
      $scope.Results = [];
      $scope.warning = "No Result Found";
      return;
    }

    /* Run cloud code to get the user with searching name */
    Parse.Cloud.run('searchUser',{searchInput: name},{
      success: function(result) {
        $scope.warning="";
        if(result.length==0){
          $scope.Results=[];
          $scope.warning="No Result Found";
          return;
        }
        $scope.Results=result;
        $scope.$digest();
      },
      error: function(error) {
        alert("Error of " + error.code + error.message);
      }
    });
  };

  /* My profile button for navigation bar */
  $scope.goProfile = function(){
    window.location.href = "./profile.html?" + Parse.User.current().id;
  };

  /* Logout button for navigation bar */
  $scope.logOut = function(){
    Parse.User.logOut();
    window.location.href = "./index.html";
  };

  /* Follow searched user */
  $scope.follow = function(Result){
    /* Check if followed the user */
    if(Result.follow == "Follow"){
      /* Get the user id that is going to follow */
      var page = Result.profilePage;
      var userId = page.substring(14,page.length);

      /* Run cloud code to follow that user */
      Parse.Cloud.run('follow',{followingId: userId},{
        success: function(result) {
          /* Update the follow button to following */
          Result.follow="Following";

          /* Run cloud code to create notification */
          Parse.Cloud.run('createNotification',{followingId: userId},{
            success: function(output) {
              /* Update the angular */
              $scope.$digest();
            },
            error: function(error){
              alert("Error of " + error.code + error.message);
            }
          });
        },
        error: function(error) {
          alert("Error of " + error.code + error.message);
        }
      });
    }
    else{
      /* Get the user id that is going to unfollow */
      var page = Result.profilePage;
      var userId = page.substring(14,page.length);

      /* Run cloud code to unfollow that user */
      Parse.Cloud.run('unfollow',{followingId: userId},{
        success: function(result) {
          /* Update the following button to follow */
          Result.follow="Follow";
          $scope.$digest();
        },
        error: function(error) {
          alert("Error of " + error.code + error.message);
        }
      });
    }
  };

  /* Call search function */
  $scope.search();
}

