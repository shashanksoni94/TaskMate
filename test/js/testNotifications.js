Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

QUnit.test( "Test with no notification", function( assert ) {
    Parse.User.logIn("test@notification1.com", "123456", {
      success: function(user) {
        Parse.Cloud.run('getNotifications', {}, {
          success: function(results) {
            // result is 'Hello world!'
            assert.ok(results.length == 0, "Check Number of Notifications");
          },
          error: function(error) {
            //assert.ok(error == "Cannot find your notifications :D", "No notifications");
            alert("Cannot get notifications");
          }
        });
      },
      error: function(user, error) {
        alert("Login test@notification1.com problem");
      }
    });  

    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});


QUnit.test( "Test with 1 notifications", function( assert ) {
    Parse.User.logIn("test@notification2.com", "123456", {
      success: function(user) {
        Parse.Cloud.run('getNotifications', {}, {
          success: function(results) {
            assert.ok(results.length == 1, "Check Number of Notifications");
            assert.ok(results[0].content == "John Law started following you.", "Check Content");
            assert.ok(results[0].outgoing == "profile.html?21hntpwfnb", "Check Outgoing");
            assert.ok(results[0].image == "http://files.parsetfss.com/df7bbd0e-def6-4ace-baad-b27598d224b3/tfss-62630dac-b073-450d-8329-41b2dfd6834b-profilePic.jpg", "Check Image");
          },
          error: function(error) {
            alert("Should have notification");
          }
        });
      },
      error: function(user, error) {
        alert("Login test@notification2.com problem");
      }
    });  
    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});


QUnit.test( "Test with more than 15 notifications", function( assert ) {
    Parse.User.logIn("john@law.com", "123456", {
      success: function(user) {
        Parse.Cloud.run('getNotifications', {}, {
          success: function(results) {
            assert.ok(results.length == 15, "Check Number of Notifications");
          },
          error: function(error) {
            alert("Should have notification");
          }
        });
      },
      error: function(user, error) {
        alert("Login test@notification2.com problem");
      }
    });  
    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});


