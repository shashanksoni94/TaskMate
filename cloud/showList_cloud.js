//Make a new goal and add it to the list
Parse.Cloud.define("makeGoal", function(request, response) {
    var goalName = request.params.goalName;
    var ListId = request.params.listId;
    var deadline;
    var dateString;
    var ownerName = request.params.ownerName;
    var currentDate = request.params.curDate;
    var owner = Parse.User.current();
    var stringDate = request.params.date;
    //If there is a goalname
    if (goalName.length > 0) {
        var Goal = Parse.Object.extend("Goal");
        var goal = new Goal();

        var Newsfeed = Parse.Object.extend("Newsfeed");
        var newsfeed = new Newsfeed();

        goal.set("name", goalName);

        goal.set("owner", ListId);
        //If there is no date, set dueDate to null
        if (stringDate == null || stringDate == "")
        {
            goal.set("dueDate", null);
            dateString = "";
        } else if (stringDate.length > 0 || stringDate != null) {
            deadline = new Date(stringDate);
            //Else check that the due date is after todays date
            if (deadline < currentDate) {
                response.error("Invalid date");
                return;
            }
            goal.set("dueDate", deadline);
            dateString = goal.get("dueDate").toDateString();
        }
        //By default set goal to not complete and save
        goal.set("completed", false);
            goal.save(null, {
                success: function(goal) {
                    newsfeed.set('goal', goal.id);
                    newsfeed.set('list', ListId);
                    newsfeed.set('owner', owner);
                    newsfeed.set('message', ownerName + " has created goal \n \"" + goalName + "\"");
                    newsfeed.set('numLikes', 0);
                    newsfeed.set('numComments', 0);
                    newsfeed.save(null, {
                        success: function(newsfeed) {
                            console.log("Saved newsfeed");
                            response.success("Made goal with name " + goalName);
                        },
                        error: function(newsfeed, error) {
                            response.error("error in saving");
                            return;
                        }
                    });
                },
                error: function(goal, error) {
                    response.error(error);
                    return;
                }
            });

    } else {
        response.error("Cannot read the name!");
        return;
    }
});

//Complete the goal, change that field of the goal
Parse.Cloud.define('completeGoal', function(request, response) {
    var List = Parse.Object.extend("List");
    var query = new Parse.Query(List);
    var ListId = request.params.listId;
    var goalId = request.params.goalId;
    var ownerName = request.params.ownerName;
    //Get the list it belongs to
    query.get(ListId, {
        success: function(list){
            var listOwner = list.get('owner');
            //If attempting to modify someone elses list
            if(Parse.User.current().id !== listOwner){
                response.error("You can only complete your own goals!");
                return;
            }
            else {
                var Goal = Parse.Object.extend("Goal");
                var goalQuery = new Parse.Query(Goal);
                goalQuery.equalTo("objectId", goalId);
                goalQuery.find({
                    success: function(results) {
                        for (var i = 0; i < results.length; i++) {
                            var goal = results[i];
                            goalName = goal.get("name");
                            goal.set('completed', true);
                            //Create a newsfeed object stating that the user has completed this goal
                            var Newsfeed = Parse.Object.extend("Newsfeed");
                            var newsfeed = new Newsfeed();

                            newsfeed.set('goal', goal.id);
                            newsfeed.set('list', ListId);
                            newsfeed.set('owner', Parse.User.current());
                            newsfeed.set('message', ownerName + " has completed goal \n\"" + goalName +"\"");
                            newsfeed.set('numLikes', 0);
                            newsfeed.set('numComments', 0);

                            var array = [];
                            array.push(goal);
                            array.push(newsfeed);
                            Parse.Object.saveAll(array, {
                                success: function(array){
                                    response.success("Completed goal " + goalName);
                                },
                                error: function(error) {
                                    response.error(error);
                                    return;
                                }
                            });
                        }
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                        response.error(error);
                        return;
                    }
                });

            }
        },
        error: function(object, error) {
            alert("Error: " + error.code + " " + error.message);
            response.error(error);
            return;
        }
    });
});

//Remove a goal from the database and from a list
Parse.Cloud.define('deleteGoal', function(request, response) {
    var List = Parse.Object.extend("List");
    var query = new Parse.Query(List);
    var listID = request.params.listId;
    var goalID = request.params.goalId;
    query.get(listID, {
        success: function(list){
            var listOwner = list.get('owner');
            if(Parse.User.current().id !== listOwner){
                response.error("You can only delete your own goals!");
                return;
            }
            else{
                var Goal = Parse.Object.extend("Goal");
                var goalQuery = new Parse.Query(Goal);
                goalQuery.equalTo("objectId", goalID);
                goalQuery.find({
                    success: function(results) {
                        for (var i = 0; i < results.length; i++) {
                            var goal = results[i];
                            var goalName = goal.get("name");
                            goal.destroy({
                                success: function(goal) {
                                    response.success("Deleted goal " + goalName);
                                },
                                error: function(goal, error) {
                                    response.error(error);
                                    return;
                                }
                            });
                        }
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                        response.error(error);
                        return;
                    }
                });
            }
        },
        error: function(object, error) {
            alert("Error: " + error.code + " " + error.message);
            response.error(error);
            return;
        }
    });
});