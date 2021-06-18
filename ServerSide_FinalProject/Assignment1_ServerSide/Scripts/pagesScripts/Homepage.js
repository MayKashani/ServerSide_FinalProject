
var popularMode = "";

$(document).ready(function () {
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    tvMethod = "3/tv/";
    movieMethod = "3/movie/";
    api_key = "api_key=" + key;

    getPopularTv();
    getPopularMovie();

    $(".popularButton").click(function () {
        if ($(this).css("background-color") != "aqua")
            togglePopular();
    });

});

function getPopularTv()
{
    let apiCall = url + tvMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopShowSuccessCB, getTopShowErrorCB);
};

function getTopShowSuccessCB(topTv) {
    
    popularShows = topTv.results;
    let str = "";
    for (let i = 0; i < popularShows.length; i++) {
        str += "<li id = '" + popularShows[i].id + "'class = 'card'>";
        image = "<img class='card-img-top' src = '" + imagePath + popularShows[i].poster_path + "'";
        cardBody = "<div class='card-body'><h5>" + popularShows[i].name + "</h5> <p class='card-text'>" + popularShows[i].original_language + "</p></div>";
        str += image + cardBody + "<p class='goToPage'>Go to page</p></li> ";
    }
    $("#anyShowType").html(str);
    $("#showTvPopular").css("background-color", "aqua");
}

function getTopShowErrorCB(err) {
    console.log(err);
}

function getPopularMovie() {
    let apiCall = url + movieMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopMovieSuccessCB, getTopMovieErrorCB);
};

function getTopMovieSuccessCB(movies) {
    console.log(movies);
    popularMovies = movies.results;
    let str = "";
    for (let i = 0; i < popularMovies.length; i++) {
        str += "<li id = '" + popularMovies[i].id + "'class = 'card'>";
        image = "<img class='card-img-top' src = '" + imagePath + popularMovies[i].poster_path + "'";
        cardBody = "<div class='card-body'><h5>" + popularMovies[i].original_title + "</h5> <p class='card-text'>" + popularMovies[i].original_language + "</p></div>";
        str += image + cardBody + "</li>";
    }
    $("#anyMovieType").html(str);
    $("#popularMovie").hide();
    popularMode = "tv";
    trailerMode = "tv";
}
function getTopMovieErrorCB(err) {
    console.log(err);
}

function togglePopular() {
    if (popularMode=="tv") {
        $("#popularMovie").show();
        $("#popularTV").hide();
        $("#showTvPopular").css("background-color", "white");
        $("#showMoviePopular").css("background-color", "aqua");
        popularMode = "movie";
    }
    else {
        $("#popularTV").show();
        $("#popularMovie").hide();
        $("#showMoviePopular").css("background-color", "white");
        $("#showTvPopular").css("background-color", "aqua");
        popularMode = "tv";
    }
}

