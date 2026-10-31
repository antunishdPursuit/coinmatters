import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
this function is the SearchBar fxn that is responsible for taking the userList, which is the itemList passed down from the UserList component, and onSearch, which is the findCheapestOptions fxn, to store the zipcode and send the information back to the  findCheapestOptions fxn.
*/

// "10029, 10456 and 10462"
const listZipcodes = (zipcodes) => zipcodes.length === 1
    ? String(zipcodes[0])
    : `${zipcodes.slice(0, -1).join(", ")} and ${zipcodes[zipcodes.length - 1]}`;

export default function SearchBar({ userList, onSearch, zipcodes }) {
    const [zipcode, setZipcode] = useState("");
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(userList, zipcode.trim());
    }

    const newList = () => {
      navigate("/list/new")
    }

    return (
        <form className="search-zip" onSubmit={handleSearch}>
            <label htmlFor="zip">Zip code</label>
            <input
                id="zip"
                className="field-input"
                type="text"
                inputMode="numeric"
                placeholder="Enter your zip code"
                aria-describedby={zipcodes.length > 0 ? "zip-hint" : undefined}
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
            />
            {zipcodes.length > 0 && <span id="zip-hint" className="search-hint">We cover {listZipcodes(zipcodes)}.</span>}
            <button type="submit" className="button-primary">Find my deals</button>
            <button type="button" className="button-outline" onClick={newList}>Save my list</button>
        </form>
    );
};
