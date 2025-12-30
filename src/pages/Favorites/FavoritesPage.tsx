import "../../components/DisplayResultsSection.css"; 
import React, { useContext, useEffect, useState } from "react";
import ApiContext from "../../Contexts/apiContext";
import { useNavigate, Navigate } from "react-router-dom";
import fallbackPoster from "../../assets/images/fallback_poster.png";
import favoriteIconEmpty from "../../assets/icons/heart-black-icon.png";
import favoriteIconRed from "../../assets/icons/heart-red-icon.png";
import "./FavoritesPage.css";
import { useAuth } from "../../Contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";

interface Movie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
}

export default function FavoritesPage() {
  const { user } = useAuth(); //  protect with auth
  const api = useContext(ApiContext);
  const navigate = useNavigate();

  if (!api) return null;
  const { fetchFavorites } = api;

  const [favoritesData, setFavoritesData] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from Supabase when logged in
  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("movie_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching favorites:", error);
        return;
      }

      const ids = data?.map((f) => f.movie_id) || [];
      setFavorites(ids);

      if (ids.length > 0) {
        const res = await fetchFavorites(ids);
        setFavoritesData(res);
      }
    };

    loadFavorites();
  }, [user]);

  
  const handleFavorites = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (!user) {
      alert("You must be logged in to manage favorites.");
      return;
    }

    const isFavorite = favorites.includes(id);

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", id);
    } else {
      await supabase
        .from("favorites")
        .insert([{ user_id: user.id, movie_id: id }]);
    }

   
    setFavorites((prev) =>
      isFavorite ? prev.filter((movie) => movie !== id) : [...prev, id]
    );
    setFavoritesData((prevData) =>
      isFavorite
        ? prevData.filter((movie) => movie.id !== id)
        : prevData 
    );
  };

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="main-lists-container">
      {favoritesData.length > 0 ? (
        favoritesData.map((movie) => (
          <div
            className="list-card"
            key={movie.id}
            onClick={() => navigate(`/details/${movie.id}`)}
          >
            <div className="list-poster-container">
              <span
                onClick={(e) => handleFavorites(e, movie.id)}
                className="list-icon-wrapper"
              >
                <img
                  className="list-icon-favorite"
                  src={
                    favorites.includes(movie.id)
                      ? favoriteIconRed
                      : favoriteIconEmpty
                  }
                  alt="favorite icon"
                />
              </span>
              <img
                className="list-poster"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : fallbackPoster
                }
                alt={movie.title}
              />
            </div>
            <p className="list-genre">
              {movie.genres?.map((g) => g.name).join(" • ")}
            </p>
            <h3>{movie.title}</h3>
            <div className="list-date-rating">
              <p className="list-rating">
                {movie.vote_average?.toFixed(1) ?? "N/A"}
              </p>
              <p className="list-date">{movie.release_date}</p>
            </div>
          </div>
        ))
      ) : (
        <h2 style={{ padding: "2rem" }}>No favorites yet...</h2>
      )}
    </section>
  );
}