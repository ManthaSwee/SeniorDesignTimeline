function generateJSON(friendlist, user, response, callback){
var names = Object.keys(friendlist);
var jsonArr = [];

        jsonArr.push({
            name : user.name,
            joined_date : new Date(2008, 0, 1)
        });

// asyncLoop(friendlist.length, function(loop) {
asyncLoop(1, function(loop) {
    FB.api('/me/mutualfriends/'+friendlist[names[loop.iteration()]],function(response) {
        var mutual = [];
        for(var j = 0; j < response.data.length; j++){
            mutual.push({
                name: response.data[j].name,
                id : response.data[j].id
            });
        }

        jsonArr.push({
            friend : addPerson(loop.iteration(), mutual)
        });

        // Okay, for cycle could continue
        console.log(loop.iteration())
        loop.next();
    })},
    function(){callback(jsonArr)}
);

function addPerson(i, mutual){
    var person = [];
    var start = randomDate(new Date(2008, 0, 1), new Date());
    person.push({
        name : names[i],
        fbid : friendlist[names[i]],
        photo : "https://graph.facebook.com/" + response.data[i].id + "/picture",
        startdate : start,
        photos : randomPhotos(start, mutual),
        likes : randomLikes(),
        mutualfriends : mutual,
        interactions : randomInteractions(start, new Date())
    });
    return person;
}

function randomPhotos(start, mutual){
    var photos = [];
    for(var i = 0; i < Math.floor((Math.random()*10)); i++){
        photos.push({
                id : Math.floor((Math.random()*90000)+ 10000),
                date : randomDate(start, new Date()),
                tags : randomPeople(mutual)
        });
    }
    return photos;
}

function randomInteractions(start, end){
    var interactions = [];
    var types = ['message', 'wall post'];
    var range = [200, 5];
    for(var i = 0; i < Math.floor((Math.random()*10)); i++){
        var randomInt = Math.floor((Math.random()*types.length));
        var date = randomDate(start, end);
        interactions.push({
                type : types[randomInt],
                date : date,
                count : Math.floor((Math.random()*range[randomInt])+1)
        });
        start = date;
    }
    return interactions;
}

function randomPeople(mutual){
    var people = [];
    for(var i = 0; i < Math.floor((Math.random()*5)); i++){
        people.push({
            name: mutual[Math.floor((Math.random()*mutual.length))],
        });
    }
    return people;
}

function randomLikes(){
    return "Nickelback";
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

}