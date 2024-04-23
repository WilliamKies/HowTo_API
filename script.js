const apiKey = '8c4b867188ee47a1d4e40854b27391ec';

const movieContainer = document.getElementById('movieContainer');
const serieContainer = document.getElementById('serieContainer');
const detailsContainer = document.getElementById('detailsContainer');

/**
 * Permet de venir charger et récupérer tous les films
 * @returns 
 */
async function loadMovies() {
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

/**
 * permet de venir charger et récupérer toutes les séries
 * @returns 
 */
async function loadSeries() {
    const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

/**
 * Permet d'afficher la liste de tous les films de manière dynamique
 * @param {*} limit 
 */
async function showMovies(limit = Infinity) {
    const movies = await loadMovies();

    for (let index = 0; index < Math.min(limit, movies.length); index++) {
        const movie = movies[index];
        if (!movie) break;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie', 'swiper-slide');

        let imageElement = '';
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            imageElement = `<img src="${imageUrl}" class="card-img" alt="${movie.title}">`;
        } else {
            const placeholderImageUrl = 'placeholder.jpg';
            imageElement = `<img src="${placeholderImageUrl}" class="card-img" alt="Image non disponible">`;
        }

        movieCard.innerHTML = (`
            <div class="card text-bg-dark">
                ${imageElement}
                <button id="film-info-${movie.id}" class="btn btn-success">+</button>
            </div>
        `);

        movieContainer.appendChild(movieCard);
    }
}

/**
 * permet d'afficher la liste de toutes les séries de manière dynamique
 * @param {*} limit 
 */
async function showSeries(limit = Infinity) {
    const series = await loadSeries();

    for (let index = 0; index < Math.min(limit, series.length); index++) {
        const serie = series[index];
        if (!serie) break;

        const serieCard = document.createElement('div');
        serieCard.classList.add('serie', 'swiper-slide');

        let imageElement = '';
        if (serie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w500${serie.poster_path}`;
            imageElement = `<img src="${imageUrl}" class="card-img" alt="${serie.title}">`;
        } else {
            const placeholderImageUrl = 'placeholder.jpg';
            imageElement = `<img src="${placeholderImageUrl}" class="card-img" alt="Image non disponible">`;
            serieCard.classList.add('d-none');
        }

        serieCard.innerHTML = (`
            <div class="card text-bg-dark">
                ${imageElement}
                <button id="serie-info-${serie.id}" class="btn btn-success">+</button>
            </div>
        `);

        serieContainer.appendChild(serieCard);
    }
}

/**
 * Affichage des détails propre à un film
 * @param {*} id 
 */
async function loadMovieDetails(id) {
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayDetails(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

/**
 * Affichage des détails propre à une série
 * @param {*} id 
 */
async function loadSerieDetails(id) {
    const apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayDetails(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

/**
 * Affiche les détails dans une div que ce soit pour les films ou les séries
 * @param {*} details 
 */
function displayDetails(details) {
    detailsContainer.innerHTML = '';

    const detailsHTML = (`
        <div class="details">
            <h2>${details.title || details.name}</h2>
            <p>${details.overview}</p>
            <p>Date de sortie : ${details.release_date || details.first_air_date}</p>
            <p>Note moyenne : ${details.vote_average} / 10</p>
        </div>
    `);

    detailsContainer.innerHTML = detailsHTML;
}

/**
 * Fonction sui initialise les méthodes du fichier script.js
 */
function initializeApp() {
    showMovies();
    showSeries();

    movieContainer.addEventListener('click', function(event) {
        const targetId = event.target.id;
        if (targetId.startsWith('film-info-')) {
            const movieId = targetId.split('-')[2];
            loadMovieDetails(movieId);
        }
    });

    serieContainer.addEventListener('click', function(event) {
        const targetId = event.target.id;
        if (targetId.startsWith('serie-info-')) {
            const serieId = targetId.split('-')[2];
            loadSerieDetails(serieId);
        }
    });
}

initializeApp();