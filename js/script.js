
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    // Google Maps API ajax requests
    // load street view

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl +'">');

    // NYTimes API Ajax request

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr +     'sort=newest&api-key=4ca3bc44ea494fda832d340c6bd947c5'
    $.getJSON(nytimesUrl, function (data) {
        
        $nytHeaderElem.text('New York Times Articles about ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li-class="article">' + 
                '<a href="'+article.web_url+'">'+article.headline.main+
                    '</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Article could not be loaded');
    });


    //load wikipedia data

    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback'

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        // jsonp: "callback", 
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTImeout(wikiRequestTImeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
