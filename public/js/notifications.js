/* Controller for notifications */
var NotificationController=function($scope) {

  /* Initialize Parse database */
	Parse.initialize("eVEt0plCyNLg5DkNtgBidbruVFhqUBnsMGiiXp63", "KPiNXDn9LMX17tLlMmSbI4NvTKgWPk36qBLMTqco");

  /* Declare variable to store notifications */
  $scope.Notifications=[];

  /* Run cloud code to get notifications */
  Parse.Cloud.run('getNotifications', {}, 
    {
      success: function(results) {
        /* Loop through every notifications */
        for (var i = 0; i < results.length; i++) {
          $scope.Notifications.push(results[i]);
        }

        /* Update the angular */
        $scope.$digest();
      },
      error: function(error) {
        alert("error");
      }
    }
  );
}

