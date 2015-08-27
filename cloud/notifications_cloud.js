Parse.Cloud.define('getNotifications', function(request, response) {
  var Notification = Parse.Object.extend("Notification");
  var notifications = new Parse.Query(Notification);
  notifications.include("user");

  notifications.equalTo("owner", Parse.User.current().id);

  Parse.User.current().set("numNotif", 0);
  Parse.User.current().save();

  notifications.descending("createdAt");
  notifications.limit(15);

  var Notifications = [];
  var position = 0;
  var contents = [];
  var outgoings = [];
  var images = [];

  notifications.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];

        contents.push(results[i].get('content'));
        Notifications.push({content: object.get('content'),
                            outgoing: "",
                            image: ""});

        switch (object.get('type')) {
          case "like":
            outgoings.push("post.html?" + object.get('outgoing'));
            break;
          case "comment":
            outgoings.push("post.html?" + object.get('outgoing'));
            break;
          case "follow":
            outgoings.push("profile.html?" + object.get('outgoing'));
            break;
        }

        var user = object.get('user');
        image = user.get('profilePicture');
        if (image == undefined) {
          images.push('http://cdn.cutestpaw.com/wp-content/uploads/2012/06/1-Bread-Cat-FTW.png');
        } 
        else {
          images.push(image.url());
        }

        Notifications[position].outgoing = outgoings[position];
        Notifications[position].image = images[position];
        position++;
      }

      response.success(Notifications);
    },
    error: function(error) {
      response.error("Cannot find your notifications :D");
        return;
    }
  });
});