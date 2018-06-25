// Read and set environment variables ==========================
require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("file-system");

// Assign arguments to variables ================================
var liriAction = process.argv[2];
var liriRequest = process.argv[3];

// Determine action based on first argument =====================
switch (liriAction) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        liri();
        break;

    default:
        console.log("Please try again, Liri doesn't understand your request.");
}

// Twitter function ================================================
function tweets() {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: 'utahjazz' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("===========================")
                console.log(tweets[i].user.name)
                console.log(tweets[i].text)
            }
            console.log(tweets.length)

        }
    });
}


// Spotify function =================================================
function spotify() {
    var spotify = new Spotify(keys.spotify);
    var songName = liriRequest;
    var getArtistNames = function (artist) {
        return artist.name;
    }

    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log("#" + (i + 1));
            console.log("Artist(s): " + songs[i].artists.map(
                getArtistNames));
            console.log("Song Name: " + songs[i].name);
            console.log("Preview Song: " + songs[i].external_urls.spotify);
            console.log("Album: " + songs[i].album.name);
            console.log("========================================================")
        }
    });
}

// OMDB movies function ===================================================

function movie() {
    var movieName = liriRequest;
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName, function (error, response, body) {
        if (error) {
            console.log("An error has occurred: " + error);
            console.log('statusCode:', response && response.statusCode);
        }
        var jsonData = JSON.parse(body);
        console.log("===========================")
        console.log('Movie Title: ' + jsonData.Title);
        console.log('Release Year: ' + jsonData.Year);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Rotten Tomato Rating: ' + jsonData.Ratings[1].Value);
        console.log('Country of Origin: ' + jsonData.Country);
        console.log('Movie Language(s): ' + jsonData.Language);
        console.log('Movie Plot: ' + jsonData.Plot);
        console.log("Movie's Actors: " + jsonData.Actors);
    });
}

// do-what-it-says function (data from random.txt file) =====================

function liri() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;
        console.log("This is what the random.txt file command is: " + data);

        var dataArray = data.split(",");

        if (dataArray[0] === "spotify-this-song") {
            liriAction = dataArray[0];
            liriRequest = dataArray[1];
            spotify();
        } else if (dataArray[0] === "my-tweets") {
            liriAction = dataArray[0];
            liriRequest = dataArray[1];
            tweets();
        } else if (dataArray[0] === "movie-this") {
            liriAction = dataArray[0];
            liriRequest = dataArray[1];
            movie();
        } else {
            console.log("Please try again, Liri doesn't understand your request. Check random.txt file.");
        }
    });
}