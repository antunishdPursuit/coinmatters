import { useState } from "react";
import { AuthData } from "../../context/GetUser"
import { Link } from "react-router-dom";
import UserListItem from "./UserListItem";
import "./UserMenu.css"

function UserMenu() {
  const { user } = AuthData()
  const { userList } = AuthData()
  const [ hidden, setHidden] = useState(false)
  const [sortBy, setSortBy] = useState('date'); 
  const [sortDirection, setSortDirection] = useState('desc');
  


  function showEmail() {
    if(hidden === false){
      setHidden(true)
    } else {
      setHidden(false)

    }
  }
  function capitalizeFirstLetter(str) {
    if(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
  const lists = userList.lists;

  // Sorting functions
//   const sortByDate = (a, b) => {
//   const dateA = a?.date_created ? new Date(a.date_created) : null;
//   const dateB = b?.date_created ? new Date(b.date_created) : null;

//   if (dateA && dateB) {
//     return sortDirection === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
//   } else {
//     // Handle the case where one or both items don't have date_created property
//     return 0; // Change this based on your desired behavior
//   }
// };
// const sortByName = (a, b) => {
//   const nameA = (a?.list_name || '').toLowerCase();
//   const nameB = (b?.list_name || '').toLowerCase();

//   return sortDirection === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
// };

   // Pass the sorting function to UserListItem
  //  const sortFunction = sortBy === 'date' ? sortByDate : sortByName;

  return (
    <div className="usermenuBox">
      <div className="usermenuBox1">
        <div className="profile-pic">
          <img src="https://t3.ftcdn.net/jpg/02/96/66/58/360_F_296665879_g3GUJU6Vv9KzKkcNyaQ4uXEcCzRT6hSc.jpg" alt="a woman who uses this app"></img>
        </div>
        <div className="user-name">{capitalizeFirstLetter(user.username)}</div>
        <button className="username_email_button"onClick={showEmail}>{hidden ? "Hide" : "Show"} Email</button>
        {hidden ? 
        <div className="username_email">{user.email}</div> 
        :
        <div></div>
        }
        <p>{lists.length === 0 ? <Link className="startSaving" to="/search">Start Saving, Add a List!</Link>: `Number of Lists: ${lists.length}`}</p>
        <div>
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </label>
        <button className="sort-btn" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
        </div>
      </div>
      <div className="usermenuBox2">
        {lists.length === 0 
        ? 
        <h1 className="usermenuBox2_No_Lists">No Lists have been added</h1>
        : 
        lists.map(list => {
          return (
            <UserListItem 
              key={list.list_id}
              list={list}
            />
          )
        })
        }
      </div>
    </div>
  )
}

export default UserMenu;