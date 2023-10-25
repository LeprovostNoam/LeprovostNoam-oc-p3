// Récupère la liste des catégories depuis l'API
function getCategories(callback) {
    request(endPoint + "/categories", "GET", null, function(error, data) {
        if (error) {
            console.error("Erreur : " + error);
            callback(error, null);
        } else {
            callback(null, data);
        }
    });
}

// Récupère la liste des travaux depuis l'API
function getWorks(callback) {
    request(endPoint + "/works", "GET", null,  function(error, data) {
        if (error) {
            console.error("Erreur lors de la récupération des travaux : " + error);
            callback(error, null);
        } else {
            callback(null, data);
        }
    });
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


    /*  MODAL */

    const editPortfolioButton = document.querySelector(".edit-portfolio");
    const closeModalBtn = document.querySelector(".close-modal");

    // Sélectionnez le modal
    const modal = document.getElementById("modal1");
    const modalWrapper = modal.querySelector(".modal-wrapper");

    // Fonction pour ouvrir le modal
    function openModal() {
        modal.setAttribute("aria-hidden", "false");
        modal.style.display = "block";
    }

    // Écoutez le clic sur l'élément .edit-portfolio pour ouvrir le modal
    editPortfolioButton.addEventListener("click", openModal);

    // Fonction pour fermer le modal
    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }

    // Écoutez le clic sur le bouton de fermeture pour fermer le modal
    closeModalBtn.addEventListener("click", closeModal);

    // Si l'utilisateur click à l'exterieur du modal, cela le ferme
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

});