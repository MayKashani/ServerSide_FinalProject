
$(document).ready(function () {
	var Current_TV;
	var Current_ep;
	var i = 1;
	/*var errorPng = 'this.src="..//Images//noImage.jpg"';*/

	//key = "46ee229c787140412cbafa9f3aa03555";
	//url = "https://api.themoviedb.org/";
	//imagepath = "https://image.tmdb.org/t/p/w500/";
	//method = "3/tv/";
	//api_key = "api_key=" + key;

	seasonsList = "";
	seasonsArr = [];

	$(document).on('click', '.addEpisode', postTV);

	$(document).on('click', '#seasonsList > .card', viewEpisodes)

	$(document).on("click", ".heart", function () {
		$(this).removeClass("heart").addClass("red-heart");

	});

	$("#watchTrailerBtn").click(getTrailer)
});

function viewEpisodes() {
	let id = this.id;
	sessionStorage.setItem("currentTV", Current_TV.id);
	sessionStorage.setItem("season", id);
	sessionStorage.setItem("episodes", JSON.stringify(seasonsArr[id-1].episodes))
	window.location.replace("Episodes.html")
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

//function getTV() {
//	i = 1;

//	seasonsArr = [];
//	$("#seasonsList").html("");
//	$("#episode").html("");
//	let name = $("#tvShowName").val();
//	let method = "3/search/tv?";
//	let api_key = "api_key=" + key;
//	let moreParams = "&language=en-US&page=1&include_adult=false&";
//	let query = "query=" + encodeURIComponent(name);
//	let apiCall = url + method + api_key + moreParams + query;
//	ajaxCall("GET", apiCall, "", getTVSuccessCB, getTVErrorCB);
//}

//function getTVSuccessCB(tv) {
//	console.log(tv)
//	Current_TV = tv.results[0];
//	seasonsList = "";
//	tvId = tv.results[0].id;
//	let poster = imagePath + tv.results[0].poster_path;
//	str = "<img src='" + poster + "'/>";
//	$("#ph").html(str);
//	$("#average").html(Current_TV.vote_average * 10 + "%");
//	$("#overview").html(Current_TV.overview);
//	$("#seriesDiv").show();
//	let apiCall = url + method + tvId + "/season/" + i + "?" + api_key
//	ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
//}


//function getTVErrorCB(err) {
//	console.log(err);
//}


function getSeasonSuccessCB(season) {
	seasonsArr.push(season);
	seasonsList += "<div id=" + i + " class='card'> <img class='card-img-top' src='" + imagePath + season.poster_path + "'><div class='card-body'><h5>" + season.name + "</h5><p>" + season.air_date + "</p><p>" + season.overview + "</p></div></div>";
	i++;
	let apiCall = url + method + tvId + "/season/" + i + "?" + api_key;
	ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);
}


function getSeasonErrorCB(err) {
	if (err.status == 404)
		$("#seasonsList").append(seasonsList);
	else console.log("Error");
	let apiCall = url + method + Current_TV.id + "/credits?" + api_key;
	ajaxCall("GET", apiCall, "", getCreditsSuccess, getCreditsError);
}




function getCreditsSuccess(credits) {
	actors = credits.cast;
	$("#actors").html("");
	for (let i = 0; i < actors.length; i++) {
		let actorCard = document.createElement("div");
		actorCard.className = "card";
		let image = document.createElement("img");
		image.className = "card-img-top";
		if (actors[i].profile_path == null)
			image.src = "..//Images//noImage.jpg"
		else image.src = imagePath + actors[i].profile_path;
		let cardBody = document.createElement("div");
		cardBody.className = "card-body";
		let cardTitle = document.createElement("h5")
		cardTitle.innerText = actors[i].name;
		let details = document.createElement("p");
		details.className = "card-text";
		details.innerText = actors[i].character;
		cardBody.appendChild(cardTitle);
		cardBody.appendChild(details);
		actorCard.appendChild(image);
		actorCard.appendChild(cardBody);
		$("#actors").append(actorCard);
	}
	let apiCall = url + method + Current_TV.id + "/recommendations?" + api_key + "&language=en-US&page=1";
	ajaxCall("GET", apiCall, "", getSimilarSuccessCB, getSimilarErrorCB);
}

function getCreditsError(err) {
	console.log(err)
}

function getSimilarSuccessCB(similar) {
	series = similar.results;
	let recommendations = "";
	for (let i = 0; i < series.length; i++) {
		recommendations += "<div id=" + series[i].id + " class='card'> <img class='card-img-top' src='" + imagePath + series[i].poster_path + "'></div>";
	}
	$("#recommendations").html(recommendations)
	$("#seriesDiv").show();
}

function getSimilarErrorCB(err) {
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
