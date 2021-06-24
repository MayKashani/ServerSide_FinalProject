
var searchInput = 'addressTB';
function checkLS() {
    if (localStorage["User"] != null) {
        user = JSON.parse(localStorage["User"]);
        $("#welcomeDiv").html("Welcome back, " + user.FirstName + " " + user.LastName);
        toggleBar();
        mode = "member";
        getChats();
        if (localStorage['profileSrc'] != null) {
            profileSrc = localStorage['profileSrc'];
		}
    }
    else {
        mode = "guest";
    }
}

$(document).ready(function () {
    errorPng = "..//Images//noImage.jpg";
    mode = "";
    key = "46ee229c787140412cbafa9f3aa03555";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    tvMethod = "3/tv/";
    movieMethod = "3/movie/";
    api_key = "api_key=" + key;
    profileSrc = "";


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
    var trailerModal = document.getElementById("trailerModal");
 

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
        if (event.target == trailerModal) {
            trailerModal.style.display = "none";
            $('#trailerModal').html("")
           
        }
    }

    $("#registerForm").submit(insertUser);

    $("#loginForm").submit(getUserByData);

    $(document).on("click", "#logoutBtn", function () {
        localStorage.clear();
        $("#welcomeDiv").html("");
        toggleBar();
        localStorage.removeItem("profileSrc");
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

    //'Enter' keypress event for send message in chat
    $("#msgTB").keypress(function (event) {
        if (event.keyCode === 13)
            AddMSG();
    })

    chatListBtn = document.getElementById("openChatListBtn");
    $(chatListBtn).click(function () {
        $("#fanClub").toggle("fast")
    })

    //Join selected Chat.
    $(document).on("click", ".joinChatBtn", function () {
        ref = firebase.database().ref("messages/" + this.id);
        $("#chatName").html(this.parentElement.firstElementChild.innerText);
        $("#chatWindow").css("visibility", "visible")
        $("#messages").html("");
        listenToNewMessages();
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
    uploadImage();
    $("#registerForm").trigger("reset");
    successAlert("Registered Successfully");
}

function uploadImage() {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#profileFile").files[0];
    const name = $("#mailTB").val();
    const metadata = {
        contentType: file.type
    }
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url)
            alert("Image Upload Successfully");
        })
}

function getProfilePicture(user) {
    const ref = firebase.storage().ref();
    ref.child(user.Mail).getDownloadURL()
        .then(url => {
            console.log(url);
            alert("image here!");
            localStorage['profileSrc'] = url;
        })
     .catch ((error) => {
        // Handle any errors
         if (error.code == "storage/object-not-found")
            localStorage['profileSrc'] = "";
    });

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
    getProfilePicture(user);
    checkLS();
    loginModal.style.display = "none";
   
}

function getUserErrorCB(err) {
    errorAlert(err.responseJSON.Message);
}

//Get Chats from every prefered Series and his initiate functions
function getChats() {
    let api = "../api/Seriess?mail=" + user.Mail + "&mode=Favorites";
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
    profileSrc = localStorage['profileSrc'];
    if (profileSrc == "")
        chatPhotoSrc = "../../Images/userPng.jpeg";
    else
        chatPhotoSrc = profileSrc;
    imageSrc = '<img src=' + chatPhotoSrc + ' width="30" height="30">'

    if (msg.mail != user.Mail)
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
    let name = user.FirstName;
    let mail = user.Mail;
    ref.push().set({ "msg": msg, "name": name, "mail": mail });
}

