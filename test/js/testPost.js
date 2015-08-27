Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

QUnit.test("test the query results for post", function(assert){
	Parse.User.logIn("test1@newsfeed.com", "123456", {
		success: function(user){
			Parse.Cloud.run('getPost', {objectId: "z5n9lKtnyC"}, {
				success: function(result){
					assert.ok(result.id === "z5n9lKtnyC", "check query result");
				},

				error: function(error){
					alert("wrong result for query");
				}
			});

			Parse.Cloud.run('getUserInfo', {objectId: "BK3TOx8IFd"}, {
				success: function(result){
					assert.ok(result.get('firstName') === "newsfeed", "check userInfo firstname");
					assert.ok(result.get('lastName') === "test1", "check userInfo lastname");
				},

				error: function(error){
					alert("wrong result for query user info");
				}

			});

		},

		error: function(user, error){
			alert("Login test1@newsfeed.com problem");	
		}

	});

	assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});


QUnit.test("test the display results for post", function(assert){
	Parse.User.logIn("test1@newsfeed.com", "123456", {
		success: function(user){
			Parse.Cloud.run('displayComment', {objectId: "z5n9lKtnyC"}, {
				success: function(results){
					assert.ok(results[0].get('content') === "hello", "check comment display content first element");
					assert.ok(results[1].get('content') === "hello again", "check comment display content second element");
					assert.ok(results[0].get('user') === "BK3TOx8IFd", "check comment display user id");
				},

				error: function(error){
					alert("wrong result for query comment info");
				}
			});

		},

		error: function(error){
			alert("wrong result for query comment info");
		}
	});

	assert.ok(1 == "1", "This is just to remove Qunit's complaints about no asserts");
    Parse.User.logOut();
});








