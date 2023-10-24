const endPoint = "http://localhost:5678/api";

// Fonction générique pour effectuer des requêtes avec fetch
function request(url, type, data, callback) {
    // authToken (chaîne): Un jeton d'authentification Bearer optionnel. Peut être null.
    let fetchOptions = {
        method: type,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    /*
    On garde pour les actions avec token
    if (authToken) {
        fetchOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }
    */

    if (data) {
        fetchOptions.body = JSON.stringify(data);
    }

    fetch(url, fetchOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur de requête : " + response.status);
        }
        return response.json();
    })
    .then(data => {
        callback(null, data);
    })
    .catch(error => {
        callback(error, null);
    });
}

// Affiche un message à l'utilisateur si une erreur est rencontrée
function showErrorAlert(message) {
    var alertBox = document.getElementById("alert-box");
    var alertText = document.getElementById("alert-text");

    // Afficher le message personnalisé dans l'alerte
    alertText.innerHTML = message;

    // Supprimer la classe "hidden" pour afficher l'alerte
    alertBox.classList.remove("hidden");


    // Fermer automatiquement l'alerte après 3 secondes
    setTimeout(function() {
        // Réajouter la classe "hidden" pour masquer l'alerte
        alertBox.classList.add("hidden");
    }, 3000); 
}