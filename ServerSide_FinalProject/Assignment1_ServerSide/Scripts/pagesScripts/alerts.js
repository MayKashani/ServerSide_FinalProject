function successAlert(msg) {
    $.notifyBar({
        html: msg, cssClass: "success", closeOnClick: true
    });

}

function errorAlert(msg) {
    $.notifyBar({
        html: msg, cssClass: "error", close: true, closeText: '&times;', closeOnClick: true, waitingForClose: true
    });
}

