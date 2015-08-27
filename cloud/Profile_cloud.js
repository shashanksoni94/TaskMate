//Create a list in profile.html
Parse.Cloud.define('makeList', function(request, response) {

        var List = Parse.Object.extend("List");
        var list = new List();
        //If the user did not enter a name
        if(request.params.name.length === 0){
            response.error("List cannot be created without name.")
            return;
        }
        list.set("owner", request.params.userId);
        list.set("name", request.params.name);
        list.set("description", request.params.description);
        list.save(null, {
            success: function(list) {
            	results = [];
            	results.push(list.id);
            	results.push("Created list object with name \"" + request.params.name + "\" and description \"" + request.params.description + "\".");
                response.success(results);
            },
            error: function(list, error) {
                response.error("Error " + error.code + ": " + error.message);
                return;
            }
        });
});