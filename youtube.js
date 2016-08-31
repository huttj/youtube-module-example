/* Here's another way to create a module. It is simpler than the revealing
 * module pattern, but it also doesn't let you protect variables like API_KEY
 * and BASE_URL from being modified by other scripts.
 * https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
 */
var YouTube = {};

// These variables live on the module. The module's functions can see them, but
// so can everyone else.
YouTube.API_KEY  = YOUTUBE_API_KEY;
YouTube.BASE_URL = 'https://www.googleapis.com/youtube/v3/';

// Use the YouTube API to search for videos by a single search term
YouTube.search = function(term) {

    // We'll construct the url with the BASE_URL and the query parameters
    // required by the API. We also need to include our API key!
    // https://en.wikipedia.org/wiki/Query_string
    var url = this.BASE_URL + 'search' + '?part=snippet&type=video&q=' + term + '&key=' + this.API_KEY;

    // We'll do the request, then pass the results through `getVideoIds()` to
    // get just an array of the result videos' IDs. This means that this search
    // function will return a jQuery-flavor Promise that wraps a list of IDs.
    return $.get(url).then(getVideoIds);

    // The full result object from the API gets passed in here
    function getVideoIds(result) {

      // Here is where we grab the ID from each video/item object
      return result.items.map(getVideoId);

      // This function does the grabbing
      function getVideoId(item) {
        return item.id.videoId;
      }
    }

};
