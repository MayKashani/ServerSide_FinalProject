

$(document).ready(function () {
	//var Current_TV;
	//var Current_ep;

	var i = 1;
	trailerUrl = "";
	$("#watchTrailerBtn").hide();
	chosenMedia = sessionStorage.getItem("mediaChoose");

	if (chosenMedia != null) {
		chosenMedia = JSON.parse(sessionStorage.getItem("mediaChoose"));
		getMedia();
		seasonsList = "";
		seasonsArr = [];

		$(document).on('click', '#seasonsList > .card', viewEpisodes)


		$("#watchTrailerBtn").click(watchTrailer)

		$(document).on('click', '.recommended', function () {
			sessionStorage.setItem("mediaChoose", JSON.stringify({ id: this.id, type: chosenMedia.type }))
			window.location.href='index.html'; 
		})

		$(document).on('click', '.actorCard', function () {
			sessionStorage.setItem("personId", this.id);
			window.location.href = 'Actor.html';
		});

		$("#movieLikeBtn").click(postMovie);

	}

});

function postMovie() {
	let movie = {
		Id: Current_TV.id,
		Release_Date: Current_TV.release_date,
		Title: Current_TV.title,
		Original_Language: Current_TV.original_language,
		Overview: Current_TV.overview,
		Popularity: Current_TV.popularity,
		Backdrop_Path: Current_TV.backdrop_path,
		Status: Current_TV.status,
		Tagline: Current_TV.tagline
	}
	ajaxCall("POST", "../api/Movies?mail="+user, JSON.stringify(movie), postMovieSuccessCB, postMovieErrorCB)
	return false;
}

function postMovieSuccessCB(num) {
	console.log("success");
}

function postMovieErrorCB(err) {
	console.log(err)
}

function watchTrailer() {
	$("#watchTrailerDiv").html('<iframe width="420" height="315" src="' + trailerUrl + '?autoplay=1" allow="autoplay" allowfullscreen></iframe>')
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
	let poster = Current_TV.poster_path ? (imagePath + Current_TV.poster_path) : "..//Images//noImage.jpg" ;
	str = "<img src='" + poster + "'/>";
	$('#header').css("background-image", "url("+imagePath+Current_TV.backdrop_path+")");  
	$("#seriesName").html(Current_TV.name)
	$("#ph").html(str);
	$("#average").html(Current_TV.vote_average * 10 + "%");
	$("#overview").html(Current_TV.overview);
	$("#seriesDiv").show();

	switch (chosenMedia.type) {
		case "movie": {
			$("#seriesName").html(Current_TV.title)
			$("#movieLikeBtn").show();
			renderDetails(Current_TV);
			break;
		}
		case "tv": {
			$("#seriesName").html(Current_TV.name)
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
	window.history.go(-1);
	console.log(err);
	errorAlert("Page not found");
}

function viewEpisodes() {
	let id = this.id;
	sessionStorage.setItem("currentTV", JSON.stringify(Current_TV));
	sessionStorage.setItem("season", id);
	sessionStorage.setItem("episodes", JSON.stringify(seasonsArr[id-1].episodes))
	window.location.href = "Episodes.html";
}

function getTrailer(video) {
	if (video) {
		trailerUrl = "https://www.youtube.com/embed/" + video.key;
		$("#watchTrailerBtn").show();
	}
	else $("#watchTrailerBtn").hide();

}

function getSeasonSuccessCB(season) {
	if (season.poster_path == null)
		poster = "..//Images//noImage.jpg";
	else poster = imagePath + season.poster_path;
	seasonsArr.push(season);
	seasonsList += "<div id=" + i + " class='card'> <img class='card-img-top' src='" + poster + "'><div class='card-body'><h5>" + season.name + "</h5><p>" + season.air_date + "</p><p>" + season.overview + "</p></div></div>";
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
	let str = "";
	let profile = "";
	for (let i = 0; i < actors.length; i++) {
		if (actors[i].profile_path == null)
			profile = "..//Images//noImage.jpg";
		else profile = imagePath + actors[i].profile_path;
		str += "<div id=" + actors[i].id + " class='card actorCard'> <img class='card-img-top' src='" +profile + "'><div class='card-body'><h5>" + actors[i].name + "</h5><p class='card-text'>" + actors[i].character + "</p></div></div>";
	}
	$("#actors").html(str);
	$("#actorsDiv").show();
}

function getSimilar(series) {
	let recommendations = "";
	if (series.length > 0) {
		for (let i = 0; i < series.length; i++) {
			if (series[i].poster_path == null) {
				poster = "..//Images//noImage.jpg";
			}
			else 
				poster = imagePath + series[i].backdrop_path;
			if (chosenMedia = "movie")
				name = series[i].title;
			else name = series[i].name;
			recommendations += "<div id=" + series[i].id + " class='card recommended'> <img class='card-img-top' src='" + poster + "'><p class='onImageText'>" + name +"</p></div>";
		}
		$("#recommendations").html(recommendations);
		$("#recommendationsDiv").show();
	}
}
