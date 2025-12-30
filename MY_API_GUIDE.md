# 🎬 TMDB API Quick Guide

Your token & base URL (in App.jsx):

```javascript
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxN2YwNmYzMDZmZGU5MTYyZmY0ZDQwYmQwMmU3Y2QyNiIsIm5iZiI6MTc2NDMzNDI3My45NTI5OTk4LCJzdWIiOiI2OTI5OWFjMWI0ZTUwNDEwNWVlYWE3YmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6kD0qF6BHMEzKuWrHNt8OD8enVowg6iin3yO_t6Bei8";
const API_BASE_URL = "https://api.themoviedb.org/3";
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};
```

---

## Search by Name

### Search Movies by Title

```javascript
async function searchMovies(query, page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const movies = await searchMovies("Inception", 1); // Page 1
const page2 = await searchMovies("Inception", 2); // Page 2
```

### Search by Actor/Director

```javascript
async function searchPeople(name) {
  const response = await fetch(
    `${API_BASE_URL}/search/person?query=${encodeURIComponent(name)}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const people = await searchPeople("Leonardo DiCaprio");
```

### Search TV Shows

```javascript
async function searchTV(name, page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/search/tv?query=${encodeURIComponent(name)}&page=${page}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const shows = await searchTV("Breaking Bad", 1);
```

---

## Pagination & Lists

### Popular Movies with Pagination

```javascript
async function getPopular(page = 1) {
  const response = await fetch(`${API_BASE_URL}/movie/popular?page=${page}`, {
    method: "GET",
    headers,
  });
  return (await response.json()).results;
}

// Usage
const page1 = await getPopular(1);
const page2 = await getPopular(2);
const page3 = await getPopular(3);
```

### Top Rated Movies

```javascript
async function getTopRated(page = 1) {
  const response = await fetch(`${API_BASE_URL}/movie/top_rated?page=${page}`, {
    method: "GET",
    headers,
  });
  return (await response.json()).results;
}
```

### Upcoming Movies

```javascript
async function getUpcoming(page = 1) {
  const response = await fetch(`${API_BASE_URL}/movie/upcoming?page=${page}`, {
    method: "GET",
    headers,
  });
  return (await response.json()).results;
}
```

---

## Filter by Year, Genre, Rating

### By Year

```javascript
async function getMoviesByYear(year, page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/discover/movie?primary_release_year=${year}&page=${page}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const movies2024 = await getMoviesByYear(2024, 1);
const movies2020 = await getMoviesByYear(2020, 1);
```

### By Genre (ID = 28: Action, 35: Comedy, 18: Drama, 27: Horror, 878: Sci-Fi)

```javascript
async function getMoviesByGenre(genreId, page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const action = await getMoviesByGenre(28, 1); // Action
const comedy = await getMoviesByGenre(35, 1); // Comedy
const drama = await getMoviesByGenre(18, 1); // Drama
const scifi = await getMoviesByGenre(878, 1); // Sci-Fi
```

### By Rating (7+ or 8+)

```javascript
async function getByRating(minRating = 7, page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/discover/movie?vote_average.gte=${minRating}&sort_by=vote_average.desc&page=${page}`,
    { method: "GET", headers }
  );
  return (await response.json()).results;
}

// Usage
const good = await getByRating(7, 1); // 7+ rating
const great = await getByRating(8, 1); // 8+ rating
```

### Multiple Filters Combined

```javascript
async function discover(year, genreId, minRating, page = 1) {
  const url =
    `${API_BASE_URL}/discover/movie?` +
    `primary_release_year=${year}&` +
    `with_genres=${genreId}&` +
    `vote_average.gte=${minRating}&` +
    `sort_by=popularity.desc&page=${page}`;

  const response = await fetch(url, { method: "GET", headers });
  return (await response.json()).results;
}

// Usage
const actionFrom2024 = await discover(2024, 28, 7, 1); // Action, 2024, 7+ rating, page 1
const scifiFrom2023 = await discover(2023, 878, 8, 1); // Sci-Fi, 2023, 8+ rating, page 1
```

---

## Movie Details & Cast

### Get Full Movie Details

```javascript
async function getMovieDetails(movieId) {
  const response = await fetch(
    `${API_BASE_URL}/movie/${movieId}?append_to_response=credits,videos`,
    { method: "GET", headers }
  );
  return await response.json();
}

// Usage
const movie = await getMovieDetails(27205); // Inception
console.log(movie.title, movie.overview, movie.vote_average);
console.log(movie.credits.cast); // Cast list
console.log(movie.videos.results); // Trailers
```

### Get Cast Only

```javascript
async function getCast(movieId) {
  const response = await fetch(`${API_BASE_URL}/movie/${movieId}/credits`, {
    method: "GET",
    headers,
  });
  return (await response.json()).cast;
}

// Usage
const actors = await getCast(27205);
actors.forEach((a) => console.log(`${a.name} as ${a.character}`));
```

---

## Other Useful Functions

### Format Image URL

```javascript
function getImage(path, size = "w300") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

// Usage
const movie = await getMovieDetails(27205);
console.log(getImage(movie.poster_path, "w500"));
```

### Get YouTube Link

```javascript
function getTrailerLink(videoKey) {
  return `https://www.youtube.com/watch?v=${videoKey}`;
}
```

### Format Money

```javascript
function formatMoney(num) {
  return num ? `$${(num / 1000000).toFixed(0)}M` : "N/A";
}
```

---

## Common Genre IDs

```
28 = Action, 12 = Adventure, 16 = Animation, 35 = Comedy
80 = Crime, 99 = Documentary, 18 = Drama, 14 = Fantasy
27 = Horror, 10749 = Romance, 878 = Sci-Fi, 53 = Thriller
```

---

## Quick API Calls Summary

| What            | Code                                  |
| --------------- | ------------------------------------- |
| Search movies   | `searchMovies('Inception', page)`     |
| Search actor    | `searchPeople('Leo DiCaprio')`        |
| Popular movies  | `getPopular(page)`                    |
| Top rated       | `getTopRated(page)`                   |
| Movies by year  | `getMoviesByYear(2024, page)`         |
| Movies by genre | `getMoviesByGenre(28, page)`          |
| High rated      | `getByRating(7, page)`                |
| Movie details   | `getMovieDetails(movieId)`            |
| Cast            | `getCast(movieId)`                    |
| Combined filter | `discover(year, genre, rating, page)` |
