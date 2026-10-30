// DEPENDENCIES
import { BrowserRouter as Router } from "react-router-dom";

// Auth
import {AuthWrapper} from "./context/GetUser";

// Layout
import Footer from './layout/Footer';
import "./App.css"

function App() {

  return (
    <div className="app">
      <Router>
        <AuthWrapper/>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
