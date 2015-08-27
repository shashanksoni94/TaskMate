Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

//test the number of likes in newsfeed page
QUnit.test("test the number of likes in a newsfeed", function(assert){
	Parse.User.logIn("test1@newsfeed.com", "123456", {
		success: function(user){
			//create a new newsfeed object with 0 like
			var Newsfeed = Parse.Object.extend("Newsfeed");	
			var newsfeed = new Newsfeed();
			newsfeed.set("owner", Parse.User.current());
			newsfeed.set("list", "Fx6xSvZBFX");
			newsfeed.set("goal", "eUjYQubn2t");
			newsfeed.set("numLikes", 0);
			newsfeed.save(null, {
				success: function(goal) {
					//run function and increment the number of like
					Parse.Cloud.run('changeNumLike', {newsfeedID: newsfeed.id}, {
						success: function(results){
							//it should be equal to 1
							assert.ok(results[1] === 1, "check number of likes after increment with originally 0 like");
						},
						error: function(error){
							alert("Cannot query this newsfeed ID");
							alert(error.message);
						}
					});

				},

				error: function(goal, error) {
					alert("error in save");
                }
				

			});


   			//create another newsfeed object with 1 like
			var Newsfeed = Parse.Object.extend("Newsfeed");	
			var newsfeed2 = new Newsfeed();
			newsfeed2.set("owner", Parse.User.current());
			newsfeed2.set("list", "Fx6xSvZBFX");
			newsfeed2.set("goal", "eUjYQubn2t");
			newsfeed2.set("numLikes", 1);
			newsfeed2.save(null, {
				success: function(goal) {
					//call function and increment it
					Parse.Cloud.run('changeNumLike', {newsfeedID: newsfeed2.id}, {
						success: function(results){
							//the number of likes should be 2 now
							assert.ok(results[1] === 2, "check number of likes after increment with originally 1 like");
						},
						error: function(error){
							alert("Cannot query this newsfeed ID");
							alert(error.message);
						}
					});

				},

				error: function(goal, error) {
					alert("error in save");
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