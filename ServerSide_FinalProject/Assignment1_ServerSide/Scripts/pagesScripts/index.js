

$(document).ready(function () {
	var Current_TV;
	var Current_ep;
	var i = 1;
	trailerUrl = "";
	$("#watchTrailerBtn").hide();
	chosenMedia = sessionStorage.getItem("mediaChoose");

	if (chosenMedia != null) {
		chosenMedia = JSON.parse(sessionStorage.getItem("mediaChoose"));
		getMedia();
		seasonsList = "";
		seasonsArr = [];

		$(document).on('click', '.addEpisode', postTV);

		$(document).on('click', '#seasonsList > .card', viewEpisodes)

		$(document).on("click", ".heart", function () {
			$(this).removeClass("heart").addClass("red-heart");

		});

		$("#watchTrailerBtn").click(watchTrailer)

		$(document).on('click', '.recommended', function () {
			sessionStorage.setItem("mediaChoose", JSON.stringify({ id: this.id, type: chosenMedia.type }))
			location.reload();
		})
	}

});

function watchTrailer() {
	$("#watchTrailerDiv").html('<iframe width="420" height="315" src="' + trailerUrl + '"></iframe>')
}

function getMedia() {
	mediaType = "3/" + chosenMedia.type + "/";
	i = 1;
	apiCall = url + mediaType + chosenMedia.id + "?" + api_key + "&append_to_response=credits,videos,recommendations";
	ajaxCall("GET", apiCall, "", getMediaSuccess, getMediaError);
}

function getMediaSuccess(media) {
	seasonsList = "";
	mediaId = media.id;
	Current_TV = media;
	console.log(media)
	let poster = imagePath + Current_TV.poster_path;
	str = "<img src='" + poster + "'/>";
	$("#ph").html(str);
	$("#average").html(Current_TV.vote_average * 10 + "%");
	$("#overview").html(Current_TV.overview);
	$("#seriesDiv").show();

	switch (chosenMedia.type) {
		case "movie": {
			renderDetails(Current_TV);
			break;
		}
		case "tv": {
			let apiCall = url + mediaType + Current_TV.id + "/season/" + i + "?" + api_key;
			ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
			break;
		}

	}
}

function renderDetails(media) {
	let video = media.videos.results[0];
	let credits = media.credits.cast;
	let recommendations = media.recommendations.results;
	getCredits(credits);
	getSimilar(recommendations);
	getTrailer(video);
	$("#seriesDiv").show();
}

function getMediaError(err) {
	console.log(err);
}

function viewEpisodes() {
	let id = this.id;
	sessionStorage.setItem("currentTV", Current_TV.id);
	sessionStorage.setItem("season", id);
	sessionStorage.setItem("episodes", JSON.stringify(seasonsArr[id-1].episodes))
	window.location.replace("Episodes.html")
}

function getTrailer(video) {
	if (video) {
		trailerUrl = "https://www.youtube.com/embed/" + video.key;
		$("#watchTrailerBtn").show();
	}
	else $("#watchTrailerBtn").hide();

}

function getSeasonSuccessCB(season) {

	seasonsArr.push(season);
	seasonsList += "<div id=" + i + " class='card'> <img class='card-img-top' src='" + imagePath + season.poster_path + "'><div class='card-body'><h5>" + season.name + "</h5><p>" + season.air_date + "</p><p>" + season.overview + "</p></div></div>";
	i++;
	let apiCall = url + method + mediaId + "/season/" + i + "?" + api_key;
	ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB);
}

function getSeasonErrorCB(err) {
	if (err.status == 404) {
		$("#seasonsList").append(seasonsList);
		$("#seasonsDiv").show();
		renderDetails(Current_TV);
	}
	else console.log("Error");
}

function getCredits(actors) {
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
	$("#actorsDiv").show();
}

function getSimilar(series) {
	let recommendations = "";
	if (series.length > 0) {
		for (let i = 0; i < series.length; i++) {
			recommendations += "<div id=" + series[i].id + " class='card recommended'> <img class='card-img-top' src='" + imagePath + series[i].poster_path + "'></div>";
		}
		$("#recommendations").html(recommendations);
		$("#recommendationsDiv").show();
	}
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
