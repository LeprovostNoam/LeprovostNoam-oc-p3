const endPoint = "http://localhost:5678/api";

// Fonction générique pour effectuer des requêtes avec fetch
function request(url, type, data, authToken, callback) {
    // authToken (chaîne): Un jeton d'authentification Bearer optionnel. Peut être null.
    let fetchOptions = {
        method: type,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (authToken) {
        fetchOptions.headers['Authorization'] = `Bearer ${authToken}`;
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
