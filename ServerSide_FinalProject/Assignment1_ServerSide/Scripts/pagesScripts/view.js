$(document).ready(function () {

    
    errorPng = 'this.src="..//Images//noImage.jpg"';
    imagePath = "https://image.tmdb.org/t/p/w500/";

    getTVNames();
    getMovies();


    $(".favoriteButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            toggleFavorites();
    });

    $("#tvShows").change(getEpisodes);

})

function getTVNames() {
    let api = "../api/Seriess?mail=" + user.Mail +"&mode=Favorites";
    ajaxCall("GET", api, "", getTVNamesSuccessCB, getTVNamesErrorCB);
}

function getMovies() {
    let api = "../api/Movies?mail=" + user.Mail + "&mode=Favorites";
    ajaxCall("GET", api, "", getMovieSuccessCB, getMovieErrorCB);
}
function getTVNamesSuccessCB(series) {
    let str = "<option> Select TV Show </option>";
    for (let i = 0; i < series.length; i++)
        str += "<option id=" + series[i].Id + ">" + series[i].Name + "</option>";
    $("#tvShows").html(str);
    favoriteMode = "tv";
    $("#showTvFavorites").css("background-color", "aqua");
    $("#favoritesMovies").hide();
}

function getMovieSuccessCB(movies) {
    let str = "";
    if (movies.length>0)
    for (let i = 0; i < movies.length; i++) {
        str += "<div class='episodeCard'><div><img src='" + (imagePath + movies[i].Backdrop_Path) + "' onerror='" + errorPng + "'/></div><div><h3>" + movies[i].Title + "</h3><p><b>Overview:</b> " + movies[i].Overview + "</p>";
        str += "<p><b>Air Date: </b>" + movies[i].Release_Date + "</p></div>"
        str += "</div><hr>"
    }
    $("#favoritesMovies").html(str)
    
}

function getMovieErrorCB(err) {
    console.log(err);
}

function getTVNamesErrorCB() {
    console.log("Error");
}


function getEpisodes() {
    if ($(this).prop('selectedIndex') != 0)
        $("#tvName").html($(this).val().toUpperCase());
    else {
        $("#tvName").html("");
        $("#seriesEpisodes").html("")
    }
    let api = "../api/Episodes?seriesID=" + $(this).children(":selected").attr("id") + "&mail=" + user.Mail;
    ajaxCall("GET", api, "", getEpisodesSuccessCB, getEpisodesErrorCB);


}

function getEpisodesSuccessCB(episodes) {
    let str = "";
    for (let i = 0; i < episodes.length; i++) {
        str += "<div class='episodeCard'><div><img src='" + (imagePath + episodes[i].ImageURL) + "' onerror='" + errorPng + "'/></div><div><h3>" + episodes[i].EpisodeName + "</h3><p><b>Overview:</b> " + episodes[i].Overview + "</p>";
        str += "<p><b>Air Date: </b>" + episodes[i].AirDate + "</p></div>"
        str += "</div><hr>"
    }
    $("#seriesEpisodes").html(str)
}

function getEpisodesErrorCB() {
    console.log("Error");
}

function toggleFavorites() {
    if (favoriteMode == "tv") {
        $("#favoritesMovies").show();
        $("#favoritesTv").hide();
        $("#showTvFavorites").css("background-color", "white");
        $("#showMovieFavorites").css("background-color", "aqua");
        favoriteMode = "movie";
    }
    else {
        $("#favoritesTv").show();
        $("#favoritesMovies").hide();
        $("#showMovieFavorites").css("background-color", "white");
        $("#showTvFavorites").css("background-color", "aqua");
        favoriteMode = "tv";
    }
}
