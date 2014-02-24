$( document ).ready(function() {
    var bar = false;

    $("button").click(function(event) {
       var myClass = $(this).attr("class");
       //show or hide the searchbar
       if (myClass === 'nobar') {
            showSearchBar(false);
            bar = false;
       } else {
            if (!bar) {
                showSearchBar(true);
                bar = true;
            } else {
                showSearchBar(false);
                bar = false;
            }        
       }
       setButtonState(event.target.id);
    });

    function showSearchBar(show){
        if(show){
            $("#searchbar").show();
        } else {
            $("#searchbar").hide();
        }
    }

    function setButtonState(id){
        switch (id)
        {
        case 'a': 
                break;
        case 'b': 
                break;
        case 'c': 
                break;
        default:  document.write("Unknown grade<br />")
        }
    }

});