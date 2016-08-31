/* This is the revealing module pattern. This lets us have "private" variables
 * that only our module can use. Other modules can't access or change them.
 * It starts with an IIFE (Immediately Invoked Function Expression), a function
 * that is created and called all at once, but not saved to a variable. This
 * us called a "closure", because it closes over the variables and functions
 * inside.
 * https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
 */
var Tracks = (function() {

  // These are the "private" variables. They are only accessible inside this
  // function, and the functions created in this function -- not outside.
  var x2js = new X2JS();

  // crossorigin.me is a service that lets us get around CORS issues. It's fine
  // for something like this, but you wouldn't want to do it for something sensitive,
  // since they could be sniffing everything you request.
  // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  var URL = 'https://crossorigin.me/http://feeds.musicchartfeeds.com/itunestop100songsusa?format=xml';

  // This is the actual `Tracks` object that the outside world sees. Only the
  // functions that live on this object can see `x2js` and `URL`.
  return {
    load: function load() {

      // Standard jQuery GET request
      return $.get(URL)

        // Here we want to convert the XML to JSON, and pull out the song titles
        // from the result
        .then(function(result) {

          // We use `.map()` to change the array of song objects into a new
          // array of titles
          return x2js.xml2json(result).rss.channel.item.map(function(item) {
            return item.title;
          });
        });
    }
  };

})();
