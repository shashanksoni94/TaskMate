/* Initialize Parse database */
Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");
var User = Parse.Object.extend("User");

/* Controller for navigation bar */
function NavigationBarController($scope) {
	/* Get the number of notification for current user */
	$scope.numberOfNotification = Parse.User.current().get('numNotif');

	/* Inilialize the profile picture in navigation bar */
	$scope.profilePictureURL = "img/glyphicons-4-user.png";

	/* Check if user have profile picture */
	picture = Parse.User.current().get("profilePicture");
	if (picture != undefined) {
		$scope.profilePictureURL = picture.url();
	}

  	/* Home button for navigation bar */
	$scope.goHome = function() {
    	window.location.href = "./newsfeed.html";
	}

	/* Notification button for navigation bar */
	$scope.goNotification = function() {
		window.location.href = "./notifications.html";
	}

	/* Search button for navigation bar */
	$scope.search = function(){
		window.location.href = "./search.html?" + $scope.searchInput;
	};

	/* My profile button for navigation bar */
	$scope.goProfile = function(){
		window.location.href = "./profile.html?" + Parse.User.current().id;
	};

	/* Logout button for navigation bar */
	$scope.logOut = function(){
		Parse.User.logOut();
    	window.location.href = "./index.html";
	};


}