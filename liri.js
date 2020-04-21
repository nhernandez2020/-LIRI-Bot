require("dotenv").config();
var axios = require("axios");
var keys = require("./key.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require('fs');
var search = process.argv[2];
var term = process.argv.slice(3).join("+");
var searchTerm = process.argv.slice(3).join(" ");
var dashes = "\n-----------------------------------------------"

function searchConcerts(term) {
    var URL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function (response) {


        console.log(dashes + "\n");

        console.log("Venue: " + response.data[0].venue.name);
        if (response.data[0].venue.region !== "") {
            console.log("Location: " + response.data[0].venue.city + ", " +
                response.data[0].venue.region + ", " + response.data[0].venue.country);
        }
        else {
            console.log("Venue location: " + response.data[0].venue.city + ", " +
                response.data[0].venue.country);
        }
        console.log("Date of the Event: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        console.log(dashes);
    })
        .catch(function (error) {
            console.log(error);
        })
}

function searchSpotify(term) {
    spotify.search({
        type: "track",
        query: term,
        limit: 1
    }).then(function (response) {
        console.log(dashes + "\n");
        console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
        console.log("Track: " + response.tracks.items[0].name);
        console.log("Preview Song link: " + response.tracks.items[0].href);
        console.log("Album: " + response.tracks.items[0].album.name);
        console.log(dashes);
    });
};

function searchMovies() {
    axios
        .get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            console.log(dashes + "\n");
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country/Countries Produced: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log(dashes)
        });
};

function doThis() {
    fs.readFile('random.txt', 'utf8', function (err, data) {

        var doArr = data.split(',');
        run(doArr[0], doArr[1]);

        if (err) {
            return console.log(err);
        }
    });
}


function run(search, searchTerm) {
    // case switchs
    switch (search) {
        case 'concert-this':
            console.log("Searching Concerts: " + searchTerm + "\n")
            searchConcerts();
            break;
        case 'spotify-this-song':
            console.log("Searching Spotify: " + searchTerm + "\n")
            searchSpotify(searchTerm);
            break;
        case 'movie-this':
            console.log("Searching Movie: " + searchTerm + "\n")
            searchMovies();
            break;
        case 'do-what-it-says':
            doThis();
            console.log("Searching Do What It Says: " + searchTerm + "\n")
            break;
        default:
            console.log("Invalid command. \nconcert <concert name> \nspotify <spotify>");
    }
};

run(search, term);