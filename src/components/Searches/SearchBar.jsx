import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Search.css";




// const API = process.env.REACT_APP_API_URL;

/*
this function is the SearchBar fxn that is responsible for taking the userList, which is the itemList passed down from the UserList component, and onSearch, which is the findCheapestOptions fxn, to store the zipcode and send the information back to the  findCheapestOptions fxn. 
*/

export default function SearchBar({ userList, onSearch }) {
    const [zipcode, setZipcode] = useState("");
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();
        setZipcode(e.target.value);
        onSearch(userList, zipcode);
    }
   
    const newList = () => {
      navigate("/list/new")
    }
    
    return (
        <div className="search-bar-container">
          <div className="search-bar">
            <input className="search-bar-bar"
                type="text"
                placeholder="Enter your zip code"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
            />
            <div className="buttons">
                    <button className="btn-1" onClick={newList}>Save my list</button>
                    <button className="btn-2" onClick={handleSearch}>Find my deals</button>
            </div>
          </div>
        </div>
    );
};