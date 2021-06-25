﻿
var popularMode = "";

$(document).ready(function () {
    
    //Get Popular According to TMBD
    getPopularTv();
    getPopularMovie();
    showNews();

    recommendMode = "tv";

    //If User logged in, render User options to Homepage
    if (mode == "member") {
        getRecBySimilarUsers();
        getRecMovieBySimilarUsers();

    }

    //Toggle TVShows/Movies
    $(".popularButton").click(function () {
        if($(this).css("background-color") != "rgb(0, 255, 255)")
            togglePopular();
    });
    $(".recommendButton").click(function () {
        if ($(this).css("background-color") != "rgb(0, 255, 255)")
            toggleRecommend();
    })

    //get TVShow/Movie selected Page.
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





});

//Get TVShows Recommendations according to similar Users.
function getRecBySimilarUsers() {
    let api = "../api/Seriess?mail=" + user.Mail + "&mode=Recommended";
    ajaxCall("GET", api, "", getRecSuccess, getRecError);
}
function getRecSuccess(rec) {
    console.log(rec);
    if (rec.length > 0) {
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < rec.length; i++) {
            str += "<li id = '" + rec[i].Id + "'class = 'card tv'>";
            image = "<img class='card-img-top' src = '" + imagePath + rec[i].Poster_Path + "'/>";
            cardBody = "<div class='card-body'><h6>" + rec[i].Name + "</h6> <p class='card-text'>" + rec[i].Original_Language + "</p></div>";
            str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
        }
        $("#recommendTvList").html(str);
        $("#showTvRecommend").css("background-color", "aqua");
        
    }
    else {
        $("#showTvRecommend").hide();
        $("#recommendTv").hide();
        recommendMode = "movie";
    }
}
function getRecError(err) {
    console.log(err)
}

//Get Movie Recommendations according to similar Users.
function getRecMovieBySimilarUsers() {
    let api = "../api/Movies?mail=" + user.Mail + "&mode=Recommended";
    ajaxCall("GET", api, "", getMovieRecSuccessCB, getMovieRecErrorCB);
}
function getMovieRecSuccessCB(movies) {
    if (movies.length > 0) {
        $("#recommend").css("visibility", "visible");
        let str = "";
        for (let i = 0; i < movies.length; i++) {
            str += "<li id = '" + movies[i].Id + "'class = 'card movie'>";
            image = "<img class='card-img-top' src = '" + imagePath + movies[i].Backdrop_Path + "'/>";
            cardBody = "<div class='card-body'><h6>" + movies[i].Title + "</h6> <p class='card-text'>" + movies[i].Original_Language + "</p></div>";
            str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
        }
        $("#recommendMovieList").html(str);
        if (recommendMode = "movie") 
            $("#showMovieRecommend").css("background-color", "aqua");
        else
            $("#recommendMovie").hide();
    }
}
function getMovieRecErrorCB(err) {
    console.log(err);
}

function exit(e) {
    e.pa.style.visibility = "hidden"
}

//Get Popular TvShows
function getPopularTv() {
    let apiCall = url + tvMethod + "popular?" + api_key + "&language=en-US&page=1";
    ajaxCall("GET", apiCall, "", getTopShowSuccessCB, getTopShowErrorCB);
}
function getTopShowSuccessCB(topTv) {

    popularShows = topTv.results;
    let str = "";
    for (let i = 0; i < popularShows.length; i++) {
        str += "<li id = '" + popularShows[i].id + "'class = 'card tv'>";
        image = "<img class='card-img-top' src = '" + imagePath + popularShows[i].poster_path + "'/>";
        cardBody = "<div class='card-body'><h6>" + popularShows[i].name + "</h6> <p class='card-text'>" + popularShows[i].original_language + "</p></div>";
        str += image + "<div class='goToPage'>Go to page"+cardBody + "</div></li>";
    }
    $("#anyShowType").html(str);
    $("#showTvPopular").css("background-color", "aqua");
}
function getTopShowErrorCB(err) {
    console.log(err);
}

//Get Popular Movies
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
        image = "<img class='card-img-top' src = '" + imagePath + popularMovies[i].poster_path + "'/>";
        cardBody = "<div class='card-body'><h6>" + popularMovies[i].original_title + "</h6> <p class='card-text'>" + popularMovies[i].original_language + "</p></div>";
        str += image + "<div class='goToPage'>Go to page" + cardBody + "</div></li>";
    }
    $("#anyMovieType").html(str);
    $("#popularMovie").hide();
    popularMode = "tv";
}
function getTopMovieErrorCB(err) {
    console.log(err);
}

//Toggle Functions
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

function showNews() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() - 1;

    const getNews1 = async () => {

        const url = "https://newsapi.org/v2/everything?domains=mtv.com,ew.com&q=movies&q=movie&q=film&q=trailer&q=tv&q=series&from=" + currentMonth + "&sortBy=publishedAt&apiKey=e9657119e6324c7daa3dd0d6d06567a1&language=en";
        const res = await fetch(url); //פונקציה שיש בדפדפן המקבלת כתובת ומחזירה את התוכן שלו.
        // await תמשיך לשורה הבאה רק כאשר התוכן נטען במלואו
        const { articles } = await res.json();  //לוקחים רק את articles מבין כל השדות שיש בכתובת.
        return articles;
    };

    const createNewsItemEl = ({ description, title, url, urlToImage }) => {
        const d = document.createElement("div");
        d.innerHTML = `
            <div><a href="${url}" target="_blank" ><h4>${title}</h4></a><div>
            <div><h5>${description}</h5><div>
            <img src="${urlToImage}" style="width:300px" />     
            <hr class="solid">
                `
            ;
        return d;
    };

    getNews1().then((news) => { // שיטה מודרנית לפונקצית הצלחה
        console.log(news)

        const cont = document.getElementById("showNews");
        var index = Math.floor(Math.random() * 10);

        cont.appendChild(createNewsItemEl(news[index]));

    }).catch(console.error);

 
}

