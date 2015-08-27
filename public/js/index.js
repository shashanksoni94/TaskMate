Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

var logIn = angular.module("logIn", []);

logIn.controller("loginCtrl", ["$scope", function loginCtrl($scope){

    //check to see if "remember me" is checked
    if(localStorage.remember === "true"){
      $scope.email = window.atob(localStorage.email);
      $scope.password = window.atob(localStorage.password);
      document.getElementById("checkbox").checked = true;
    }

    

    $scope.submit = function(){

    Parse.User.logIn($scope.email, $scope.password, {
      success: function(user) {
        //if "remember me" is checked, encrypt variables and store them
        if(document.getElementById("checkbox").checked === true){
          localStorage.email = window.btoa($scope.email);
          localStorage.password = window.btoa($scope.password);
          localStorage.remember = true;
        } 

        //if "remember me" is not checked, clear the local storage
        else {
          localStorage.email = undefined;
          localStorage.password = undefined;
          localStorage.remember = false;
        }

        window.location.href = "../newsfeed.html";

      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert("Incorrect email or password detected. \nPlease try again. :(");
      }
    });  


    }
}]);





