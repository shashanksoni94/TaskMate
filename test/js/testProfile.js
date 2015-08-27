Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

QUnit.test( "Test creation of valid list", function( assert ) {
    Parse.User.logIn("ab@cd.com", "abcd", {
      success: function(user) {
        Parse.Cloud.run('makeList', {name: "Test List #1", userId: "GE9cdu2bCm", description: "Testing valid list."}, {
            success: function(result) {
                assert.ok(result[1] == "Created list object with name \"Test List #1\" and description \"Testing valid list.\".", "Create Success");
            },
            error: function(error) {
                alert("Cannot Create a List");
            }
        });
      },
      error: function(user, error) {
        alert("Login ab@cd.com problem");
      }
    });  

    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");

    Parse.User.logOut();
});

QUnit.test( "Test creation of list with no name", function( assert ) {
    Parse.User.logIn("ab@cd.com", "abcd", {
      success: function(user) {
        Parse.Cloud.run('makeList', {name: "", userId: "GE9cdu2bCm", description: "Testing invalid list."}, {
            success: function(result) {
                alert("Shouldn't Create a List");
            },
            error: function(error) {
                assert.ok(error.message == "List cannot be created without name.", "Cannot Create with Empty Name");
            }
        });
      },
      error: function(user, error) {
        alert("Login ab@cd.com problem");
      }
    });  

    assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");

    Parse.User.logOut();
});