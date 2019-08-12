//Config

require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api')
var fs = require('fs')


var nodeArgs = process.argv;
let term = "";
let operator = process.argv[2];

//API SEARCHER FUNCTIONS=========================================================================

//SPOTIFY SEARCHER
let spotifythis = (song) => {

    var spotify = new Spotify(keys.spotify);

    if (song === "") {song = "Smells Like Teen Spirit"}

    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log("\n------------------------------------------------\n")
      console.log(data.tracks.items[0].artists[0].name); 
      console.log(data.tracks.items[0].name); 
      console.log(data.tracks.items[0].external_urls.spotify); 
      console.log(data.tracks.items[0].album.name); 
      console.log("\n------------------------------------------------\n")
      });

}


//CONCERT SEARCHER
let concertthis = (artist) => {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    if (artist === "") {artist = "chvrches"}

    axios.get(queryUrl).then(

        function(response) {
            console.log("\n------------------------------------------------\n")
            console.log(response.data[0].venue.name);
            console.log(response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log(moment().format((response.data[0].datetime, "MM/DD/YYYY")));
            console.log("\n------------------------------------------------\n")
        }
    )

}


//MOVIE SEARCHER
let moviethis = (movie) => {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    if (movie === "") {movie = "Mr. Nobody"}

    axios.get(queryUrl).then(

        function(response) {

            console.log("\n------------------------------------------------\n")
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes: " + response.data.Ratings[2].Value);
            console.log("Origin: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("\n------------------------------------------------\n")

        })
        .catch(function(error) {

            if (error.response) {
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            }
            console.log(error.config);
        });

}


//VOICE FUNCTION
let liri = () => {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(" ");
        operator = dataArr[0];
        term = dataArr[1]

        for ( i = 2; i < dataArr.length - 1; i++) {
                term = term + "+" + dataArr[i];
        }

        searcher()
        
      });
}


const searcher = () => {
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        term = term + "+" + nodeArgs[i];
    } else {
        term += nodeArgs[i];
    }

}

switch(operator) {

    case "spotify-this-song":
        spotifythis(term);
        break;
    case "concert-this":
        concertthis(term);
        break;
    case "movie-this":
        moviethis(term);
        break;
    case "do-what-it-says":
        liri(term);
        break;
    default:
        console.log('Please search with parameters "spotify-this-song", "concert-this", or "movie-this"');

}

}

searcher();
