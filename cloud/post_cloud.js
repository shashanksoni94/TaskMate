
//getPost cloud function to get the post
Parse.Cloud.define("getPost", function(request, response){

    //query for newsfeed objects
	var Newsfeed = Parse.Object.extend("Newsfeed");
	var id = request.params.objectId;
	var query = new Parse.Query(Newsfeed);
	
	var owner;
	query.include('owner');

    //use objectId to get the newsfeed object
	query.get(id, {
		success: function(result) {
    		// The object was retrieved successfully.
        	var object = result;

            //get the properties from newsfeed object
    		var messageStr = object.get('message');
    		var likes = object.get('numLikes');
    		var arrayOfUsers = object.get('liked');

            //get the owner and return the newsfeed object
    		owner = object.get('owner').id;
    		response.success(result);
    	},

        //error messages
  		error: function(object, error) {
    		response.error("Error1: " + error.code + " " + error.message);
            return;
  		}
	});
});


//cloud function to get user info
Parse.Cloud.define("getUserInfo", function(request, response){
    //query for the user
	var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    var ownerId = request.params.objectId;


    //user ownId to get the user object
	query.get(ownerId, {
    	success: function(result) {

            //get the name and image
    		var name=result.get('firstName')+" "+result.get('lastName');
    		var image=result.get('profilePicture');
            
            //if the image is undefined, set it to default image
    		if (image == undefined)
    		{
                
    			var picURL = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';
    		}

            //else, set the image URL to be the image url
    		else
    		{
                
    			var picURL = image.url();
    		}

            //return the user
    		response.success(result);

    	},

        //error messages
    	error: function(error) {
    		response.error("Error2: " + " " + error.message);
            return;
    		//alert("Error: " + error.code + " " + error.message);
    	}
    });
});

//cloud function for display comment
Parse.Cloud.define("displayComment", function(request, response){

    //query for comment objects
	var Comment = Parse.Object.extend("Comment");
	var ownerId = request.params.objectId;
	var query = new Parse.Query(Comment);
	query.equalTo('owner', ownerId);
    query.include('userPointer');

	query.find({
		success: function(results) {

                //return the array of comment objects
        		response.success(results);
    //}


},

//error messages
error: function(error) {
	alert("comments alert");
	alert("Error: " + error.code + " " + error.message);
}
});
});
