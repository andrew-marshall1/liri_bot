// Packages
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify (keys.spotify);
  
  // Store the search variables
  var search = process.argv[2];
  var term = process.argv.splice(3).join(" ");

  // Do What It Says
  var IwantThis = function() {
    fs.readFile("./random.txt", "utf8", (err, data) => {
      if (err) throw err;
      var output = data.split(",");
      if(output.length === 2) {
        searches(output[0], output[1].replace(/"/g,""));
      } else{
        searhes(output[0]);
      }
    });
  }


  //  * `concert-this`
  //  `node liri.js concert-this <artist/band name here>`

   var concertThis = function(artist) {
     var urlConcert = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
     axios.get(urlConcert).then(function(response){
      var jsonInfo = response.data[0];
          // Name of Artist
          console.log("Artist/Band Name: " + jsonInfo.lineup[0]);
          // Name of the venue
          console.log("Venue Name: " + jsonInfo.venue.name);
          // Venue location
          console.log("Venue Location (Country, City): " + jsonInfo.venue.country + ", " + jsonInfo.venue.city);
          // Date of the Event (use moment to format this as "MM/DD/YYYY")
          console.log("Date of Event: " + moment(jsonInfo.datetime).format("MM/DD/YYYY"));
   });
  }

  //  * `spotify-this-song`
  //  `node liri.js spotify-this-song '<song name here>'`
   var spotifyThis = function(ter) {
      //If no song is provided then your program will default to "The Sign" by Ace of Base.
      if (ter === "") {
        ter = "The Sign + Ace of Base";
      }
    spotify.search({ type: 'track', query: ter })
      .then(function(response) {
        var resp = response.tracks.items[0]
        // Artist Name
        console.log("Artist: " , resp.album.artists[0].name);
        // Song Name
        console.log("Song Title: " , resp.name);
        // Preview Link
        console.log("Preview URL: " , resp.preview_url);
        // Album Name
        console.log("Album Name: " , resp.album.name);
      })
      .catch(function(err) {
        console.log(err);
      });
    }

  // `movie-this`

   var movieThis = function(ter) {
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if(ter === "") {
      ter = "Mr. Nobody";
    }
    
     var movieURL = "http://www.omdbapi.com/?t=" + ter + "&apikey=eb179323&t";
     
    axios.get(movieURL).then(function(response){
      var jsonin = response.data;
          // Title of the movie.
          console.log("Movie: " + jsonin.Title);
          // Year the movie came out.
          console.log("Release Year: " + jsonin.Year);
          // Rating
          console.log("Rating: " +jsonin.Rated);
          // IMDB Rating of the movie.
          console.log("IMDB Rating: " + jsonin.imdbRating);
          // Rotten Tomatoes Rating of the movie.
          console.log("Rotten Tomatoes Rating: " + jsonin.Ratings[1].Value);
          // Country where the movie was produced.
          console.log("Country of Origin: " + jsonin.Country);
          // Language of the movie.
          console.log("Language: " + jsonin.Language);
          // Plot of the movie.
          console.log("Plot: " + jsonin.Plot);
          // Actors in the movie.
          console.log("Featured Actors: " + jsonin.Actors);
    })

   };

//      * Edit the text in random.txt to test out the feature for movie-this and concert-this.


 // If/Else statement to run the correct API function to search
 function searches (sea, ter) {

  console.log(ter);
  
 if (sea === "concert-this") {
  concertThis(ter);
} else if (sea === "spotify-this-song") {
  spotifyThis(ter);
} else if (sea === "movie-this") {
  movieThis(ter);
} else if(sea === "do-what-it-says") {
  IwantThis();
} else {
  console.log("Please use a correct search term.")
};
}

searches(search, term);