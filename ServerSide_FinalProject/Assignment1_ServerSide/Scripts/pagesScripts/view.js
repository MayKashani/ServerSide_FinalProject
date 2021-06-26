$(document).ready(function () {

    
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
    console.log(movies)
    let str = "";
    if (movies.length == 0)
        $("#favoritesMovies").html("<h3>No movie results found!</h3>");
    else {
        for (let i = 0; i < movies.length; i++) {
            str += "<div class='row result' style='background:url(" + checkPhotos(movies[i].Backdrop_Path) + "); background-size:cover; background-repeat:no-repeat'><div class='resultText row'>"
            description = "<div class='col-8'><h3>" + movies[i].Title + "</h3><p><b>Air Date: </b>" + movies[i].Release_Date + "</p><h5>" + movies[i].Tagline + "</h5><p> " + movies[i].Overview + "</p></div>"
            str += description + "</div></div>"
        }
        $("#favoritesMovies").html(str)

    }
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
        str += "<div class='row result'><div class='row resultText episode'><div class='col-4'><img src='" + checkPhotos(episodes[i].ImageURL) + "'/></div><div class='col-8'><h3>" + episodes[i].EpisodeName + "</h3><p><b>Overview:</b> " + episodes[i].Overview + "</p>";
        str += "<p><b>Air Date: </b>" + episodes[i].AirDate + "</p></div></div>"
        str += "</div>"
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
