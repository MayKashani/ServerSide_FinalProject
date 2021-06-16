$(document).ready(function () {

    userMail = JSON.parse(localStorage["User"]).Mail;
    errorPng = 'this.src="..//Images//noImage.jpg"';
    imagePath = "https://image.tmdb.org/t/p/w500/";

    getTVNames();

    $("#tvShows").change(getEpisodes);

})

function getTVNames() {
    let api = "../api/Seriess?mail=" + userMail;
    ajaxCall("GET", api, "", getTVNamesSuccessCB, getTVNamesErrorCB);
}

function getTVNamesSuccessCB(series) {
    let str = "<option> Select TV Show </option>";
    for (let i = 0; i < series.length; i++)
        str += "<option id=" + series[i].Id + ">" + series[i].Name + "</option>";

    $("#tvShows").html(str);
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
    let api = "../api/Episodes?seriesID=" + $(this).children(":selected").attr("id") + "&mail=" + userMail;
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
