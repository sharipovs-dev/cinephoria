export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

export interface API_ENDPOINTS_PROPS{
  popular: string;
  topRated:string;
  upcoming: string;
  search: string;
  genres: string;
  details:string;
  favorites:string;
}
export const API_ENDPOINTS: API_ENDPOINTS_PROPS = {
  popular: "/movie/popular",
  topRated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  search: "/search/multi",
  genres: "/discover/movie",
  details:"/movie",
  favorites:"/movie"
};  

export interface Genre {
  id: number;
  name: string;
}

export const MOVIE_GENRES:Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];
