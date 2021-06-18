
var searchInput = 'addressTB';
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

    errorPng = 'this.src="..//Images//noImage.jpg"';
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    method = "3/tv/";
    api_key = "api_key=" + key;

    var memberBar = document.getElementById("memberBar");
    var guestBar = document.getElementById("guestBar");
    var user;

    guestBar.style.display = "block";
    memberBar.style.display = "none";

    checkLS();

    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode']
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var near_place = autocomplete.getPlace();
    });

    var loginModal = document.getElementById("loginModal");
    var registerModal = document.getElementById("registerModal");

    var loginBtn = document.getElementById("loginBtn");
    var registerBtn = document.getElementById("registerBtn");

    loginBtn.onclick = function () {
        loginModal.style.display = "block";
    }

    registerBtn.onclick = function () {
        registerModal.style.display = "block";
    }

   

    window.onclick = function (event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
            $("#loginForm").trigger("reset");
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
            $("#registerForm").trigger("reset");
        }
    }

    $("#registerForm").submit(insertUser);

    $("#loginForm").submit(getUserByData);

    $(document).on("click", "#logoutBtn", function () {
        localStorage.clear();
        $("#welcomeDiv").html("");
        toggleBar();
    })

    $("#getTV").click(searchByName);

});

function searchByName() {
    sessionStorage.setItem("searchValue", $("#tvShowName").val());
    window.location.replace("Search.html");
}

//function getTV() {
//    i = 1;

//    seasonsArr = [];
//    $("#seasonsList").html("");
//    $("#episode").html("");
//    let name = $("#tvShowName").val();
//    let method = "3/search/multi?";
//    let api_key = "api_key=" + key;
//    let moreParams = "&language=en-US&page=1&include_adult=false&";
//    let query = "query=" + encodeURIComponent(name);
//    let apiCall = url + method + api_key + moreParams + query;
//    ajaxCall("GET", apiCall, "", getTVSuccessCB, getTVErrorCB);
//}

//function getTVSuccessCB(tv) {
//    console.log(tv)
//    //Current_TV = tv.results[0];
//    //seasonsList = "";
//    //tvId = tv.results[0].id;
//    //let poster = imagePath + tv.results[0].poster_path;
//    //str = "<img src='" + poster + "'/>";
//    //$("#ph").html(str);
//    //$("#average").html(Current_TV.vote_average * 10 + "%");
//    //$("#overview").html(Current_TV.overview);
//    //$("#seriesDiv").show();
//    //let apiCall = url + method + tvId + "/season/" + i + "?" + api_key
//    //ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
//}


//function getTVErrorCB(err) {
//    console.log(err);
//}

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

function toggleModal() {
    if (loginModal.style.display != "block") {
        loginModal.style.display = "block";
        registerModal.style.display = "none";
    }
    else {
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    }
}

function insertUser() {
    registerModal.style.display = "none";
    let user = {
        FirstName: $("#firstNameTB").val(),
        LastName: $("#lastNameTB").val(),
        Mail: $("#mailTB").val(),
        Password: $("#passwordTB").val(),
        PhoneNum: $("#phoneTB").val(),
        Gender: $("input[name='gender']:checked").val(),
        BirthYear: $("#birthYearTB").val(),
        Style: $("#styleTB").val(),
        Address: $("#addressTB").val(),
    }

    let api = "../api/Users";
    ajaxCall("POST", api, JSON.stringify(user), postUserSuccessCB, postUserErrorCB)
    return false;
}

function postUserSuccessCB(num) {
    if (num == 0) {
        errorAlert("Mail already taken. Please try different Mail.");
        return;
    }
    $("#registerForm").trigger("reset");
    successAlert("Registered Successfully");
}
function postUserErrorCB(err) {
    errorAlert("Error");
}


function getUserByData() {
    let api = "../api/Users?Mail=" + $("#loginMail").val() + "&Password=" + $("#loginPassword").val();
    ajaxCall("GET", api, " ", getUserSuccessCB, getUserErrorCB);
    return false;
}

function getUserSuccessCB(user) {
    delete user["Password"];
    localStorage["User"] = JSON.stringify(user);
    loginModal.style.display = "none";
    checkLS();
}

function getUserErrorCB(err) {
    errorAlert(err.responseJSON.Message);
}

