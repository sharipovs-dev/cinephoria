import { useContext, useRef } from "react";
import "./SearchFilters.css";
import ApiContext from "../Contexts/apiContext";

interface SearchFiltersProps {
  setSelectedGenre: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;

}

export default function SearchFilters({ setSelectedGenre,setPage }: SearchFiltersProps) {
  const api  = useContext(ApiContext);
  if (!api) return null;
  const { MOVIE_GENRES } = api;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="filter-wrapper">
      <button
        className="scroll-button left"
        onClick={() => scrollByAmount(-200)}
      >
        ◀
      </button>

      <div className="filter-container" ref={containerRef}>
        {MOVIE_GENRES.map((genre: { id: number; name: string }) => (
          <button
            className="genre-buttons"
            key={genre.id}
            onClick={() => {setSelectedGenre(genre.id); setPage(1)}}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <button
        className="scroll-button right"
        onClick={() => scrollByAmount(200)}
      >
        ▶
      </button>
    </div>
  );
}
