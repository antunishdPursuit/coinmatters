// DEPENDENCIES
import { Route, Routes, Navigate } from "react-router-dom";
// PAGES

import NotFound from "./pages/NotFound";

// COMPONENTS
import NavBar from "./layout/NavBar";
import About from "./pages/About"
import Home from "./pages/Home";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import NewList from "./components/Users/NewList";
import UserList from "./components/Searches/UserList";
import UserMenu from "./components/Users/UserMenu"

// Auth
import { AuthData } from "./context/GetUser"
import { ItemListProvider } from "./context/GetItems";



function App() {
  const { loggedIn } = AuthData();
  
  return (
    <div className="app">
      <ItemListProvider>
          <NavBar></NavBar>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<UserList />} />
              <Route path="/register" 
              element={loggedIn 
              ?
              <Navigate to="/"/>
              :
              <Register/>} />

              <Route path="/login" 
              element={loggedIn 
              ?
              <Navigate to="/"/> 
              :
              <LogIn />} />
              
              <Route path="/profile" 
              element={loggedIn 
              ?
              <UserMenu />
              :
              <Navigate to="/"/> }/>

              <Route path="/list/new" 
              element={loggedIn
              ?
              <NewList />
              :
              <Navigate to="/login" /> } />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
      </ItemListProvider>
    </div>
  );
}

export default App;
