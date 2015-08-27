require('cloud/index_cloud.js');
require('cloud/List_cloud.js');
require('cloud/Profile_cloud.js');
require('cloud/search_cloud.js');
require('cloud/showList_cloud.js');
require('cloud/signup_cloud.js');
require('cloud/newsfeed_cloud.js');
require('cloud/post_cloud.js');
require('cloud/notifications_cloud.js')

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Testing function for learning purposes
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

//Another function for learning purposes
Parse.Cloud.define("test", function(request, response) {
    var list = Parse.Object.extend("List");
    var query = new Parse.Query(list);

    query.find({
        success: function(results) {
            alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned Parse.Object values
            response.success("Found " + results.length + " lists");
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

//Guarantees that users cannot modify each others goals
Parse.Cloud.beforeSave("Goal", function(request, response) {
    var object = request.object;
    var listID = object.get("owner");

    var List = Parse.Object.extend("List");
    var query = new Parse.Query(List);
    query.equalTo("objectId",listID);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++)
            {
                var obj = results[i];
                var owner = obj.get("owner");
                var curUser = Parse.User.current();
                //Compare owner of the goal and the cur user
                if (owner == curUser.id)
                {
                    response.success();
                }
                else
                {
                    response.error("Can not modify other client's goal");
                }
            }
        },
        error: function(error) {
            response.error();
        }
    });
});

//Guarantees that users cannot modify each others lists
Parse.Cloud.beforeSave("List", function(request, response) {
    var object = request.object;
    var owner = object.get("owner");
    var curUser = Parse.User.current();
    //Compare owner of the list and cur user
    if (owner == curUser.id)
    {
        response.success();
    }
    else
    {
        response.error("Can not modify other client's list");
    }
});


