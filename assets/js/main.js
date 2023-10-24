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

    if (type === "POST" || type === "PUT") {
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

// Récupère la liste des catégories depuis l'API
function getCategories(authToken, callback) {
    request(endPoint + "/categories", "GET", null, authToken, callback);
}

// Récupère la liste des travaux depuis l'API
function getWorks(authToken, callback) {
    request(endPoint + "/works", "GET", null, authToken, callback);
}

document.addEventListener("DOMContentLoaded", function() {
    const gallery = document.querySelector(".gallery");
    const filtersContainer = document.querySelector(".filters");

    // Récupère les catégories et crée des boutons de filtre pour chaque catégorie
    getCategories(null, function(error, categories) {
        if (error) {
            console.error("Erreur : " + error);
        } else {
            categories.forEach(function(category) {
                var button = document.createElement("button");
                button.className = "filter-button";
                button.textContent = category.name;
                button.dataset.categoryId = category.id;
                filtersContainer.appendChild(button);
            });
        }
    });

    // Crée un élément de galerie pour un travail
    function createGalleryItem(work) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }

    // Affiche une liste de travaux dans la galerie
    function displayWorks(works) {
        gallery.innerHTML = "";
        works.forEach(createGalleryItem);
    }

    // Filtrer les travaux par catégorie
    function filterWorksByCategory(works, categoryId) {
        return works.filter(function(work) {
            return work.categoryId === categoryId;
        });
    }

    filtersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("filter-button")) {
            // Enlever la classe "active" de tous les boutons de filtre
            const filterButtons = filtersContainer.querySelectorAll(".filter-button");
            filterButtons.forEach(function(button) {
                button.classList.remove("active");
            });

            // Ajouter la classe "active" uniquement au bouton cliqué
            event.target.classList.add("active");

            const categoryId = parseInt(event.target.dataset.categoryId);

            if (!isNaN(categoryId)) {
                const filteredWorks = filterWorksByCategory(allWorks, categoryId);
                displayWorks(filteredWorks);
            } else {
                displayWorks(allWorks);
            }
        }
    });

    let allWorks = [];

    // Récupère tous les travaux au chargement de la page
    getWorks(null, function(error, works) {
        if (error) {
            console.error("Erreur lors de la récupération des travaux : " + error);
        } else {
            allWorks = works;
            displayWorks(allWorks);
        }
    });
});