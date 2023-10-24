const endPoint = "http://localhost:5678/api";


function request(url, type, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, JSON.parse(xhr.responseText));
        } else {
        callback("Erreur de requête : " + xhr.status, null);
        }
    };

    xhr.onerror = function() {
        callback("Erreur réseau", null);
    };

    if (type === "POST" || type === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

function getCategories(callback) {
    request(endPoint + "/categories", "GET", null, callback);
}

function getWorks(callback) {
    request(endPoint + "/works", "GET", null, callback);
}

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

function displayWorks(works) {
    gallery.innerHTML = ""; 
    works.forEach(createGalleryItem);
}

function filterWorksByCategory(works, categoryId) {
    return works.filter(function(work) {
        return work.categoryId === categoryId;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const gallery = document.querySelector(".gallery");
    const filtersContainer = document.querySelector(".filters");

    getCategories(function(error, categories) {
        if (error) {
            console.error("Erreur : " + error);
        } else {
            categories.forEach(function(category) {
                var button = document.createElement("button");
                button.className = "filter-button";
                button.textContent = category.name;
                button.dataset.id = category.id;
                filtersContainer.appendChild(button);
            });
        }
    });
});
  
  