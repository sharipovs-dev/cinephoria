import { lazy, Suspense, useContext, useEffect, useState } from "react";

import SearchSection from "../../components/SearchSection";
import ApiContext from "../../Contexts/apiContext";
import SearchFilters from "../../components/SearchFilters";
import { dataListsProps } from "../../components/DisplayResultsSection";
const DisplayResultsSection = lazy(
  () => import("../../components/DisplayResultsSection")
);

export default function GenresPage() {
  const [dataLists, setDataLists] = useState<dataListsProps>({
    results: [],
    page: 1,
    total_pages: 0,
  });
  const [selectedGenre, setSelectedGenre] = useState<number>(28);
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const api = useContext(ApiContext);
  if (!api) return null;
  const { fetchData, API_ENDPOINTS } = api;

  useEffect(() => {
    if (searchText.trim().length > 0) {
      fetchData(API_ENDPOINTS.search, { page: page, searchText: searchText })
        .then((data) => {
          setDataLists(data);
        })
        .catch((err) => console.error(err));
    } else {
      fetchData(API_ENDPOINTS.genres, { page: page, genreId: selectedGenre })
        .then((data) => {
          setDataLists(data);
        })
        .catch((err) => console.error(err));
    }
  }, [page, searchText, selectedGenre]);

  return (
    <>
      <SearchSection searchText={searchText} setSearchText={setSearchText} />
      <SearchFilters setSelectedGenre={setSelectedGenre} setPage={setPage} />
      <Suspense fallback={<h1>Loading...</h1>}>
        <DisplayResultsSection
          page={page}
          setPage={setPage}
          dataLists={dataLists}
        />
      </Suspense>
    </>
  );
}
