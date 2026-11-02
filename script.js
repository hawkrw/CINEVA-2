/* =========================================================
   HAWKMOVIES
   YOUR WORLD. YOUR CINEMA.
   Main JavaScript
========================================================= */

/* 1. SUPABASE CONFIGURATION
   Replace these placeholders with your Supabase project details.
========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabaseClient = null;

if (
    window.supabase &&
    SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}


/* 2. DEMO MOVIES
   Displayed when Supabase is not connected.
========================================================= */

const demoMovies = [
    {
        id: "1",
        title: "Shadow Mission",
        description: "A skilled agent enters a dangerous mission where every decision could be his last.",
        poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
        backdrop_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600",
        year: 2026,
        rating: 8.7,
        age_rating: "16+",
        genre: "Action",
        content_type: "Movie",
        slug: "shadow-mission",
        is_featured: true
    },
    {
        id: "2",
        title: "The Dark House",
        description: "A family discovers that their new home hides a terrifying secret.",
        poster_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500",
        year: 2025,
        rating: 8.2,
        age_rating: "18+",
        genre: "Horror",
        content_type: "Movie",
        slug: "the-dark-house"
    },
    {
        id: "3",
        title: "Beyond The Stars",
        description: "An extraordinary journey through a mysterious universe.",
        poster_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
        year: 2026,
        rating: 9.1,
        age_rating: "PG",
        genre: "Animation",
        content_type: "Movie",
        slug: "beyond-the-stars"
    },
    {
        id: "4",
        title: "Broken Hearts",
        description: "Two strangers discover love, trust, and the meaning of second chances.",
        poster_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500",
        year: 2025,
        rating: 8.4,
        age_rating: "13+",
        genre: "Drama",
        content_type: "Movie",
        slug: "broken-hearts"
    },
    {
        id: "5",
        title: "Campus Life",
        description: "Friendship, competition, secrets, and unforgettable school memories.",
        poster_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500",
        year: 2026,
        rating: 8.5,
        age_rating: "13+",
        genre: "High School",
        content_type: "Series",
        slug: "campus-life"
    },
    {
        id: "6",
        title: "Laugh Out Loud",
        description: "A comedy adventure full of unexpected moments and hilarious mistakes.",
        poster_url: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500",
        year: 2025,
        rating: 7.9,
        age_rating: "PG",
        genre: "Comedy",
        content_type: "Movie",
        slug: "laugh-out-loud"
    }
];


/* 3. APPLICATION STATE
========================================================= */

let movies = [];
let filteredMovies = [];
let currentSlide = 0;
let visibleMovies = 12;
let activeGenre = "All";

const GENRES = [
    "All",
    "Action",
    "Horror",
    "Drama",
    "High School",
    "Animation",
    "Comedy",
    "Erotic"
];


/* 4. DOM ELEMENTS
========================================================= */

const elements = {
    hero: document.getElementById("hero"),
    heroTitle: document.getElementById("heroTitle"),
    heroDescription: document.getElementById("heroDescription"),
    heroMeta: document.getElementById("heroMeta"),
    heroWatch: document.getElementById("heroWatch"),
    heroInfo: document.getElementById("heroInfo"),
    heroCounter: document.getElementById("heroCounter"),

    latestRow: document.getElementById("latestRow"),
    moviesRow: document.getElementById("moviesRow"),
    seriesRow: document.getElementById("seriesRow"),
    genreCollections: document.getElementById("genreCollections"),
    allGrid: document.getElementById("allGrid"),
    allCount: document.getElementById("allCount"),

    searchInput: document.getElementById("searchInput"),
    loadMore: document.getElementById("loadMore"),

    detailModal: document.getElementById("detailModal"),
    modalBackdrop: document.getElementById("modalBackdrop"),
    modalClose: document.getElementById("modalClose"),

    modalTitle: document.getElementById("modalTitle"),
    modalDescription: document.getElementById("modalDescription"),
    modalKicker: document.getElementById("modalKicker"),
    modalMeta: document.getElementById("modalMeta"),
    modalWatch: document.getElementById("modalWatch"),

    toast: document.getElementById("toast"),

    mainNav: document.getElementById("mainNav"),
    mobileMenu: document.getElementById("mobileMenu"),
    accountBtn: document.getElementById("accountBtn"),

    heroPrev: document.getElementById("heroPrev"),
    heroNext: document.getElementById("heroNext"),

    yearNow: document.getElementById("yearNow")
};


/* 5. INITIALIZE WEBSITE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    if (elements.yearNow) {
        elements.yearNow.textContent = new Date().getFullYear();
    }

    await loadMovies();

    setupSearch();
    setupNavigation();
    setupHeroControls();
    setupModal();
    setupLoadMore();

});


/* 6. LOAD MOVIES FROM SUPABASE
========================================================= */

async function loadMovies() {

    try {

        if (supabaseClient) {

            const { data, error } = await supabaseClient
                .from("movies")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            movies = data || [];

        } else {

            movies = [...demoMovies];

        }

    } catch (error) {

        console.error("Movie loading error:", error);

        movies = [...demoMovies];

        showToast("Using demo content. Check your Supabase settings.");

    }

    filteredMovies = [...movies];

    renderWebsite();

}


/* 7. RENDER ALL WEBSITE SECTIONS
========================================================= */

function renderWebsite() {

    renderHero();
    renderLatestMovies();
    renderMovies();
    renderSeries();
    renderGenres();
    renderAllMovies();

}


/* 8. FEATURED HERO SLIDER
========================================================= */

function getFeaturedMovies() {

    const featured = movies.filter(movie => movie.is_featured);

    return featured.length ? featured : movies.slice(0, 5);

}


function renderHero() {

    if (!elements.hero) return;

    const featuredMovies = getFeaturedMovies();

    if (!featuredMovies.length) return;

    const movie = featuredMovies[currentSlide % featuredMovies.length];

    elements.hero.style.backgroundImage =
        `linear-gradient(90deg, rgba(9,8,23,.98), rgba(9,8,23,.65), rgba(9,8,23,.15)),
         url("${movie.backdrop_url || movie.poster_url}")`;

    if (elements.heroTitle) {
        elements.heroTitle.textContent = movie.title;
    }

    if (elements.heroDescription) {
        elements.heroDescription.textContent = movie.description || "";
    }

    if (elements.heroMeta) {
        elements.heroMeta.innerHTML = `
            <span>${movie.year || "New"}</span>
            <span>${movie.content_type || "Movie"}</span>
            <span>${movie.age_rating || "PG"}</span>
            <span>⭐ ${movie.rating || "N/A"}</span>
        `;
    }

    if (elements.heroCounter) {
        elements.heroCounter.textContent =
            `${currentSlide + 1} / ${featuredMovies.length}`;
    }

    if (elements.heroWatch) {
        elements.heroWatch.onclick = () => watchMovie(movie);
    }

    if (elements.heroInfo) {
        elements.heroInfo.onclick = () => openMovieDetails(movie);
    }

}


function changeHeroSlide(direction) {

    const featuredMovies = getFeaturedMovies();

    if (!featuredMovies.length) return;

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = featuredMovies.length - 1;
    }

    if (currentSlide >= featuredMovies.length) {
        currentSlide = 0;
    }

    renderHero();

}


function setupHeroControls() {

    if (elements.heroNext) {
        elements.heroNext.addEventListener("click", () => {
            changeHeroSlide(1);
        });
    }

    if (elements.heroPrev) {
        elements.heroPrev.addEventListener("click", () => {
            changeHeroSlide(-1);
        });
    }

}


/* 9. MOVIE CARD GENERATOR
========================================================= */

function createMovieCard(movie) {

    const card = document.createElement("article");

    card.className = "poster-card";

    card.innerHTML = `
        <div class="poster-image">

            <img
                src="${escapeHTML(movie.poster_url || "")}"
                alt="${escapeHTML(movie.title)}"
                loading="lazy"
                onerror="this.src='https://placehold.co/400x600/17132B/F5F3FF?text=HAWKMOVIES'"
            >

            <span class="age-tag">
                ${escapeHTML(movie.age_rating || "PG")}
            </span>

            <button class="card-play" aria-label="Play ${escapeHTML(movie.title)}">
                ▶
            </button>

        </div>

        <div class="poster-info">

            <h3>${escapeHTML(movie.title)}</h3>

            <div class="poster-sub">
                <span>${escapeHTML(String(movie.year || "New"))}</span>
                <span>⭐ ${escapeHTML(String(movie.rating || "N/A"))}</span>
            </div>

            <span class="poster-date">
                ${escapeHTML(movie.genre || "Entertainment")}
            </span>

        </div>
    `;

    card.addEventListener("click", () => {
        openMovieDetails(movie);
    });

    return card;

}


function renderMovieCards(container, movieList) {

    if (!container) return;

    container.innerHTML = "";

    if (!movieList.length) {

        container.innerHTML = `
            <p class="empty-message">
                No content available yet.
            </p>
        `;

        return;

    }

    movieList.forEach(movie => {

        container.appendChild(createMovieCard(movie));

    });

}


/* 10. LATEST MOVIES
========================================================= */

function renderLatestMovies() {

    const latest = [...movies]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 12);

    renderMovieCards(elements.latestRow, latest);

}


/* 11. MOVIES SECTION
========================================================= */

function renderMovies() {

    const movieList = movies.filter(movie =>
        movie.content_type === "Movie"
    );

    renderMovieCards(elements.moviesRow, movieList);

}


/* 12. SERIES SECTION
========================================================= */

function renderSeries() {

    const seriesList = movies.filter(movie =>
        movie.content_type === "Series"
    );

    renderMovieCards(elements.seriesRow, seriesList);

}


/* 13. GENRE COLLECTIONS
========================================================= */

function renderGenres() {

    if (!elements.genreCollections) return;

    elements.genreCollections.innerHTML = "";

    GENRES.filter(genre => genre !== "All").forEach(genre => {

        const genreMovies = movies.filter(movie =>
            movie.genre === genre
        );

        if (!genreMovies.length) return;

        const section = document.createElement("section");

        section.className = "genre-section";

        section.innerHTML = `
            <div class="section-heading">
                <h2>${escapeHTML(genre)}</h2>
                <span>${genreMovies.length} titles</span>
            </div>

            <div class="movie-row"></div>
        `;

        const row = section.querySelector(".movie-row");

        renderMovieCards(row, genreMovies);

        elements.genreCollections.appendChild(section);

    });

}


/* 14. ALL MOVIES GRID
========================================================= */

function renderAllMovies() {

    if (!elements.allGrid) return;

    const visible = filteredMovies.slice(0, visibleMovies);

    renderMovieCards(elements.allGrid, visible);

    if (elements.allCount) {
        elements.allCount.textContent = filteredMovies.length;
    }

    if (elements.loadMore) {
        elements.loadMore.style.display =
            visibleMovies >= filteredMovies.length ? "none" : "inline-flex";
    }

}


/* 15. SEARCH FUNCTIONALITY
========================================================= */

function setupSearch() {

    if (!elements.searchInput) return;

    elements.searchInput.addEventListener("input", event => {

        const searchTerm = event.target.value
            .toLowerCase()
            .trim();

        filteredMovies = movies.filter(movie => {

            const title = (movie.title || "").toLowerCase();
            const genre = (movie.genre || "").toLowerCase();
            const description = (movie.description || "").toLowerCase();

            return (
                title.includes(searchTerm) ||
                genre.includes(searchTerm) ||
                description.includes(searchTerm)
            );

        });

        visibleMovies = 12;

        renderAllMovies();

    });

}


/* 16. GENRE FILTER
========================================================= */

function filterByGenre(genre) {

    activeGenre = genre;

    filteredMovies = genre === "All"
        ? [...movies]
        : movies.filter(movie => movie.genre === genre);

    visibleMovies = 12;

    renderAllMovies();

}


/* 17. MOVIE DETAILS MODAL
========================================================= */

function openMovieDetails(movie) {

    if (!elements.detailModal) return;

    elements.modalTitle.textContent = movie.title || "Untitled";

    elements.modalDescription.textContent =
        movie.description || "No description available.";

    elements.modalKicker.textContent =
        `${movie.genre || "Entertainment"} • ${movie.content_type || "Movie"}`;

    elements.modalMeta.innerHTML = `
        <span>${movie.year || "New"}</span>
        <span>${movie.age_rating || "PG"}</span>
        <span>⭐ ${movie.rating || "N/A"}</span>
    `;

    elements.modalWatch.onclick = () => watchMovie(movie);

    elements.detailModal.classList.add("open");

    document.body.style.overflow = "hidden";

}


function closeMovieDetails() {

    if (!elements.detailModal) return;

    elements.detailModal.classList.remove("open");

    document.body.style.overflow = "";

}


function setupModal() {

    if (elements.modalClose) {
        elements.modalClose.addEventListener("click", closeMovieDetails);
    }

    if (elements.modalBackdrop) {
        elements.modalBackdrop.addEventListener("click", closeMovieDetails);
    }

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMovieDetails();
        }

    });

}


/* 18. WATCH MOVIE
========================================================= */

function watchMovie(movie) {

    if (!movie) return;

    const identifier = movie.slug || movie.id;

    if (!identifier) {
        showToast("This title does not have a watch page identifier.");
        return;
    }

    window.location.href =
        `watch.html?id=${encodeURIComponent(identifier)}`;

}


/* 19. LOAD MORE BUTTON
========================================================= */

function setupLoadMore() {

    if (!elements.loadMore) return;

    elements.loadMore.addEventListener("click", () => {

        visibleMovies += 12;

        renderAllMovies();

    });

}


/* 20. NAVIGATION
========================================================= */

function setupNavigation() {

    if (elements.mobileMenu && elements.mainNav) {

        elements.mobileMenu.addEventListener("click", () => {

            elements.mainNav.classList.toggle("active");

        });

    }

    if (elements.accountBtn) {

        elements.accountBtn.addEventListener("click", () => {

            showToast("Account features coming soon.");

        });

    }

}


/* 21. TOAST NOTIFICATION
========================================================= */

function showToast(message) {

    if (!elements.toast) {
        console.log(message);
        return;
    }

    elements.toast.textContent = message;

    elements.toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {

        elements.toast.classList.remove("show");

    }, 3000);

}


/* 22. BASIC HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


/* =========================================================
   END OF HAWKMOVIES SCRIPT
========================================================= */
