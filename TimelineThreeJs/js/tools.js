$( document ).ready(function() {
    var state = 'b';
    var currentlyCheckedFriends = [];

    //on button click, set searchbar state
    $("button").click(function(event) {
        var newState = event.target.id;
        if(newState === state){
            $("#searchbar").toggle();
        } else {
            state = newState;
            var myClass = $(this).attr("class");
           if (myClass === 'nobar') {
                showSearchBar(false);
                bar = false;
                showAlternateViews(true);
           } else {
                showSearchBar(true);
                bar = true;
                showAlternateViews(false);     
           }
   }
    });

    //handles the viewport for friendlist
    function showSearchBar(show){
        if(show){
            $("#searchbar").show();
            $("#friendlist").show();
        } else {
            $("#searchbar").hide();
            $("#friendlist").hide();
        }
    }

    function showAlternateViews(show){
        if(show){
            $('#small-view-3D').show();
        } else {
            $('#small-view-3D').hide();
        }
    }

    //changes the UI based on button state
    function setButtonState(id){
        switch (id)
        {
        case 'a': 
                break;
        case 'b': 
                break;
        case 'c': 
                break;
        default:  console.log("Unknown button pressed, see tools.js");
        }
    }

    //keep track of which friends are checked
    $('#friendlist').on('click', function(){
      var names = [];
       $('input:checked').each(function() {
           names.push($(this).parent().text());
     });
       currentlyCheckedFriends = names;
    });

});