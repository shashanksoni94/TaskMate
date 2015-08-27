/* Create a new user */
var signUpApp = angular.module("signUpApp", []);

signUpApp.controller("signUpCtrl", ["$scope", function signUpCtrl($scope){
    /* Get Parse database */
    Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

    $scope.submit1 = function(){

        /* Run signup cloud code */
        Parse.Cloud.run('signup', {email: $scope.newemail, password: $scope.newpassword, firstName: $scope.firstName, lastName: $scope.lastName}, {
            success: function(result) {
                /* Redirect to landing page */
                window.location.replace("../index.html");
            },
            error: function(error) {
                alert(error);
            }
        });
	}
}]);
	