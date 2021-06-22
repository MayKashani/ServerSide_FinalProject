
var searchInput = 'addressTB';
function checkLS() {
    if (localStorage["User"] != null) {
        user = JSON.parse(localStorage["User"]);
        $("#welcomeDiv").html("<h3>Welcome back, " + user.FirstName + " " + user.LastName + "</h3>");
        toggleBar();
        mode = "member";
    }
    else {
        mode = "guest";
    }
}

$(document).ready(function () {
    errorPng = 'this.src="..//Images//noImage.jpg"';
    mode = "";
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    tvMethod = "3/tv/";
    movieMethod = "3/movie/";
    api_key = "api_key=" + key;

    var memberBar = document.getElementById("memberBar");
    var guestBar = document.getElementById("guestBar");

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
        window.location.href="Homepage.html";
    })

    $("#getTV").click(searchByName);
    $("#tvShowName").keypress(function (event) {
        if (event.keyCode === 13)
            searchByName();
    })
    $(".logo").click(function () {
        window.location.href="Homepage.html";
    })

    //scroll with button
    $('.rightScrollBtn').click(function () {
        element = this.parentElement.children[1];
        position = $(element).scrollLeft()
        width = $(element).width();
        $(element).animate({ //animate element that has scroll
            scrollLeft: position + width //for scrolling
        }, 1000);
    });

    $('.leftScrollBtn').click(function () {
        element = this.parentElement.children[1];
        position = $(element).scrollLeft()
        width = $(element).width();
        $(element).animate({ //animate element that has scroll
            scrollLeft: position - width //for scrolling
        }, 1000);
    });
});

function searchByName() {
    sessionStorage.setItem("searchValue", $("#tvShowName").val());
    window.location.href="Search.html";
}

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

