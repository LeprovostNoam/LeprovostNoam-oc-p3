const endPoint = "http://localhost:5678/api";


function request(url, type, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, JSON.parse(xhr.responseText));
        } else {
        callback("Erreur de requête : " + xhr.status, null);
        }
    };

    xhr.onerror = function() {
        callback("Erreur réseau", null);
    };

    if (type === "POST" || type === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}