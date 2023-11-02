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
    const categorySelect = document.getElementById("category");

    // Récupère les catégories et crée des boutons de filtre pour chaque catégorie ainsi que le select pour la version edit
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

                var option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    });

    // Crée un élément de galerie pour un travail
    function createGalleryItem(work) {
        const figure = document.createElement("figure");
        figure.setAttribute('data-work-id', work.id);
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
        getWorks(function(error, works) {
            if (!error) {
                modal.setAttribute("aria-hidden", "false");
                modal.style.display = "block";
    
                const modalBodyArticles = document.querySelector(".modal-body-articles");
    
                modalBodyArticles.innerHTML = '';
    
                // On parcourt les données des travaux et a créé des éléments pour chaque travail
                works.forEach((work) => {
                    const card = document.createElement("article");
                    card.className = "card";
                    card.setAttribute('data-work-id', work.id);
                    const image = document.createElement("img");
                    image.src = work.imageUrl;
                    image.alt = work.title;
    
                    const trashButton = document.createElement("button");
                    trashButton.className = "trash-button";
                    trashButton.onclick = function () {
                        removeWork(work.id); // Appel de la fonction removeWork avec l'ID du travail
                    };
    
                    // Ajoutez l'image et le bouton "trash" à l'élément
                    card.appendChild(image);
                    card.appendChild(trashButton);
    
                    // Ajoutez la carte au modalBodyArticles
                    modalBodyArticles.appendChild(card);
                });
            }
        });
    }
    
    // Supprimer un travail
    function removeWork(workId) {
        request(endPoint + "/works/" + workId, "DELETE", null, function(error, data) {
            const worksElements = document.querySelectorAll('[data-work-id="' + workId + '"]');
            worksElements.forEach(workElement => {
                workElement.remove();
            });
            showSuccessAlert('Le travail a été supprimé avec succès.');
        });
    }

    // Écoutez le clic sur l'élément .edit-portfolio pour ouvrir le modal
    editPortfolioButton.addEventListener("click", openModal);

    // Fonction pour fermer le modal
    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        showModalBody1();
    }

    // Écoutez le clic sur le bouton de fermeture pour fermer le modal
    closeModalBtn.addEventListener("click", closeModal);

    // Si l'utilisateur click à l'exterieur du modal, cela le ferme
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });



    //Ajout des photos

    const showModalBody2Btn = document.getElementById('showModalBody2Btn');
    const modalTitles = document.querySelectorAll('.modal-title');
    const modalBodies = document.querySelectorAll('.modal-body');
    const modalBackBtn = document.querySelectorAll('.arrow-left-modal');
    const modalBtns = document.querySelectorAll('.modal-btn');

    const fileInput = document.getElementById("file-input");
    const imageIcon = document.querySelector(".image-icon");
    const fileLabel = document.querySelector(".file-input-label");
    const infoSpan = document.querySelector(".photo-container span");

    const titleInput = document.getElementById("title");
    const categoryInput = document.getElementById("category");


    //On affiche la page principal du modal
    function showModalBody2() {

        //Changer le titre du modal
        modalTitles[1].classList.remove('hide');
        modalTitles[0].classList.add('hide');

        //Changer le contenu du modal
        modalBodies[1].classList.remove('hide');
        modalBodies[0].classList.add('hide');

        //Afficher le bouton retour
        modalBackBtn[0].classList.remove('hide');

        //Afficher le bouton Valider
        modalBtns[1].classList.remove('hide');
        modalBtns[0].classList.add('hide');

        //Désactiver le bouton valider
        modalBtns[1].setAttribute('disabled', true);
    }

    //On affiche la page d'ajout de photos du modal
    function showModalBody1() {

        //Changer le titre du modal
        modalTitles[0].classList.remove('hide');
        modalTitles[1].classList.add('hide');

        //Changer le contenu du modal
        modalBodies[0].classList.remove('hide');
        modalBodies[1].classList.add('hide');

        //Afficher le bouton retour
        modalBackBtn[0].classList.add('hide');

        //Afficher le bouton Valider
        modalBtns[0].classList.remove('hide');
        modalBtns[1].classList.add('hide');

        var photoContainer = document.querySelector(".photo-container");
        var existingImage = photoContainer.querySelector("img");
        if (existingImage) {
            photoContainer.removeChild(existingImage);
        }

        //On enlève l'image si elle à été ajouté dans le formulaire
        imageIcon.style.display = "";
        fileLabel.style.display = "";
        infoSpan.style.display = "";

        //On retire l'image du file input
        fileInput.value = "";

        //On retire les valeur des inputs
        titleInput.value = "";
        categoryInput.value = "";
    }

    // Écoutez le clic sur le bouton "Ajouter une photo"
    modalBtns[0].addEventListener("click", showModalBody2);

    // Écoutez le clic sur le bouton retour
    modalBackBtn[0].addEventListener("click", showModalBody1);

    //On disabled ou pas le bouton valider
    function addPhotoFormModified() {
        var modalBtns = document.querySelectorAll('.modal-btn');
        var fileInput = document.getElementById("file-input");
        var titleInput = document.getElementById("title");
        var categoryInput = document.getElementById("category");

        //Si les champs sont bien remplie on active le bouton sinon on le désactive
        if (fileInput.value.trim() !== '' && titleInput.value.trim() !== '' && categoryInput.value.trim() !== '') {
            modalBtns[1].disabled = false;
        } else {
            modalBtns[1].disabled = true;
        }
    }

    //On écouté si l'un des élément du formulaire est modifié
    fileInput.addEventListener("change", addPhotoFormModified);
    titleInput.addEventListener("input", addPhotoFormModified);
    categoryInput.addEventListener("change", addPhotoFormModified);

    function addWork(){
        var fileInput = document.getElementById("file-input");
        var titleInput = document.getElementById("title");
        var categoryInput = document.getElementById("category");
    
        var modalBtns = document.querySelectorAll('.modal-btn');
        modalBtns[1].setAttribute('disabled', true);
    
        if (fileInput.value.trim() !== '' && titleInput.value.trim() !== '' && categoryInput.value.trim() !== '') {
            var allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            var maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo en octets
            if (fileInput.files[0].size <= maxSizeInBytes && allowedFormats.includes(fileInput.files[0].type)) {
                //On crée le FormData
                var workForm = new FormData();
                workForm.append("image", fileInput.files[0]);
                workForm.append("title", titleInput.value);
                workForm.append("category", categoryInput.value);
                //On ajoute le travail via l'API
                request(endPoint + "/works", "POST", workForm, function(error, data) {
                    if (error) {
                        showErrorAlert("Une erreur s'est produite lors de l'ajout du travail.");
                        modalBtns[1].setAttribute('disabled', false);
                    } else {
                        showSuccessAlert('Le travail a été ajouté avec succès.');
                        closeModal();
                        showModalBody1();
                        modalBtns[1].setAttribute('disabled', false);
                    }
                });            
            }else{
                showErrorAlert("L'image doit être au format jpg ou png et être inferieur à 4Mo.");
                modalBtns[1].setAttribute('disabled', false);
            }
        }else{
            showErrorAlert("Veuillez remplir tous les champs.");
            modalBtns[1].setAttribute('disabled', false);
        }
    }

    modalBtns[1].addEventListener("click", addWork);
});

//On affiche la photo dans le .photo-container
function displayPhoto() {
    var fileInput = document.getElementById("file-input");
    var imageIcon = document.querySelector(".image-icon");
    var fileLabel = document.querySelector(".file-input-label");
    var infoSpan = document.querySelector(".photo-container span");

    //Si l'utilisateur à sélectionné une photo
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            imageIcon.style.display = "none";
            fileLabel.style.display = "none";
            infoSpan.style.display = "none";

            var image = document.createElement("img");
            image.src = e.target.result;
            image.style.width = "130px";
            image.style.height = "200px";
            image.style.margin = "auto";
            document.querySelector(".photo-container").appendChild(image);
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}
