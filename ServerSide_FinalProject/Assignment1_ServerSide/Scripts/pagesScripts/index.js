
var mode = "";

function checkLS() {
    if (localStorage["User"] != null) {
        user = JSON.parse(localStorage["User"]);
        $("#welcomeDiv").html("<h3>Welcome back, " + user.FirstName + " " + user.LastName + "</h3>");
        toggleBar();
        user = JSON.parse(localStorage["User"]).Mail;
        mode = "member";
    }
    else {
        mode = "guest";
    }
}

    $(document).ready(function () {
        var memberBar = document.getElementById("memberBar");
        var guestBar = document.getElementById("guestBar");
        var user;
      
        guestBar.style.display = "block";
        memberBar.style.display = "none";
        checkLS();

        var Current_TV;
        var Current_ep;
        var i = 1;
        var errorPng = 'this.src="..//Images//noImage.jpg"';

        $("#getTV").click(getTV);
        $("#seasonsList").hide();
        key = "46ee229c787140412cbafa9f3aa03555";
        url = "https://api.themoviedb.org/";
        imagePath = "https://image.tmdb.org/t/p/w500/";
        method = "3/tv/";
        api_key = "api_key=" + key;

        seasonsList = "";
        seasonsArr = [];

        $(document).on('click', '.addEpisode', postTV);

        $("#seasonsList").change(function () {
            let selected = $("#seasonsList").prop('selectedIndex');
            if (selected == 0) {
                $("#episode").html("");
                return;
            }

            let episodes = seasonsArr[selected - 1].episodes;
            let str = "";

            for (let i = 0; i < episodes.length; i++) {
                str += "<div class='episodeCard row'><div class='col-4'><img class='chapterImg'src='" + (imagePath + episodes[i].still_path) + "' onerror='" + errorPng + "'/></div><div class='info col-8'><h3>" + episodes[i].name + "</h3><p><b>Overview:</b> " + episodes[i].overview + "</p>";
                str += "<p><b>Air Date: </b>" + episodes[i].air_date + "</p> <button id='" + i + "' class = 'addEpisode heart'><i class='fa fa-heart'></i></button></div>"
                str += "</div><hr>"
            }
            $("#episode").html(str);

            if (mode == "guest") {
                $(".addEpisode").hide();
            }
 

        })






        $(document).on("click", ".heart", function () {
            $(this).removeClass("heart").addClass("red-heart");

        });

        $("#watchTrailerBtn").click(getTrailer)
    });

    function toggleBar() {
        if (memberBar.style.display != "block") {
            memberBar.style.display = "block";
            guestBar.style.display = "none";
        }
        else {
            memberBar.style.display = "none";
            guestBar.style.display = "block";
        }
    }


    function getTrailer() {
        let apiCall = "https://api.themoviedb.org/3/tv/" + Current_TV.id + "/videos?api_key=46ee229c787140412cbafa9f3aa03555";
        ajaxCall("GET", apiCall, "", getTrailerSuccess, getTrailerError);
    }

    function getTrailerSuccess(t) {
        let url = "https://www.youtube.com/embed/" + t.results[0].key;
        $("#watchTrailerDiv").html('<iframe width="420" height="315" src="' + url + '"></iframe>')
    }

    function getTrailerError(err) {
        console.log(err)
    }

    function getTV() {
        i = 1;

        seasonsArr = [];
        $("#seasonsList").hide().html("");
        $("#episode").html("");
        let name = $("#tvShowName").val();
        let method = "3/search/tv?";
        let api_key = "api_key=" + key;
        let moreParams = "&language=en-US&page=1&include_adult=false&";
        let query = "query=" + encodeURIComponent(name);
        let apiCall = url + method + api_key + moreParams + query;
        ajaxCall("GET", apiCall, "", getTVSuccessCB, getTVErrorCB);
    }

    function getTVSuccessCB(tv) {
        console.log(tv)
        Current_TV = tv.results[0];
        seasonsList = "";
        tvId = tv.results[0].id;
        let poster = imagePath + tv.results[0].poster_path;
        str = "<img src='" + poster + "'/>";
        $("#ph").html(str);
        $("#average").html(Current_TV.vote_average * 10 + "%");
        $("#overview").html(Current_TV.overview);
        seasonsList = "<option> Select season </option> "
        let apiCall = url + method + tvId + "/season/" + i + "?" + api_key
        ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
    }


    function getTVErrorCB(err) {
        console.log(err);
    }


    function getSeasonSuccessCB(season) {
        console.log(season)
        seasonsArr.push(season);
        seasonsList += "<option id=" + i + ">" + season.name + "</option>";
        i++;
        let apiCall = url + method + tvId + "/season/" + i + "?" + api_key;
        ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);
    }


    function getSeasonErrorCB(err) {
        if (err.status == 404)
            $("#seasonsList").show().html(seasonsList);
        else console.log("Error");
        let apiCall = url + method + Current_TV.id + "/credits?"+api_key;
        ajaxCall("GET", apiCall, "",getCreditsSuccess, getCreditsError)
}

    function getCreditsSuccess(credits) {
    console.log(credits)
    actors = credits.cast;
    for (let i = 0; i < actors.length; i++) {
        let actorCard = document.createElement("div");
        actorCard.className = "card";
        let image = document.createElement("img");
        image.className = "card-img-top";
        if (actors[i].profile_path == null)
            image.src = "..//Images//noImage.jpg"
        else image.src = imagePath + actors[i].profile_path;
        let cardBody = document.createElement("div");
        cardBody.className="card-body";
        let cardTitle = document.createElement("h5")
        cardTitle.innerText = actors[i].name;
        let details = document.createElement("p");
            details.className="card-text";
        details.innerText = actors[i].character;
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(details);
        actorCard.appendChild(image);
        actorCard.appendChild(cardBody);
        $("#actors").append(actorCard);
    }
}

    function getCreditsError(err) {
    console.log(err)
}

    function postTV() {
        Current_ep = this.id;
        let TV = {
            Id: Current_TV.id,
            First_Air_Date: Current_TV.first_air_date,
            Name: Current_TV.name,
            Origin_Country: Current_TV.origin_country[0],
            Original_Language: Current_TV.original_language,
            Overview: Current_TV.overview,
            Popularity: Current_TV.popularity,
            Poster_Path: Current_TV.poster_path
        }
        ajaxCall("POST", "../api/Seriess", JSON.stringify(TV), postTVSuccessCB, postTVErrorCB)
        return false;
    }

    function postTVSuccessCB(num) {
        console.log("Post TV Success");
        postEpisode();
    }

    function postTVErrorCB(err) {
        console.log("Post TV Not working")
    }

    function postEpisode() {

        let tvName = $("#tvShowName").val();
        let ep = seasonsArr[$("#seasonsList").prop('selectedIndex') - 1].episodes[Current_ep];

        let episode = {
            Id: ep.id,
            SeriesName: Current_TV.name,
            Season: ep.season_number,
            EpisodeName: ep.name,
            ImageURL: ep.still_path,
            Overview: ep.overview,
            AirDate: ep.air_date
        }

        let api = "../api/Episodes?mail=" + user;
        ajaxCall("POST", api, JSON.stringify(episode), postEpisodeSuccessCB, postEpisodeErrorCB)
    }

    function postEpisodeSuccessCB(numInserted) {
        successAlert("Added successfully!");
    }

    function postEpisodeErrorCB(err) {
        console.log("Error");
    }
