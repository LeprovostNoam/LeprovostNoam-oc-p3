document.addEventListener("DOMContentLoaded", function() {

    //Fonction de login
    var loginForm = document.querySelector("#login form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le formulaire d'être soumis normalement

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (!email || !password) {
            showErrorAlert("Veuillez remplire tout les champs.")
            return; // Arrête l'exécution de la fonction
        }

        var loginData = {
            email: email,
            password: password
        };

        var loginEndpoint = endPoint + "/users/login";

        request(loginEndpoint, "POST", loginData, function(error, data) {
            if (error) {
                showErrorAlert("Votre adresse e-mail ou votre mot de passe est incorrecte.")
            } else {
                console.log("Connecté avec succès. Utilisateur ID : " + data.userId);
                console.log("Token : " + data.token);
            }
        });
    });
});


