// DEPENDENCIES
import { Route, Routes, Navigate } from "react-router-dom";
// PAGES

import NotFound from "./pages/NotFound";
import Account from "./pages/Account";

// COMPONENTS
import NavBar from "./layout/NavBar";
import About from "./pages/About"
import Home from "./pages/Home";
import NewList from "./components/Users/NewList";
import UserList from "./components/Searches/UserList";
import UserMenu from "./components/Users/UserMenu"

// Auth
import { AuthData } from "./context/GetUser"
import { ItemListProvider } from "./context/GetItems";



function App() {
  const { loggedIn, authChecked } = AuthData();

  //both kinds of guarded page wait for the first login check, so a reload
  //never sends someone the wrong way before the check answers
  const loggedInOnly = (page) => {
    if (!authChecked) {
      return null;
    }
    return loggedIn ? page : <Navigate to="/login" replace />;
  };

  const loggedOutOnly = (page) => {
    if (!authChecked) {
      return null;
    }
    return loggedIn ? <Navigate to="/" replace /> : page;
  };

  return (
    <div className="page">
      <ItemListProvider>
          <NavBar></NavBar>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<UserList />} />
              <Route path="/register" element={loggedOutOnly(<Account start="register" />)} />
              <Route path="/login" element={loggedOutOnly(<Account start="login" />)} />
              <Route path="/profile" element={loggedInOnly(<UserMenu />)} />
              <Route path="/list/new" element={loggedInOnly(<NewList />)} />
              <Route path="/list/:id/edit" element={loggedInOnly(<NewList />)} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
      </ItemListProvider>
    </div>
  );
}

export default App;
