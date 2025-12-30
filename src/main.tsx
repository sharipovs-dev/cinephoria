import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter} from 'react-router-dom';
import ApiContext from './Contexts/apiContext';
import { fetchData, fetchFavorites} from './api/api';
import { API_ENDPOINTS,MOVIE_GENRES } from './api/apiConfig';
import { AuthProvider } from './Contexts/AuthContext';
const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>    
      
    <AuthProvider>
    <ApiContext.Provider value={{fetchFavorites:fetchFavorites, fetchData:fetchData,MOVIE_GENRES:MOVIE_GENRES, API_ENDPOINTS: API_ENDPOINTS}}>
      <App />
    </ApiContext.Provider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
