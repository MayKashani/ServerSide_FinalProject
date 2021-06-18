errorPng = "..//Images//noImage.jpg";

$(document).ready(function () {
    searchVal = sessionStorage.getItem("searchValue");
    $("#resultHeader").html("Result for: '" + searchVal + "'");
    getTv();
    $(".buttonType").click(function () { changeType(this.id) });

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
    $(document).on("click", ".person", function () {
        let method = {
            id: this.id,
            type: "person"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.replace("actor.html");
    });
});

function getType(type) {
    let method = "3/search/"+type+"?"
    let query = "query=" + encodeURIComponent(searchVal);
    let moreParams = "&language=en-US&include_adult=false&";
    return url + method + api_key + moreParams + query;
}

function getTv() {
    let apiCall = getType("tv");
    ajaxCall("GET", apiCall, "", getTVSuccessCB, getErrorCB);
}

function getTVSuccessCB(tv) {
    console.log(tv);
    renderSearchTv(tv);
}

function getMovies() {
    let apiCall = getType("movie");
    ajaxCall("GET", apiCall, "", getMoviesSuccessCB, getErrorCB);
}

function getMoviesSuccessCB(movie) {
    console.log(movie);
    renderSearchMovie(movie);
}

function getPersons() {
    let apiCall = getType("person");
    ajaxCall("GET", apiCall, "", getPersonsSuccessCB, getErrorCB);
}


function getPersonsSuccessCB(person) {
    console.log(person);
    renderSearchPerson(person);
}

function renderSearchPerson(person) {
    let str = "";
    let personArr = person.results;
    for (let i = 0; i < personArr.length; i++) {
        str += "<div id='" + personArr[i].id + "' class='row result person'><div class='col-2'>";
        name = personArr[i].name;
        imageSrc = personArr[i].profile_path;
        description = "<div class='col-10'><h3>" + name + "</h3><p>" + personArr[i].known_for_department + "</p></div>";
        if(imageSrc==null)
            image = "<img class='imgResult' src = '" + errorPng + "'/></div>";
        else
            image = "<img class='imgResult' src = '" + imagePath + imageSrc + "'/></div>";
        str += image + description + "</div>";
    }
    $("#results").html(str);
}

function renderSearchTv(tv) {
    let str = "";
    let tvArr = tv.results;
    for (let i = 0; i < tvArr.length; i++) {
        str += "<div id='" + tvArr[i].id + "' class='row result tv'><div class='col-2'>'";
        name = tvArr[i].name;
        imageSrc = tvArr[i].poster_path;
        description = "<div class='col-8'><h3>" + name + "</h3><p>" + tvArr[i].first_air_date + "</p><h6>" + tvArr[i].overview + "</h6></div>";
        if (imageSrc == null)
            image = "<img class='imgResult' src = '" + errorPng + "'/></div>";
        else
            image = "<img class='imgResult' src = '" + imagePath + imageSrc + "'/></div>";
        str += image + description + "</div>";
    }
    $("#results").html(str);
}

function renderSearchMovie(movie) {
    let str = "";
    let movieArr = movie.results;
    for (let i = 0; i < movieArr.length; i++) {
        str += "<div id='" + movieArr[i].id + "' class='row result movie'><div class = 'col-2'> ";
        name = movieArr[i].title;
        imageSrc = movieArr[i].poster_path;
        description = "<div class='col-10'><h3>" + name + "</h3><p>" + movieArr[i].release_date + "</p><h6>" + movieArr[i].overview + "</h6></div>";
        if (imageSrc == null)
            image = "<img class='imgResult' src = '" + errorPng + "'/></div>";
        else
            image = "<img class='imgResult' src = '" + imagePath + imageSrc + "'/></div>";
        str += image + description + "</div>";
    }
    $("#results").html(str);
}


function getErrorCB(err) {
    console.log(err);
}

function changeType(id) {
    $(".buttonType").removeClass("chosen");
    $("#" + id).addClass("chosen");
    if (id == "person")
        getPersons();
    else if (id == "movie")
        getMovies();
    else
        getTv();
}

