    var friendlist = {};
    var photoDisplayed = false;

    window.fbAsyncInit = function() {
    FB.init({appId: '649482025087509', status: true, cookie: true,xfbml: true });

    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        testAPI();
      } else if (response.status === 'not_authorized') {
        FB.login();
      } else {
        FB.login();
      }
    });
    };

    // Load the SDK asynchronously
    (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
    }(document));

    // This testAPI() function is only called in those cases. 
    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        if(!photoDisplayed){
          getFriends(response);
          getProfilePicture(response.id);
          photoDisplayed = true;
        }
      });
    }

    function getFriends(user) {
     FB.api('/me/friends', function(response) {
        for(var i = 0; i < 10; i++){
        //for(var i = 0; i < response.data.length; i++){
          friendlist[response.data[i].name] = response.data[i].id;
          $('#friendlist').append(
            "<li><img class=\'friend\' src=\'https://graph.facebook.com/" 
            + response.data[i].id + "/picture\'/><span><input type=\"checkbox\">"
            + response.data[i].name + "</span></li>");
        }
        setUpWithFriends(friendlist, user, response);
       });
     }

     function getProfilePicture(id){
      var image = "<img src=\'https://graph.facebook.com/" + id + "/picture\' />";
      $('#user').prepend(image);
     }