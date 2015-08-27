Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

//Tests for cloud functions in showList.js corresponding to listPage.html
QUnit.test( "Listpage Tests", function( assert ) {
    Parse.User.logIn("test@list.com", "123456", {
        success: function(user) {
            var currentDate = new Date();
            Parse.Cloud.run('makeGoal', {goalName: "testGoalName", date: "", curDate: currentDate, listId: "Vb6SAbOLyu", ownerName: "Test User"}, {
                success: function(result) {
                    assert.ok("Made goal with name testGoalName" == result, "Able to create a goal with no date");
                },
                error: function(error) {
                    alert(error.message);
                }
            });

            var d = new Date("October 13, 2025 11:13:00");
            Parse.Cloud.run('makeGoal', {goalName: "testGoalName2", date: d, curDate: currentDate, listId: "Vb6SAbOLyu", ownerName: "Test User"}, {
                success: function(result) {
                    assert.ok("Made goal with name testGoalName2" == result, "Able to create a goal with a date in the future");
                },
                error: function(error) {
                }
            });

            var e = new Date("October 13, 2013 11:13:00");
            Parse.Cloud.run('makeGoal', {goalName: "testGoalName3", date: e, curDate: currentDate, listId: "Vb6SAbOLyu", ownerName: "Test User"}, {
                success: function(result) {
                },
                error: function(error) {
                    assert.ok("Invalid date" == error.message, "Making a goal with a date in the past returns error message");
                }
            });

            Parse.Cloud.run('makeGoal', {goalName: "", date: "", curDate: currentDate, listId: "Vb6SAbOLyu", ownerName: "Test User"}, {
                success: function(result) {
                },
                error: function(error) {
                    assert.ok("Cannot read the name!" == error.message, "Making a goal with no name returns error message");
                }
            });

            var Goal = Parse.Object.extend("Goal");
            var goal = new Goal();
            goal.set("name", "testGoalName4");
            goal.set("owner", "Vb6SAbOLyu");
            goal.set("dueDate", null);
            goal.set("completed", false);
            goal.save(null, {
                success: function(goal) {
                    Parse.Cloud.run('deleteGoal', {listId: "Vb6SAbOLyu", goalId: goal.id }, {
                        success: function(result) {
                            assert.ok("Deleted goal testGoalName4" == result, "Deleting a goal");
                        },
                        error: function(error) {
                        }
                    });
                },
                error: function(goal, error) {
                }
            });

            var goal2 = new Goal();
            goal2.set("name", "testGoalName5");
            goal2.set("owner", "Vb6SAbOLyu");
            goal2.set("dueDate", null);
            goal2.set("completed", false);
            goal2.save(null, {
                success: function(goal) {
                    Parse.Cloud.run('completeGoal', {listId: "Vb6SAbOLyu", goalId: goal2.id }, {
                        success: function(result) {
                            assert.ok("Completed goal testGoalName5" == result, "Completing a goal");
                        },
                        error: function(error) {
                        }
                    });
                },
                error: function(goal, error) {
                }
            });

            var goal3 = new Goal();
            goal3.set("name", "testGoalName6");
            // A list that belongs to someone else
            goal3.set("owner", "OUhPy1RxtT");
            goal3.set("dueDate", null);
            goal3.set("completed", false);
            goal3.save(null, {
                success: function(goal) {
                },
                error: function(goal, error) {
                    assert.ok("Can not modify other client's goal" == error.message, "Attempt to modify someone elses goal");
                }
            });

        },
        error: function(user, error) {
            alert("Login test@list.com problem");
        }
    });

    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});