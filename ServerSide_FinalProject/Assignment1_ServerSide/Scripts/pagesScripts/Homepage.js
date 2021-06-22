
var popularMode = "";

$(document).ready(function () {
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    tvMethod = "3/tv/";
    movieMethod = "3/movie/";
    api_key = "api_key=" + key;

    chatListBtn = document.getElementById("openChatListBtn");


    getPopularTv();
    getPopularMovie();

    if (mode == "member") {
        getChats();
        getRecBySimilarUsers();
        getRecMovieBySimilarUsers();
    }

    $(".popularButton").click(function () {
        if ($(this).css("background-color") != "aqua")
            togglePopular();
    });
    $(".recommendButton").click(function () {
        if ($(this).css("background-color") != "aqua")
            toggleRecommend();
    })

    $(document).on("click", ".tv", function () {
        let method = {
            id: this.id,
            type: "tv"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = 'index.html';
    });

    $(document).on("click", ".movie", function () {
        let method = {
            id: this.id,
            type: "movie"
        }
        sessionStorage.setItem("mediaChoose", JSON.stringify(method));
        window.location.href = 'index.html';
    });

    $(document).on("click", ".joinChatBtn", function () {
        ref = firebase.database().ref("messages/" + this.id);
        $("#chatName").html(this.parentElement.firstElementChild.innerText);
        $("#chatWindow").css("visibility","visible")
        $("#messages").html("");
        listenToNewMessages();
    });

    $("#msgTB").keypress(function (event) {
        if (event.keyCode === 13)
            AddMSG();
    })

    $(chatListBtn).click(function () {
        $("#fanClub").toggle("fast")
	})


});

function getRecBySimilarUsers() {
    let api = "../api/Seriess?mail=" + JSON.parse(localStorage["User"]).Mail + "&mode=Recommended";
    ajaxCall("GET", api, "", getRecSuccess, getRecError);
}

function getRecSuccess(rec) {
    console.log(rec);
    if (rec.length > 0) {
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < rec.length; i++) {
            str += "<li id = '" + rec[i].Id + "'class = 'card tv'>";
            image = "<img class='card-img-top' src = '" + imagePath + rec[i].Poster_Path + "'";
            cardBody = "<div class='card-body'><h5>" + rec[i].Name + "</h5> <p class='card-text'>" + rec[i].Original_Language + "</p></div>";
            str += image + cardBody + "<p class='goToPage'>Go to page</p></li> ";
        }
        $("#recommendTvList").html(str);
        $("#showTvRecommend").css("background-color", "aqua");
        $("#recommendTv").show();
        recommendMode = "tv";
    }
}

function getRecError(err) {
    console.log(err)
}

function getRecMovieBySimilarUsers() {
    let api = "../api/Movies?mail=" + user + "&mode=Recommended";
    ajaxCall("GET", api, "", getMovieRecSuccessCB, getMovieRecErrorCB);
}

function getMovieRecSuccessCB(movies) {
    if (movies.length > 0) {
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < movies.length; i++) {
            str += "<li id = '" + movies[i].Id + "'class = 'card movie'>";
            image = "<img class='card-img-top' src = '" + imagePath + movies[i].Backdrop_Path + "'";
            cardBody = "<div class='card-body'><h5>" + movies[i].Title + "</h5> <p class='card-text'>" + movies[i].Original_Language + "</p></div>";
            str += image + cardBody + "<p class='goToPage'>Go to page</p></li> ";
        }
        $("#recommendMovieList").html(str);
        $("#recommendMovie").hide();
    }
}
function getMovieRecErrorCB(err) {
    console.log(err);
}
function exit(e) {
    e.pa.style.visibility = "hidden"
}

function getPopularTv() {
    let apiCall = url + tvMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopShowSuccessCB, getTopShowErrorCB);
}

function getTopShowSuccessCB(topTv) {

    popularShows = topTv.results;
    let str = "";
    for (let i = 0; i < popularShows.length; i++) {
        str += "<li id = '" + popularShows[i].id + "'class = 'card tv'>";
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
        str += "<li id = '" + popularMovies[i].id + "'class = 'card movie'>";
        image = "<img class='card-img-top' src = '" + imagePath + popularMovies[i].poster_path + "'";
        cardBody = "<div class='card-body'><h5>" + popularMovies[i].original_title + "</h5> <p class='card-text'>" + popularMovies[i].original_language + "</p></div>";
        str += image + cardBody + "</li>";
    }
    $("#anyMovieType").html(str);
    $("#popularMovie").hide();
    popularMode = "tv";
}
function getTopMovieErrorCB(err) {
    console.log(err);
}

function togglePopular() {
    if (popularMode == "tv") {
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
function toggleRecommend() {
    if (recommendMode == "tv") {
        $("#recommendMovie").show();
        $("#recommendTV").hide();
        $("#showTvRecommend").css("background-color", "white");
        $("#showMovieRecommend").css("background-color", "aqua");
        recommendMode = "movie";
    }
    else {
        $("#recommendTV").show();
        $("#recommendMovie").hide();
        $("#showMovieRecommend").css("background-color", "white");
        $("#showTvRecommend").css("background-color", "aqua");
        recommendMode = "tv";
    }
}


function getChats() {

    let api = "../api/Seriess?mail=" + JSON.parse(localStorage["User"]).Mail + "&mode=Favorites";
    ajaxCall("GET", api, "", getChatsSuccess, getChatsError);
}

function getChatsSuccess(series) {
    let str = "";
    for (let i = 0; i < series.length; i++) {
        str += "<li><p>" + series[i].Name + "</p><button class='joinChatBtn' id=" + series[i].Id + ">Join</button></li>"
    }
    $("#chatList").html(str);
}

function getChatsError(err) {
    console.log(err);
}

function printMessage(msg) {
    type = "";
    imageSrc = '<img src="../../Images/userPng.jpeg" width="30" height="30">'

    if (msg.mail != user)
        type = "chat ml-2";
    else
        type = "bg-white mr-2"
    str = '<div class="d-flex flex-row p-3">' + imageSrc + '<div class="' + type + ' p-3">' + "<h6><u>" + msg.name + '</u></h3>' + msg.content + '</div>'

    $("#messages").append(str);
    $("#msgTB").val("");
}

function listenToNewMessages() {
    ref.on("child_added", snapshot => {
        msg = {
            name: snapshot.val().name,
            content: snapshot.val().msg,
            mail: snapshot.val().mail
        }
        printMessage(msg);
    })
}


function AddMSG() {
    let msg = document.getElementById("msgTB").value;
    let user = JSON.parse(localStorage["User"])
    let name = user.FirstName;
    let mail = user.Mail;
    ref.push().set({ "msg": msg, "name": name, "mail": mail });
}
