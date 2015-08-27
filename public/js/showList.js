/* Get Parse database */
Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

/* Initialize Parse objects */
var List = Parse.Object.extend("List");
var Goal = Parse.Object.extend("Goal");
var Newsfeed = Parse.Object.extend("Newsfeed");

/* Initialize variables */
var incompleteGoal = [];
var name;
var ListId = location.search;
ListId = ListId.slice(1);
var ownerID;
var owner;
var ownerName;
var goalName;

/* Controller for the navigation bar */
function NavigationBarController($scope) {

  /* Get notification number and profile picture to display */
  $scope.numberOfNotification = Parse.User.current().get('numNotif');
  $scope.profilePictureURL = "img/glyphicons-4-user.png";
  picture = Parse.User.current().get("profilePicture");
  if (picture != undefined) {
    $scope.profilePictureURL = picture.url();
  }

  /* Redirect functions for the navigation bar */
  $scope.goHome = function() {
      window.location.href = "./newsfeed.html";
  }

  $scope.goNotification = function() {
    window.location.href = "./notifications.html";
  }

  $scope.search = function(){
    window.location.href = "./search.html?" + $scope.searchInput;
  };

  $scope.goProfile = function(){
    window.location.href = "./profile.html?" + Parse.User.current().id;
  };

  $scope.logOut = function(){
    Parse.User.logOut();
      window.location.href = "./index.html";
  };

}

/* Controller for the user display */
function infoCtrl($scope){
  /* Get current user */
  var currentUser = Parse.User.current();
    var picture = currentUser.get('profilePicture');
    /* Get picture to display */
    if (picture != undefined)
    {
        $scope.picUrl = picture.url();
    }
    else
    {
        $scope.picUrl = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';
    }
    /* Get name to display */
  $scope.firstName = currentUser.get("firstName");
  $scope.lastName = currentUser.get("lastName");

}

/* Controller for the goals in the list */
function GoalController($scope) {
     var lists = new Parse.Query(List);

     /* Get lists corresponding to the listId */
     lists.equalTo("objectId", ListId);

     var description;

     lists.find({
       success: function(results) {
        /* Iterate through the lists found */
         for (var i = 0; i < results.length; i++) {
             /* Get the owner and description to display */
             description = results[i].get("description");
             ownerID = results[i].get('owner');
             var User = Parse.Object.extend("User");
             var query = new Parse.Query(User);
             /* Get the user corresponding to the ownerId */
             query.equalTo("objectId", ownerID);
             query.find({
                 success: function(results) {
                  /* Iterate through the users found */
                     for (var i = 0; i < results.length; i++) {
                      /* Set the owner and name */
                         owner = results[i];
                         ownerName = owner.get("firstName") + " " + owner.get("lastName");
                     }
                 },
                 error: function(error) {
                     alert("Error: " + error.code + " " + error.message);
                 }
             });
             /* Get the list name */
             name = results[i].get("name");
         }

        /* Get all goals corresponding to the list */
         var goals = new Parse.Query(Goal);
         goals.equalTo("owner", ListId);
         var completedGoalName = [];
         var incompleteGoalName = [];
         var incompleteGoalDueDate = [];

         goals.find({
           success: function(results) {
            /* Iterate through the goals found */
             for (var i = 0; i < results.length; i++)
             {
               /* Push them according to their state of completion */
               if (results[i].get('completed') === true){
                completedGoalName.push(results[i].get('name'));
               }
               else
               {
                incompleteGoalName.push(results[i].get('name'));
                incompleteGoal.push(results[i]);
                /* If the due date found is null, return an empty string */
    if (results[i].get('dueDate')===null)
        {
      incompleteGoalDueDate.push("");
    } else
        {
            /* Push the due date */
                incompleteGoalDueDate.push(results[i].get('dueDate').toDateString());
    }   }
             }
             /* Initialize the scope variables */
             $scope.Descriptions=[];
             $scope.CompletedGoals=[];
             $scope.IncompleteGoals=[];
               /* Set the name and description */
               $scope.Name = name;

       $scope.Descriptions.push({name: description});

             for(var i = 0; i < completedGoalName.length; i++) {
               $scope.CompletedGoals.push({name: completedGoalName[i]});
             }

             for(var i = 0; i < incompleteGoalName.length; i++) {
               $scope.IncompleteGoals.push({name: incompleteGoalName[i], dueDate: incompleteGoalDueDate[i]});
             }         

             $scope.$digest();
           },
           
           error: function(error) {
             alert("Error: " + error.code + " " + error.message);
           }
         });

       },
       error: function(error) {
         alert("Error: " + error.code + " " + error.message);
       }
     });

  //check whether to display "Create Goal" button on listPage 
  var currentUserId = Parse.User.current().id;
  var query = new Parse.Query("List");
  /* Get the list corresponding to the Id */
  query.get(ListId, {
    success: function(list){
      var listOwnerId = list.get('owner');
      if(currentUserId === listOwnerId){
        console.log("isCurrentUser is true");
        document.getElementById("newGoalBtn").style.visibility = "visible";
      }
      else{
        console.log("isCurrentUser is false");
        document.getElementById("newGoalBtn").style.display = "none";
      }

    },

    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });


/* Function to add a goal */
$scope.addGoal = function() {
  	goalName = document.getElementById('goalDesc').value;
  	var stringDate = document.getElementById('goalDate').value;
        var dateString;
    var deadline;
    var currentDate = new Date();
    /* Run the cloud code for make goal */
    Parse.Cloud.run('makeGoal', {goalName: goalName, date: stringDate, curDate: currentDate, listId: ListId, ownerName: ownerName}, {
        success: function(result) {
            location.reload();
        },
        error: function(error) {
            alert("Error of " + error.code + error.message);
        }
    });

}

}

/* Function to complete goal */
function completeGoal(index) {

  var goal = incompleteGoal[index];
  var listID = goal.get('owner');
  /* Run the cloud code for complete goal */
    Parse.Cloud.run('completeGoal', {listId: listID, ownerName: ownerName, goalId: goal.id }, {
        success: function(result) {
            location.reload();
        },
        error: function(error) {
            alert("Error of " + error.code + error.message);
        }
    });

}

/* Function to delete goal */
function deleteGoal(index) {
  var goal = incompleteGoal[index];
  var listID = goal.get('owner');
  /* Run the cloud code for delete goal */
    Parse.Cloud.run('deleteGoal', {listId: listID, goalId: goal.id }, {
        success: function(result) {
            location.reload();
        },
        error: function(error) {
            alert("Error of " + error.code + error.message);
        }
    });

}

/* Function to show the menu */
function showMenu(index){
  console.log("here");
  var id = "#" + index;
  $("#"+index).toggleClass('open');
}

/* Function to show in progress goals */
function showInProgress() {
  if (document.getElementById('InProgress').style.display === "none") {
    document.getElementById('InProgress').style.display = "";
  }
  else {
    document.getElementById('InProgress').style.display = "none";
  }
}

/* Function to show complete goals */
function showComplete() {
  if (document.getElementById('Complete').style.display === "none") {
    document.getElementById('Complete').style.display = "";
  }
  else {
    document.getElementById('Complete').style.display = "none";
  }
}

/* Function to set the display (hide) */
function setDisplay() {
   document.getElementById('InProgress').style.display = "";
   document.getElementById('Complete').style.display = "none";
}
