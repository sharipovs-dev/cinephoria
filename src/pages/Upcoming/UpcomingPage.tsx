import { lazy, Suspense, useContext, useEffect, useState } from "react";
import ApiContext from "../../Contexts/apiContext";
import SearchSection from "../../components/SearchSection";
import { dataListsProps } from "../../components/DisplayResultsSection";
const DisplayResultsSection = lazy(() =>
  import("../../components/DisplayResultsSection")
);

export default function UpcomingPage() {
  const [dataLists, setDataLists] = useState<dataListsProps>({
    results: [],
    page: 1,
    total_pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const api = useContext(ApiContext);
  if (!api) return null;
  const { fetchData, API_ENDPOINTS }  = api;

  useEffect(() => {
    if (searchText.trim().length > 0) {
      fetchData(API_ENDPOINTS.search, { page: page, searchText: searchText })
        .then((data) => {
          setDataLists(data);
        })
        .catch((err) => console.error(err));
    } else {
      fetchData(API_ENDPOINTS.upcoming, { page: page })
        .then((data) => {
          setDataLists(data);
        })
        .catch((err) => console.error(err));
    }
  }, [page, searchText]);

  return (
    <>
      <SearchSection searchText={searchText} setSearchText={setSearchText} />
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
