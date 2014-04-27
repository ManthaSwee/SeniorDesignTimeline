function generateJSON(friendlist, user, response, callback){
var names = Object.keys(friendlist);
var jsonArr = [];

        jsonArr.push({
            name : user.name,
            joined_date : new Date(2008, 0, 1)
        });

// asyncLoop(friendlist.length, function(loop) {
asyncLoop(2, function(loop) {
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
    var interactions = randomInteractions(start, new Date());
    person.push({
        name : names[i],
        fbid : friendlist[names[i]],
        photo : "https://graph.facebook.com/" + response.data[i].id + "/picture",
        startdate : start,
        photos : randomPhotos(start, mutual),
        likes : randomLikes(),
        clicked_likes : Math.floor((Math.random()*200)),
        rank : 100,
        mutualfriends : mutual,
        interactions : interactions
    });
    return person;
}

function randomPhotos(start, mutual){
    var photos = [];
    for(var i = 0; i < Math.floor((Math.random()*10)); i++){
        photos.push({
                id : Math.floor((Math.random()*90000))+ 10000,
                date : randomDate(start, new Date()),
                tags : randomPeople(mutual)
        });
    }
    return photos;
}

function randomInteractions(start, end){
    var interactions = [];
    var types = ['message', 'wall post', 'link'];
    var range = [200, 2, 1];
    for(var i = 0; i < Math.floor((Math.random()*30)); i++){
        var randomInt = Math.floor((Math.random()*types.length));
        var date = randomDate(start, end);
        interactions.push({
                type : types[randomInt],
                date : date,
                count : Math.floor((Math.random()*range[randomInt])+1)
        });
    }
    interactions = sortByKey(interactions, 'date');
    return interactions;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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

function getFriendRank(friend){
    var rank = 0;
    rank+=friend.mutualfriends.length;
    rank+=friend.photos.length*=10;
    rank+=friend.clicked_likes;
    for(var i = 0; i > friend.interactions.length; i++){
        if(friend.interactions[i].type = 'message'){
            rank+=friend.interactions[i].count;
        } else if (friend.interactions[i].type = 'wall post') {
            rank+=friend.interactions[i].count*50;
        } else if (friend.interactions[i].type = 'link') {
            rank+=friend.interactions[i].count*50;
        } else if (friend.interactions[i].type = 'like') {
            rank+=2;
        }else {
            console.log("undefined type of message detected");
        }
    }
    console.log("rank =" + rank);
    return rank;
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