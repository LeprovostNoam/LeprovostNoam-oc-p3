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

   // Vérifier si l'utilisateur est connecté et a un token
   var userData = isUserLogged();
   if (userData && userData.token) {
       fetchOptions.headers['Authorization'] = `Bearer ${userData.token}`;
   }

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


// Fonction pour savoir si l'utilisateur est connecté ou non
function isUserLogged() {
    // Récupérer les données de l'utilisateur depuis le localStorage
    var userData = localStorage.getItem("userData");

    // Si les données de l'utilisateur existent, renvoyer les données de l'utilisateur
    if (userData) {
        return JSON.parse(userData); // Convertir la chaîne JSON en objet JavaScript
    } else {
        return false;
    }
}

function logout() {
    // Supprimer les données de l'utilisateur du localStorage
    localStorage.removeItem("userData");
    
    // Rediriger l'utilisateur vers l'index
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour savoir si l'utilisateur est connecté ou non
    function isUserLogged() {
        // Récupérer les données de l'utilisateur depuis le localStorage
        var userData = localStorage.getItem("userData");

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

    // Vérifier si l'utilisateur est connecté
    if (isUserLogged()) {
        // Si l'utilisateur est connecté, remplacez le lien "login" par "logout"
        loginLink.textContent = "logout";
        loginLink.classList.add("logoutBtn");
        loginLink.href = "javascript:void(0);";

        //Afficher la banner de mode édition ainsi que le bouton edit
        editBanner.classList.remove("hidden");
        editPortfolio.classList.remove("hidden");

        var logoutButton = document.querySelector(".logoutBtn");
        //Si l'utilisateur click sur le bouton logout
        logoutButton.addEventListener("click", function() {
            // Appeler la fonction de déconnexion
            logout();
        });
    }
});

