$( document ).ready(function() {
    var state = 'b';
    var currentlyCheckedFriends = [];
    var lastChecked;

    //on button click, set searchbar state
    $("button").click(function(event) {
        var newState = event.target.id;
        if(newState === state && newState != 'a'){
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
      var nextChecked;
       $('input:checked').each(function() {
            if($(this).parent().text() != lastChecked){
                names.push($(this).parent().text());
                selectObjectViaList($(this).parent().text());
                nextChecked = $(this).parent().text();
            } else {
                $(this).attr('checked', false);
            }
     });
       lastChecked = nextChecked;
       currentlyCheckedFriends = names;
    });

});

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

   // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
          
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}