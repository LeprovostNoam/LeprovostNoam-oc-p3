const endPoint = "http://localhost:5678/api";

// Fonction générique pour effectuer des requêtes avec fetch
function request(url, type, data, callback) {
    // authToken (chaîne): Un jeton d'authentification Bearer optionnel. Peut être null.
    let fetchOptions = {
        method: type,
        headers: {},
    };

    // Vérifier si l'utilisateur est connecté et a un token
    var userData = isUserLogged();
    if (userData && userData.token) {
        fetchOptions.headers['Authorization'] = `Bearer ${userData.token}`;
    }

    if (data) {
        if (data instanceof FormData) {
            fetchOptions.body = data;
        } else {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(data);
        }
    }

    fetch(url, fetchOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur de requête : " + response.status);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith("application/json")) {
            return response.json();
        } else {
            // La réponse n'est pas de type JSON, retournez null
            return null;
        }
    })
    .then(data => {
        if (data !== null) {
            callback(null, data);
        } else {
            callback("Réponse vide ou non valide au format JSON", null);
        }
    })
    .catch(error => {
        // Gérer les erreurs potentielles lors de l'analyse du JSON
        callback(error, null);
    });
}

// Affiche un message en rouge à l'utilisateur si une erreur est rencontrée
function showErrorAlert(message) {
    var errorAlertBox = document.getElementById("error-alert-box");
    var errorAlertText = document.getElementById("error-alert-text");

    // Afficher le message d'erreur dans l'alerte
    errorAlertText.innerHTML = message;

    // Supprimer la classe "hidden" pour afficher l'alerte d'erreur
    errorAlertBox.classList.remove("hidden");

    // Fermer automatiquement l'alerte d'erreur après 3 secondes
    setTimeout(function() {
        // Réajouter la classe "hidden" pour masquer l'alerte d'erreur
        errorAlertBox.classList.add("hidden");
    }, 3000); 
}

// Affiche un message en vert à l'utilisateur si une information doit être donnée
function showSuccessAlert(message) {
    var successAlertBox = document.getElementById("success-alert-box");
    var successAlertText = document.getElementById("success-alert-text");

    // Afficher le message de succès dans l'alerte
    successAlertText.innerHTML = message;

    // Supprimer la classe "hidden" pour afficher l'alerte de succès
    successAlertBox.classList.remove("hidden");

    // Fermer automatiquement l'alerte de succès après 3 secondes
    setTimeout(function() {
        // Réajouter la classe "hidden" pour masquer l'alerte de succès
        successAlertBox.classList.add("hidden");
    }, 3000); 
}



// Fonction pour savoir si l'utilisateur est connecté ou non
function isUserLogged() {
    // Récupérer les données de l'utilisateur depuis le sessionStorage
    var userData = sessionStorage.getItem("userData");

    // Si les données de l'utilisateur existent, renvoyer les données de l'utilisateur
    if (userData) {
        return JSON.parse(userData); // Convertir la chaîne JSON en objet JavaScript
    } else {
        return false;
    }
}

function logout() {
    // Supprimer les données de l'utilisateur du sessionStorage
    sessionStorage.removeItem("userData");
    
    // Rediriger l'utilisateur vers l'index
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour savoir si l'utilisateur est connecté ou non
    function isUserLogged() {
        // Récupérer les données de l'utilisateur depuis le sessionStorage
        var userData = sessionStorage.getItem("userData");

        // Si les données de l'utilisateur existent, renvoyer les données de l'utilisateur
        if (userData) {
            return JSON.parse(userData); // Convertir la chaîne JSON en objet JavaScript
        } else {
            return false;
        }
    }

    // Récupérer l'élément de navigation "navLog" et le lien "login"
    var navLog = document.getElementById("navLog");
    var editBanner = document.querySelector(".edit-banner");
    var editBanner = document.querySelector(".edit-banner");
    var editPortfolio = document.querySelector(".edit-portfolio");
    var loginLink = navLog.querySelector("a");
    var filters = document.querySelector('.filters');

    // Vérifier si l'utilisateur est connecté
    if (isUserLogged()) {
        // Si l'utilisateur est connecté, remplacez le lien "login" par "logout"
        loginLink.textContent = "logout";
        loginLink.classList.add("logoutBtn");
        loginLink.href = "javascript:void(0);";

        //Afficher la banner de mode édition ainsi que le bouton edit
        editBanner.classList.remove("hidden");
        editPortfolio.classList.remove("hidden");

        // On hide les boutons de filtres
        filters.style.display = 'none';

        var logoutButton = document.querySelector(".logoutBtn");
        //Si l'utilisateur click sur le bouton logout
        logoutButton.addEventListener("click", function() {
            // Appeler la fonction de déconnexion
            logout();
        });
    }
});

