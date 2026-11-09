const movies = [
  {
    id: 1,
    title: "Beyond the Divide",
    about: "A fearless pilot chases a signal from the edge of the known universe.",
    genre: "Sci-Fi",
    year: 2024,
    rating: 9.1,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Midnight Run",
    about: "One last night. One impossible job. No room for a wrong turn.",
    genre: "Action",
    year: 2023,
    rating: 8.7,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "The Quiet Between",
    about: "Two strangers find a second chance in a small coastal town.",
    genre: "Drama",
    year: 2022,
    rating: 8.9,
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Good Company",
    about: "A disastrous road trip turns into the best week of their lives.",
    genre: "Comedy",
    year: 2024,
    rating: 8.2,
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Neon District",
    about: "A detective follows a string of clues through a city that never sleeps.",
    genre: "Action",
    year: 2021,
    rating: 8.5,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "A Brighter Season",
    about: "A family learns to find joy in the moments they almost missed.",
    genre: "Drama",
    year: 2020,
    rating: 8.4,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "Orbit 9",
    about: "Cut off from Earth, a crew must decide what is worth saving.",
    genre: "Sci-Fi",
    year: 2023,
    rating: 9.3,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "The Big Little Plan",
    about: "A very serious plan falls apart in the most hilarious way.",
    genre: "Comedy",
    year: 2019,
    rating: 7.9,
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
  },
];

const movieGrid = document.querySelector("#movie-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const genreFilters = document.querySelector("#genre-filters");
const movieCount = document.querySelector("#movie-count");
const emptyState = document.querySelector("#empty-state");
const movieDialog = document.querySelector("#movie-dialog");
const movieForm = document.querySelector("#movie-form");
const assistantDialog = document.querySelector("#assistant-dialog");
const assistantForm = document.querySelector("#assistant-form");
const recommendationResult = document.querySelector("#recommendation-result");
let activeGenre = "All";

const starIcon = `
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m8 1.5 2 4.06 4.48.65-3.24 3.16L12 13.84 8 11.74l-4 2.1.76-4.47L1.52 6.21 6 5.56 8 1.5Z" fill="currentColor" />
  </svg>`;

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-card";

  const posterWrap = document.createElement("div");
  posterWrap.className = "poster-wrap";

  const poster = document.createElement("img");
  poster.className = "poster";
  poster.src = movie.image || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85";
  poster.alt = `${movie.title} poster`;
  poster.loading = "lazy";
  poster.onerror = () => {
    poster.onerror = null;
    poster.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85";
  };

  const genreTag = document.createElement("span");
  genreTag.className = "poster-genre";
  genreTag.textContent = movie.genre;

  const shade = document.createElement("div");
  shade.className = "poster-shade";
  const posterRating = document.createElement("div");
  posterRating.className = "poster-rating";
  posterRating.innerHTML = `${starIcon}<span>${movie.rating.toFixed(1)}</span>`;
  posterWrap.append(poster, shade, genreTag, posterRating);

  const info = document.createElement("div");
  info.className = "movie-info";
  const titleLine = document.createElement("div");
  titleLine.className = "movie-title-line";
  const title = document.createElement("h3");
  title.className = "movie-title";
  title.textContent = movie.title;
  const year = document.createElement("span");
  year.className = "movie-year";
  year.textContent = movie.year;
  titleLine.append(title, year);

  const about = document.createElement("p");
  about.className = "movie-about";
  about.textContent = movie.about;

  const meta = document.createElement("div");
  meta.className = "movie-meta";
  const metaGenre = document.createElement("span");
  metaGenre.className = "meta-genre";
  const dot = document.createElement("span");
  dot.className = "genre-dot";
  metaGenre.append(dot, document.createTextNode(movie.genre));
  const metaRating = document.createElement("span");
  metaRating.className = "movie-meta-rating";
  metaRating.innerHTML = `<span>★</span> ${movie.rating.toFixed(1)} / 10`;
  meta.append(metaGenre, metaRating);

  info.append(titleLine, about, meta);
  card.append(posterWrap, info);
  return card;
}

function renderMovies() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleMovies = movies
    .filter((movie) => activeGenre === "All" || movie.genre === activeGenre)
    .filter((movie) => `${movie.title} ${movie.about} ${movie.genre} ${movie.year}`.toLocaleLowerCase().includes(query))
    .sort((a, b) => {
      if (sortSelect.value === "newest") return b.year - a.year || b.rating - a.rating;
      if (sortSelect.value === "oldest") return a.year - b.year || b.rating - a.rating;
      return b.rating - a.rating;
    });

  movieGrid.replaceChildren(...visibleMovies.map(createMovieCard));
  movieCount.textContent = String(visibleMovies.length).padStart(2, "0");
  emptyState.hidden = visibleMovies.length > 0;
  movieGrid.hidden = visibleMovies.length === 0;
}

function openMovieDialog() {
  movieDialog.showModal();
  movieForm.elements.title.focus();
}

function buildRecommendationRequest(formData) {
  return {
    instructions: [
      "Recommend exactly one movie from the provided collection.",
      "Do not invent or recommend titles that are not in the collection.",
      "Use the user's mood and genre preferences when choosing.",
      "Return the selected movie's id and a brief explanation.",
    ],
    preferences: {
      mood: String(formData.get("mood")),
      genre: String(formData.get("genre")),
      runtime: String(formData.get("runtime")),
    },
    movies: movies.map(({ id, title, about, genre, year, rating }) => ({
      id,
      title,
      about,
      genre,
      year,
      rating,
    })),
    responseFormat: {
      movieId: "id of one movie in the provided collection",
      reason: "brief explanation based on the preferences",
    },
  };
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderMovies();
});
searchInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);
genreFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-genre]");
  if (!button) return;
  activeGenre = button.dataset.genre;
  genreFilters.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderMovies();
});

document.querySelector("#open-modal").addEventListener("click", openMovieDialog);
document.querySelector("#empty-create").addEventListener("click", openMovieDialog);
document.querySelector("#close-modal").addEventListener("click", () => movieDialog.close());
document.querySelector("#cancel-modal").addEventListener("click", () => movieDialog.close());
movieDialog.addEventListener("click", (event) => {
  if (event.target === movieDialog) movieDialog.close();
});
movieForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!movieForm.reportValidity()) return;

  const formData = new FormData(movieForm);
  const image = String(formData.get("image")).trim();
  movies.unshift({
    id: Date.now(),
    title: String(formData.get("title")).trim(),
    about: String(formData.get("about")).trim(),
    genre: String(formData.get("genre")),
    year: Number(formData.get("year")),
    rating: Number(formData.get("rating")),
    image,
  });
  activeGenre = "All";
  searchInput.value = "";
  sortSelect.value = "rating";
  genreFilters.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip.dataset.genre === "All";
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  movieForm.reset();
  movieDialog.close();
  renderMovies();
});

document.querySelector("#footer-year").textContent = new Date().getFullYear();
renderMovies();

document.querySelector("#open-assistant").addEventListener("click", () => {
  assistantDialog.showModal();
  assistantForm.elements.mood.focus();
});
document.querySelector("#close-assistant").addEventListener("click", () => assistantDialog.close());
assistantDialog.addEventListener("click", (event) => {
  if (event.target === assistantDialog) assistantDialog.close();
});
assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const request = buildRecommendationRequest(new FormData(assistantForm));
  const { mood, genre } = request.preferences;
  const moodGenres = {
    "feel-good": ["Comedy", "Drama"],
    thrilling: ["Action"],
    "thought-provoking": ["Drama", "Sci-Fi"],
    funny: ["Comedy"],
    "mind-bending": ["Sci-Fi"],
  };
  const candidates = request.movies.filter((movie) => genre === "any" || movie.genre === genre);
  const recommendation = candidates.sort((a, b) => {
    const moodGenresForPick = moodGenres[mood] || [];
    const genreScoreA = moodGenresForPick.includes(a.genre) ? 1 : 0;
    const genreScoreB = moodGenresForPick.includes(b.genre) ? 1 : 0;
    return genreScoreB - genreScoreA || b.rating - a.rating;
  })[0];

  if (!recommendation) {
    recommendationResult.hidden = false;
    document.querySelector("#recommendation-title").textContent = "No matching movies yet";
    document.querySelector("#recommendation-meta").textContent = "";
    document.querySelector("#recommendation-reason").textContent = "Try another genre or add a movie to your collection.";
    return;
  }

  const moodLabel = assistantForm.elements.mood.selectedOptions[0].textContent.toLowerCase();
  const genreLabel = genre === "any" ? recommendation.genre : genre;
  document.querySelector("#recommendation-title").textContent = recommendation.title;
  document.querySelector("#recommendation-meta").textContent = `${recommendation.genre} · ${recommendation.year} · ★ ${recommendation.rating.toFixed(1)}`;
  document.querySelector("#recommendation-reason").textContent = `A ${recommendation.genre} pick for your ${moodLabel} mood. It’s the highest-rated match in ${genre === "any" ? `the ${genreLabel} category` : `your ${genreLabel} selection`}.`;
  recommendationResult.hidden = false;
});
