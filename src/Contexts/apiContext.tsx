import { createContext } from "react";
import { API_ENDPOINTS_PROPS } from "../api/apiConfig";
import { Genre } from "../api/apiConfig";
import { paramsProp } from "../api/api";
import { dataListsProps } from "../components/DisplayResultsSection";
interface ApiContextType{
    fetchFavorites:any
    fetchData:(endpoints: string, params: paramsProp) => Promise<dataListsProps>;
    MOVIE_GENRES:Genre[];
    API_ENDPOINTS: API_ENDPOINTS_PROPS;
}
const ApiContext = createContext<ApiContextType | undefined>(undefined);
export default ApiContext;