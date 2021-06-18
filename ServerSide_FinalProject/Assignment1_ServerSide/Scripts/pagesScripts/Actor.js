var creditMode = "";
$(document).ready(function () {


    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    method = "3/person/";
    api_key = "api_key=" + key;
    getActor();
   

    $(".knownButton").click(function () {
        if ($(this).css("background-color") != "aqua")
            toggleCredits();
    });

    $(document).on("click", ".tv", function () {
        let method = {
            id: this.id,
            type: "tv"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.replace("index.html");
    });

    $(document).on("click", ".movie", function () {
        let method = {
            id: this.id,
            type: "movie"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.replace("index.html");
    });
})


function getActor() {
    personId = JSON.parse(sessionStorage.getItem("personId"));
    method = "3/person/" + personId;
    api_key = "api_key=" + key;
    let apiCall = url + method + "?"+ api_key;
    ajaxCall("GET", apiCall, "", getActorSuccessCB, getActorErrorCB);
}

function getActorSuccessCB(actor) {
    console.log(actor)
    renderActor(actor);
    if (actor.known_for_department == "Acting") {
        $("#known_from").prepend("<h4>Movies/Tv Shows Participations:</h4>");
        getActorTvCredits();
        getActorMovieCredits();
    }
}

function getActorErrorCB(err) {
    console.log(err)
}

function renderActor(actor) {
    if (actor.profile_path != null)
        posterPath = imagePath + actor.profile_path;
    else
        posterPath = errorPng;
    imageSrc = "<img src='" + posterPath + "'/>";

    var gender = "";
    if (actor.gender == '1')
        gender = "female";
    else if (actor.gender == '2')
        gender = "male";

    let strInfo = "<p><u> Personal Information</u><p>Known for: " + actor.known_for_department + "</p><p>Gender: " + gender + "</p><p> Birthday: " + actor.birthday + "</p><p>Place of birth: " + actor.place_of_birth + "</p><p>Popularity: " + actor.popularity + "%</p>";
    var death = "";
    if (actor.deathday != null) {
        death = actor.deathday;
        strInfo += "<p>Date of death: " + death + "</p>";
    }

    strName = "<h1>" + actor.name + "</h1>";
    actorBio = "<p>Bio: <br>" + actor.biography + "</p>";
    str = imageSrc + strName + strInfo + actorBio;
    $("#ph").html(str);
}

function toggleCredits() {
    if (creditMode == "tv") {
        $("#knownMovieList").show();
        $("#knownTVList").hide();
        $("#tvButton").css("background-color", "white");
        $("#movieButton").css("background-color", "aqua");
        creditMode = "movie";
    }
    else {
        $("#knownTVList").show();
        $("#knownMovieList").hide();
        $("#movieButton").css("background-color", "white");
        $("#tvButton").css("background-color", "aqua");
        creditMode = "tv";
    }
}

function getActorTvCredits() {
    let apiCall = url + method + "/tv_credits?" + api_key;
    ajaxCall("GET", apiCall, "", getActorTvCreditsSuccessCB, getActorTvCreditsErrorCB);
}

function getActorTvCreditsSuccessCB(tv) {
    console.log(tv);
    castingArr = tv.cast;
    $("#tvButton").css("background-color", "aqua");
    creditMode = "tv";
    if (castingArr == null) {
        toggleCredits();
        $("#tvButton").attr("disabled", true);
    }
    else {
        let str = "";
        for (let i = 0; i < castingArr.length; i++) {
            str += "<li id = '" + castingArr[i].id + "'class = 'card tv'>";
            imageTv = "<img class='card-img-top' src='" +imagePath + castingArr[i].poster_path + "' onerror="+errorPng+">";
            cardBody = "<div class='card-body'><h5>" + castingArr[i].name + "</h5> <p class='card-text'>" + castingArr[i].character + "</p></div>";
            str += imageTv + cardBody + "<p class='goToPage'>Go to page</p></li> ";
        }
        $("#anyTvKnown").html(str);
        $("#knownMovieList").hide();
    }
}

function getActorTvCreditsErrorCB(err) {
    console.log(err);
}

function getActorMovieCredits() {
    let apiCall = url + method + "/movie_credits?" + api_key;
    ajaxCall("GET", apiCall, "", getActorMovieCreditsSuccessCB, getActorMovieCreditsErrorCB);
}

function getActorMovieCreditsSuccessCB(movie) {
    console.log(movie);
    castingArr = movie.cast;
    if (castingArr == null) {
        $("#movieButton").attr("disabled", true);
    }
    else {
        let str = "";
        for (let i = 0; i < castingArr.length; i++) {
            str += "<li id = '" + castingArr[i].id + "'class = 'card tv'>";
            imageTv = "<img class='card-img-top' src='" + imagePath + castingArr[i].poster_path + "' onerror=" + errorPng + ">";
            cardBody = "<div class='card-body'><h5>" + castingArr[i].title + "</h5> <p class='card-text'>" + castingArr[i].character + "</p></div>";
            str += imageTv + cardBody + "<p class='goToPage'>Go to page</p></li> ";
        }
        $("#anyMovieKnown").html(str);
    }
}

function getActorMovieCreditsErrorCB(err) {
    console.log(err);
}



