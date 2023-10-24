const endPoint = "http://localhost:5678/api";

// Fonction générique pour effectuer des requêtes AJAX
function request(url, type, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Appelle le callback avec les données JSON en cas de succès
            callback(null, JSON.parse(xhr.responseText));
        } else {
            // Appelle le callback avec une erreur en cas d'échec
            callback("Erreur de requête : " + xhr.status, null);
        }
    };

    xhr.onerror = function() {
        // Appelle le callback en cas d'erreur réseau
        callback("Erreur réseau", null);
    };

    if (type === "POST" || type === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

// Récupère la liste des catégories depuis l'API
function getCategories(callback) {
    request(endPoint + "/categories", "GET", null, callback);
}

// Récupère la liste des travaux depuis l'API
function getWorks(callback) {
    request(endPoint + "/works", "GET", null, callback);
}

document.addEventListener("DOMContentLoaded", function() {
    const gallery = document.querySelector(".gallery");
    const filtersContainer = document.querySelector(".filters");

    // Récupère les catégories et crée des boutons de filtre pour chaque catégorie
    getCategories(function(error, categories) {
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
    getWorks(function(error, works) {
        if (error) {
            console.error("Erreur lors de la récupération des travaux : " + error);
        } else {
            allWorks = works;
            displayWorks(allWorks);
        }
    });
});
