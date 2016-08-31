// This is all we have to call to load the videos and put them in the page. :)
// Also, always remember to include a `catch`! jQuery 3 is nice enough to tell
// you when there's an uncaught error, but some libraries don't. Make it a habit.
loadTopVideos(5, 2)
  .then(renderSongs)
  .catch(showError);


/* This function brings the two APIs together. First, it grabs the `count` top
 * songs from iTunes. Then, it uses those songs to search YouTube for
 * `videosPerSong` videos.
 *
 */
function loadTopVideos(total, videosPerSong) {

  // If these aren't provided, default to 10 and 2
  total         = total         || 10;
  videosPerSong = videosPerSong || 1;

  return Tracks.load()
    .then(function(tracks) {

      // Grap the top `count` tracks from the list of 100
      var topTen = tracks.slice(0, total);

      // An array of youtube promises; we make a request for each song title.
      // `.map()` turns the array of titles into an array of promises, here.
      var youtubePromises = topTen.map(function(title) {

        // Search YouTube and then take the top `videosPerSong`
        return YouTube.search(title).then(combineVideoIdsAndTitle);


        // A small helper function to turn youtube results list into an object
        // with both the title AND the results
        function combineVideoIdsAndTitle(results) {
          return {
            title: title,
            videos: results.slice(0, videosPerSong)
          };
        }

      });

      // We use `$.when()` to wait for all of the video searches to be done. It
      // takes all of those promises and gives us a single one that resolves
      // when all of them are done. Here, we use `.apply()` to be able to use
      // the function with an array, rather than separate parameters. It's an
      // annoying deficiency of the jQuery promise implementation.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
      return $.when.apply($, youtubePromises);

    })
    .then(function() {

      // This is a trick to turn the `arguments` object into an array. Recall that
      // `arguments` is an array-like object that contains all of the parameters
      // that were passed into the function. The arguments in this case are all of
      // the results of searching YouTube.
      return Array.prototype.slice.call(arguments);
    });
}

// Render a list of songs to the page
function renderSongs(songs) {
  $('.videos').empty();
  songs.forEach(renderSong);
}

// Render a single song to the page. Make new elements for the title and the
// videos, and insert them into the page.
function renderSong(song) {

  // Make a container for the song title and its videos
  var $container = $('<div/>');

  // Make the title and put it in the container
  $('<h1/>').text(song.title).appendTo($container);

  // Make a video element for each video and insert it into the container
  song.videos.forEach(function(videoId) {

    // Use the videoId to make the video element
    var $videoEl = $('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');

    // Add the videoElement to the container
    $container.append($videoEl)
  });

  // Add the song to the page
  $('.videos').append($container);

}

// If there's an error, this function will put it in the page
function showError(error) {
  $('.videos').empty().append($('h1').text(error.message));
}
