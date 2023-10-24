document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.querySelector("#login form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le formulaire d'être soumis normalement

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (!email) {
            console.error("Email ne peut pas être vide.");
            return; // Arrête l'exécution de la fonction
        }

        if (!password) {
            console.error("Passsword ne peut pas être vide.");
            return; // Arrête l'exécution de la fonction
        }
        var loginData = {
            email: email,
            password: password
        };

        var loginEndpoint = endPoint + "/users/login";

        request(loginEndpoint, "POST", loginData, null, function(error, data) {
            if (error) {
                console.error("Erreur de login : ");
            } else {
                console.log("Connecté avec succès. Utilisateur ID : " + data.userId);
                console.log("Token : " + data.token);
            }
        });
    });
});


