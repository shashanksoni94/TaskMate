//Newsfeed controller
var NewsfeedController =function ($scope){

    Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");
    var Newsfeed = Parse.Object.extend("Newsfeed");
    //query for all the newsfeed objects
    var query = new Parse.Query(Newsfeed);
    var address=location.search;
    var id=address.substring(1,address.length);
    var current_Id = Parse.User.current().id;
    var ownerId;
    var owner;

    //cloud function to get and display the post content
    Parse.Cloud.run('getPost', {objectId: id},{
        success: function(result){
            var flag = true;
            ownerId = result.get('owner').id;
            var object = result;
            var messageStr = object.get('message');
            var likes = object.get('numLikes');
            var arrayOfUsers = object.get('liked');


            $scope.message = messageStr;
            if(arrayOfUsers!=null){
                for(var i=0; i<arrayOfUsers.length; i++){
                    if(arrayOfUsers[i]==current_Id){
                        flag=false;
                        $scope.Like = likes+" Unlike";
                        break;
                    }
                }            
            }
            if(flag){
                $scope.Like = likes + " Like";
            }
            $scope.$digest();


    //cloud function to retrieve the owner of the post
    Parse.Cloud.run('getUserInfo', {objectId: ownerId}, {
        success: function(result){
            var name=result.get('firstName')+" "+result.get('lastName');
            var image=result.get('profilePicture');
            if (image == undefined)
            {

                var picURL = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';
            }
            else
            {

                var picURL = image.url();
            }
            $scope.username = name;
            $scope.profilePicture = picURL;
            $scope.profilePage = "../profile.html?" + ownerId;
            $scope.$digest(); 
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }

    });

    //cloud function to display the post's comments and users info of each comment
    $scope.Comments=[];
    Parse.Cloud.run('displayComment', {objectId: id}, {
        success: function(results){
            //alert(results.length);
            for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                //alert(object.id);
                var contentToShow = object.get('content');
                var person = object.get("userPointer");
                var profilePage="../profile.html?" + person.id;
                var image=person.get('profilePicture');
                if (image == undefined)
                {
                    var picURL = 'http://cdn.cutestpaw.com/wp-content/uploads/2012/06/l-Bread-Cat-FTW.png';
                }
                else
                {
                    var picURL = image.url();
                }
                var fullName=person.get('firstName')+" "+person.get('lastName');           
                $scope.Comments.push({content: contentToShow, 
                    username: fullName, 
                    commenterProfilePage: profilePage,
                    commenterProfilePicture: picURL, 
                });
            }
            $scope.$digest();
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
},
error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    alert("Error.");
}
});

//create like notification to the owner of the post when current user press like
//current user could unlike the post that has been previously liked
$scope.like = function(){
    var status=document.getElementById('likeThePost').innerText;
    //current post
    query.get(id, {
        success: function(result) {
            var temp=result.get('numLikes');
            var arrayOfUsers=result.get('liked');

            //like a post
            if(status.match("Unlike")==null){

                result.set('numLikes',temp+1);
                result.add('liked',current_Id);
                $scope.Like=result.get('numLikes')+" Unlike";

                //creating a notification when pressing like button
                var Notification = Parse.Object.extend("Notification");
                var notif = new Notification();

                var User = Parse.Object.extend("User");
                var user_query = new Parse.Query(User);
                user_query.get(current_Id, {
                    success: function(result) {
                    // The object was retrieved successfully.
                    notif.set("owner",ownerId);
                    notif.set("outgoing",id);
                    notif.set("user", result);                   
                    notif.set("type","like");
                    var notif_content=result.get('firstName')+" "+result.get('lastName')+" liked your post.";
                    notif.set("content",notif_content);
                    notif.save();
                },
                error: function(object, error) {
                }
            });

                result.save();
            }
            else{
                //unlike a previously liked post
                result.set('numLikes',temp-1);
                var index=0;
                for(var i=0; i<arrayOfUsers.length; i++){

                    if(arrayOfUsers[i]==Parse.User.current().id){
                        index=i;
                        break;
                    }
                }
                arrayOfUsers.splice(index,1);
                result.set('liked',arrayOfUsers);
                $scope.Like=result.get('numLikes')+" Like";
                result.save();
            }
            $scope.$digest();
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }


    });


}

//function to add comment to the post
$scope.addComment=function(){

    var Comment=Parse.Object.extend("Comment");
    var comment=new Comment();
    var User = Parse.Object.extend("User");
    var user = new User();
    user.id = current_Id;
    //owner of the current post
    query.get(id, {
        success: function(result) {
            result.set('numComments',result.get('numComments')+1);
            result.save();
        },
        error: function(error) {
            alert("alert");
            alert("Error: " + error.code + " " + error.message);
        }
    });
    //create a comment object
    comment.set('owner',id);
    comment.set('user',current_Id);
    
    comment.set('userPointer',user);
    var input=document.getElementById("commentInput").value;
    comment.set('content',input);
    comment.save();


    //creating a notification when pressing like button
    var Notification = Parse.Object.extend("Notification");
    var notif = new Notification();

    var User = Parse.Object.extend("User");
    var user_query = new Parse.Query(User);
    user_query.get(current_Id, {
        success: function(result) {
        // The object was retrieved successfully.
        notif.set("owner",ownerId);
        notif.set("outgoing",id);
        notif.set("user", result);                   
        notif.set("type","comment");
        var notif_content=result.get('firstName')+" "+result.get('lastName')+" commented on your post.";
        notif.set("content",notif_content);
        notif.save();
        location.reload();
    },
    error: function(object, error) {
        alert("Error of " + error.message);
    }
});
    
}
//display the commenter info including profile picture
$scope.profilePictureURL = "img/glyphicons-4-user.png";

$scope.numberOfNotification = Parse.User.current().get('numNotif');

$scope.profilePictureURL = "img/glyphicons-4-user.png";

picture = Parse.User.current().get("profilePicture");
if (picture != undefined) {
    $scope.profilePictureURL = picture.url();
}

//redirect to newsfeed page
$scope.goHome = function() {
    window.location.href = "./newsfeed.html";
}

//redirect to notifications page
$scope.goNotification = function() {
    window.location.href = "./notifications.html";
}

//redirect to search page
$scope.search = function(){
    window.location.href = "./search.html?" + $scope.searchInput;
};

//redirect to profile page
$scope.goProfile = function(){
    window.location.href = "./profile.html?" + Parse.User.current().id;
};

//log out the user
$scope.logOut = function(){
    Parse.User.logOut();
    window.location.href = "./index.html";
};

}
