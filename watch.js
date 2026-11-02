
/* =========================================================
   HAWKMOVIES — WATCH PAGE JAVASCRIPT
   YOUR WORLD. YOUR CINEMA.
========================================================= */

/* 1. SUPABASE CONFIGURATION
   Use the same project URL and anon key as script.js.
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


/* 2. DOM ELEMENTS
========================================================= */

const video = document.getElementById("movieVideo");
const placeholder = document.getElementById("playerPlaceholder");
const playerMessage = document.getElementById("playerMessage");

const titleElement = document.getElementById("watchTitle");
const descriptionElement = document.getElementById("watchDescription");
const metaElement = document.getElementById("watchMeta");
const typeElement = document.getElementById("watchType");
const breadcrumbElement = document.getElementById("watchBreadcrumbTitle");

const recommendedContainer = document.getElementById("recommendedMovies");

const restartButton = document.getElementById("restartButton");
const copyLinkButton = document.getElementById("copyLinkButton");

const toast = document.getElementById("toast");
const yearNow = document.getElementById("yearNow");


/* 3. CURRENT MOVIE
========================================================= */

let currentMovie = null;
let allMovies = [];


/* 4. START WEBSITE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    if (yearNow) {
        yearNow.textContent = new Date().getFullYear();
    }

    setupPlayerControls();

    await loadSelectedMovie();

});


/* 5. GET MOVIE ID FROM URL
========================================================= */

function getMovieIdentifier() {

    const params = new URLSearchParams(window.location.search);

    return params.get("id") || params.get("slug");

}


/* 6. LOAD SELECTED MOVIE
========================================================= */

async function loadSelectedMovie() {

    const identifier = getMovieIdentifier();

    if (!identifier) {

        showPlayerError("No movie was selected. Please return to HAWKMOVIES.");

        return;

    }

    if (!supabaseClient) {

        showPlayerError(
            "Supabase is not connected. Add your project URL and anon key to watch.js."
        );

        return;

    }

    try {

        const isUUID =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            .test(identifier);

        const field = isUUID ? "id" : "slug";

        const { data, error } = await supabaseClient
            .from("movies")
            .select("*")
            .eq(field, identifier)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {

            showPlayerError("This movie could not be found.");

            return;

        }

        currentMovie = data;

        displayMovieInformation(data);

        await loadMovieVideo(data);

        await loadRecommendations(data);

        document.title = `${data.title} | HAWKMOVIES`;

    } catch (error) {

        console.error("Movie loading error:", error);

        showPlayerError(
            "Unable to load this movie. Please check the movie details and try again."
        );

    }

}


/* 7. DISPLAY MOVIE INFORMATION
========================================================= */

function displayMovieInformation(movie) {

    titleElement.textContent = movie.title || "Untitled Movie";

    descriptionElement.textContent =
        movie.description || "No description available.";

    typeElement.textContent =
        movie.content_type === "Series"
            ? "HAWKMOVIES SERIES"
            : "HAWKMOVIES MOVIE";

    breadcrumbElement.textContent = movie.title || "Now Watching";

    metaElement.innerHTML = "";

    const details = [
        movie.year || "New",
        movie.genre || "Entertainment",
        movie.content_type || "Movie",
        movie.age_rating || "PG",
        movie.rating ? `⭐ ${movie.rating}` : "Not rated"
    ];

    details.forEach(detail => {

        const span = document.createElement("span");

        span.textContent = detail;

        metaElement.appendChild(span);

    });

}


/* 8. LOAD VIDEO
========================================================= */

async function loadMovieVideo(movie) {

    if (!movie.video_url) {

        showPlayerError(
            "Video not available yet. Please check back later."
        );

        return;

    }

    try {

        video.src = movie.video_url;

        if (movie.poster_url) {
            video.poster = movie.poster_url;
        }

        video.style.display = "block";

        placeholder.style.display = "none";

        video.load();

        video.addEventListener("error", () => {

            showPlayerError(
                "The video could not be played. Check the video URL and file format."
            );

        }, { once: true });

    } catch (error) {

        console.error("Video error:", error);

        showPlayerError("Unable to open this video.");

    }

}


/* 9. PLAYER CONTROLS
========================================================= */

function setupPlayerControls() {

    if (restartButton) {

        restartButton.addEventListener("click", () => {

            if (!video.src) return;

            video.currentTime = 0;

            video.play().catch(() => {
                showToast("Press play on the video player to start.");
            });

        });

    }

    if (copyLinkButton) {

        copyLinkButton.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(window.location.href);

                showToast("Movie link copied!");

            } catch (error) {

                showToast("Unable to copy link. Copy it from your browser.");

            }

        });

    }

}


/* 10. LOAD RECOMMENDATIONS
========================================================= */

async function loadRecommendations(movie) {

    if (!recommendedContainer) return;

    try {

        const { data, error } = await supabaseClient
            .from("movies")
            .select("id,title,slug,poster_url,year,rating,age_rating,genre,content_type")
            .neq("id", movie.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            throw error;
        }

        allMovies = data || [];

        renderRecommendations(allMovies);

    } catch (error) {

        console.error("Recommendation error:", error);

        recommendedContainer.innerHTML = `
            <p class="loading-message">
                Recommendations are currently unavailable.
            </p>
        `;

    }

}


/* 11. DISPLAY RECOMMENDATIONS
========================================================= */

function renderRecommendations(movieList) {

    recommendedContainer.innerHTML = "";

    if (!movieList.length) {

        recommendedContainer.innerHTML = `
            <p class="loading-message">
                No recommendations available yet.
            </p>
        `;

        return;

    }

    movieList.forEach(movie => {

        const card = document.createElement("article");

        card.className = "poster-card";

        const image = document.createElement("div");

        image.className = "poster-image";

        const poster = document.createElement("img");

        poster.src = movie.poster_url || "";

        poster.alt = movie.title || "Movie poster";

        poster.loading = "lazy";

        poster.onerror = () => {
            poster.src =
                "https://placehold.co/400x600/17132B/F5F3FF?text=HAWKMOVIES";
        };

        const age = document.createElement("span");

        age.className = "age-tag";

        age.textContent = movie.age_rating || "PG";

        image.append(poster, age);

        const info = document.createElement("div");

        info.className = "poster-info";

        const heading = document.createElement("h3");

        heading.textContent = movie.title || "Untitled";

        const sub = document.createElement("div");

        sub.className = "poster-sub";

        const year = document.createElement("span");

        year.textContent = movie.year || "New";

        const rating = document.createElement("span");

        rating.textContent = `⭐ ${movie.rating || "N/A"}`;

        sub.append(year, rating);

        const genre = document.createElement("span");

        genre.className = "poster-date";

        genre.textContent = movie.genre || "Entertainment";

        info.append(heading, sub, genre);

        card.append(image, info);

        card.addEventListener("click", () => {

            const identifier = movie.slug || movie.id;

            window.location.href =
                `watch.html?id=${encodeURIComponent(identifier)}`;

        });

        recommendedContainer.appendChild(card);

    });

}


/* 12. PLAYER ERROR MESSAGE
========================================================= */

function showPlayerError(message) {

    if (video) {

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.style.display = "none";

    }

    if (placeholder) {

        placeholder.style.display = "flex";

    }

    if (playerMessage) {

        playerMessage.textContent = message;

    }

}


/* 13. TOAST NOTIFICATIONS
========================================================= */

function showToast(message) {

    if (!toast) {

        console.log(message);

        return;

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   END OF HAWKMOVIES WATCH SCRIPT
========================================================= */
