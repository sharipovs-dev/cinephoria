import "./DisplayResultsSection.css";
import Pagination from "./Pagination";
import React, { useContext, useEffect, useState } from "react";
import ApiContext from "../Contexts/apiContext";
import { useNavigate } from "react-router-dom";
import { Genre } from "../api/apiConfig";
import fallbackPoster from "../assets/images/fallback_poster.png";
import favoriteIconEmpty from "../assets/icons/heart-black-icon.png";
import favoriteIconRed from "../assets/icons/heart-red-icon.png";
import { useAuth } from "../Contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

export interface resultsProps {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id?: number;
  original_language: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface dataListsProps {
  page?: number;
  results?: resultsProps[];
  total_pages?: number;
  total_results?: number;
}

interface DisplayResultsSectionProps {
  page: number;
  setPage: (page: number) => void;
  dataLists: dataListsProps;
}

export default function DisplayResultsSection({
  page,
  setPage,
  dataLists,
}: DisplayResultsSectionProps) {
  const api = useContext(ApiContext);
  if (!api) return null;
  const { MOVIE_GENRES } = api;

  const navigate = useNavigate();
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from Supabase when user is logged in
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

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
    };

    loadFavorites();
  }, [user]);

  const genreTypes = (genreIds?: number[]) => {
    if (genreIds) {
      const haveGenres: string[] = [];
      genreIds.forEach((genreIdType) => {
        MOVIE_GENRES.forEach((movieGenre: Genre) => {
          if (genreIdType === movieGenre.id) {
            haveGenres.push(movieGenre.name);
          }
        });
      });
      return haveGenres.join(" • ");
    }
  };

  const handleFavorites = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (!user) {
      alert("You must be logged in to add favorites.");
      return;
    }

    try {
      // Check if movie is already in favorites
      const { data: existing, error: selectError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", id)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking favorites:", selectError);
        return;
      }

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existing.id);

        if (deleteError) {
          console.error("Error removing favorite:", deleteError);
          return;
        }

        setFavorites((prev) => prev.filter((movie) => movie !== id));
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from("favorites")
          .insert([{ user_id: user.id, movie_id: id }]);

        if (insertError) {
          console.error("Error adding favorite:", insertError);
          return;
        }

        setFavorites((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <>
      <section className="main-lists-container">
        {dataLists.results ? (
          dataLists.results.map((listCard) => {
            return (
              <div
                className="list-card"
                key={listCard.id}
                onClick={() => navigate(`/details/${listCard.id}`)}
              >
                <div className="list-poster-container">
                  <span
                    onClick={(e) => {
                      handleFavorites(e, listCard.id!);
                    }}
                    className="list-icon-wrapper"
                  >
                    <img
                      className="list-icon-favorite"
                      src={
                        listCard.id && favorites.includes(listCard.id)
                          ? favoriteIconRed
                          : favoriteIconEmpty
                      }
                      alt="favorite icon"
                    />
                  </span>
                  <img
                    className="list-poster"
                    src={
                      listCard.poster_path
                        ? `https://image.tmdb.org/t/p/w300${listCard.poster_path}`
                        : fallbackPoster
                    }
                    alt={listCard.title}
                  />
                </div>
                <p className="list-genre">{genreTypes(listCard.genre_ids)}</p>
                <h3>{listCard.title}</h3>
                <div className="list-date-rating">
                  <p className="list-rating">
                    {listCard.vote_average
                      ? listCard.vote_average.toFixed(1)
                      : "N/A"}
                  </p>
                  <p className="list-date">{listCard.release_date}</p>
                </div>
              </div>
            );
          })
        ) : (
          <h1 style={{ padding: "2rem 4rem" }}>Not Found...</h1>
        )}
      </section>
      {dataLists && dataLists.total_pages && dataLists.total_pages > 1 ? (
        <div
          className="lists-pagination-wrap"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "1.25rem 0",
          }}
        >
          <Pagination
            page={page}
            totalPages={dataLists.total_pages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : null}
    </>
  );
}