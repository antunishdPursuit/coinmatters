
import UserList from "../components/Searches/UserList";
import logo from "../Images/pig-background.png"
// import "../CSS/Search.css";


export default function Search() {
    return (
        <div className="page-container">
            <div>
                <UserList />
            </div>
            <div className="background-img-container">
                <img src={logo} alt="pig logo" />
            </div>
            <div className="message">
              <ul>
                <li>What's on your list?</li>
                <li>Start your search above</li>
              </ul>
          </div>
        </div>
    );
};