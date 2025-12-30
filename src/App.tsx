import { Routes, Route} from "react-router-dom";
import "./App.css";
import MainLayout from "./pages/MainLayout/MainLayout"; 
import HomePage from "./pages/Home/HomePage";
import TopRatedPage from "./pages/TopRated/TopRatedPage";
import GenresPage from "./pages/Genres/GenresPage";
import UpcomingPage from "./pages/Upcoming/UpcomingPage";
import DetailsPage from "./pages/Details/DetailsPage"
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/SignUp/Signup";


function App(){
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route 
            path="/"
            element={
              <HomePage/>
            }
          ></Route>
          <Route

            path="/top-rated"
            element={
              <TopRatedPage/>
            }
          ></Route>
          <Route
            path="/upcoming"
            element={
              <UpcomingPage/>
            }
          ></Route>
          <Route
            path="/genres"
            element={
              <GenresPage/>
            }
          ></Route>
          <Route path="/details/:id" element={<DetailsPage/>}>

          </Route>
          <Route path="/favorites" element={<FavoritesPage/>}></Route>
        </Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
