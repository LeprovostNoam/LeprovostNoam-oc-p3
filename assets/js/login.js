document.addEventListener("DOMContentLoaded", function() {
    // Fonction de login
    var loginForm = document.querySelector("#login form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le formulaire d'être soumis normalement

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (!email || !password) {
            showErrorAlert("Veuillez remplir tous les champs.");
            return; // Arrête l'exécution de la fonction
        }

        var loginData = {
            email: email,
            password: password
        };

        var loginEndpoint = endPoint + "/users/login";

        request(loginEndpoint, "POST", loginData, function(error, data) {
            if (error) {
                showErrorAlert("Votre adresse e-mail ou votre mot de passe est incorrecte.");
            } else {
                // Sauvegarde des données de l'utilisateur dans le localStorage
                var userData = {
                    userId: data.userId,
                    token: data.token
                };

                // Stockage des données dans le localStorage sous le nom "userData"
                localStorage.setItem("userData", JSON.stringify(userData));

                // Rediriger l'utilisateur vers l'index
                window.location.href = "index.html";
            }
        });
    });
});
