import {API_BASE_URL,API_TOKEN,API_ENDPOINTS,MOVIE_GENRES} from "./apiConfig"
export interface paramsProp{
    page?:number;
    id?:number;
    searchText?:string;
    genreId?:number;

}
export async function fetchData(endpoints:string, params:paramsProp) {
    let END_URL:string = "";
    const page = params.page ?? 1; 
    if(API_ENDPOINTS.search === endpoints && params.searchText){
        END_URL = `${API_BASE_URL}${API_ENDPOINTS.search}?query=${encodeURIComponent(params.searchText)}&include_adult=true&page=${page}`
    }else if(API_ENDPOINTS.genres === endpoints && params.genreId){
        END_URL = `${API_BASE_URL}${API_ENDPOINTS.genres}?with_genres=${params.genreId}&page=${page}`
    }
    else if(API_ENDPOINTS.details === endpoints && params.id){
        END_URL = `${API_BASE_URL}${API_ENDPOINTS.details}/${params.id}`
    }
    else{
         END_URL = `${API_BASE_URL}${endpoints}?include_adult=true&page=${page}`
    }
    try {
        const response = await fetch(
            END_URL,
            {
                method:"GET",
                headers:{
                    accept:"application/json",
                    Authorization:`Bearer ${API_TOKEN}`
                }
            }
        );
        const data = await response.json();
        console.log(data)  
        return data;  
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchFavorites(favoriteMovies: number[]) {
  if (favoriteMovies.length === 0) return [];

  try {
    const movies = await Promise.all(
      favoriteMovies.map(async (id) => {
        const res = await fetch(`${API_BASE_URL}/movie/${id}`,
                        {
                method:"GET",
                headers:{
                    accept:"application/json",
                    Authorization:`Bearer ${API_TOKEN}`
                }
            }
        );
        if (!res.ok) throw new Error("Failed to fetch movie " + id);
        return res.json();
      })
    );
    console.log(movies)
    return movies;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}