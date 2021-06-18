
$(document).ready(function () {


    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    method = "3/person/";
    api_key = "api_key=" + key;
    getActor();

    })


function getActor() {
 
    let method = "3/person/120?";
    let api_key = "api_key=" + key;
    let apiCall = url + method + api_key;
    ajaxCall("GET", apiCall, "", getActorSuccessCB, getActorErrorCB);
}

function getActorSuccessCB(actor) {
    console.log(actor)
    renderActor(actor);    
}

function getActorErrorCB(err) {
    console.log(err)
}

function renderActor(actor) {
    actor_id = actor.id;
    if (actor.profile_path != null) {
        let poster = imagePath + actor.profile_path;
        str = "<img src='" + poster + "'/>";
        $("#ph").prepend(str);
    }
    var gender = "";
    if (actor.gender == '1')
        gender = "female";
    else if (actor.gender == '2')
        gender = "male";

    //לטפל בידוע גם בתור.Also known as: " + actor.also_known_as
    let strInfo = "<p><u> Personal Information</u><p>Known for: " + actor.known_for_department + "</p><p>Gender: " + gender + "</p><p> Birthday: " + actor.birthday + "</p><p>Place of birth: " + actor.place_of_birth + "</p><p>Popularity: " + actor.popularity + "%</p>";
    var death = "";
    if (actor.deathday != null) {
        death = actor.deathday;
        strInfo += "<p>Date of death: " + death + "</p>";
    }
    $("#ph").append(strInfo);
    let actorName = actor.name;
    strName = "<h1>" + actorName + "</h1>";
    $("#ph").prepend(strName);
    let actorBio = actor.biography;
    $("#biography").append(actorBio);
}