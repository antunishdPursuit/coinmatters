import { Link } from "react-router-dom";
import { AuthData } from "../../context/GetUser"
import UserListItem, { plural, savedItems } from "./UserListItem";
import "./MyLists.css"

//the profile page: the user's saved lists, each under its own sign
function UserMenu() {
  const { user, userList } = AuthData()
  const lists = userList.lists || [];
  const itemCount = lists.reduce((total, list) => total + savedItems(list).length, 0);

  return (
    <div className="my-lists">
      <section className="my-lists-header" aria-labelledby="my-lists-title">
        <div>
          <h1 id="my-lists-title">Hi, {user.username}</h1>
          <p>
            {user.email} · <strong>{plural(lists.length, "saved list")}</strong> · <strong>{plural(itemCount, "item")}</strong>
          </p>
        </div>
        <Link className="button-primary" to="/list/new">+ New list</Link>
      </section>

      <section className="my-lists-shelf" aria-label="Your saved lists">
        <div className="rail" aria-hidden="true"></div>
        <div className="my-lists-grid">
          {lists.map((list) => <UserListItem key={list.list_id} list={list} />)}
          <div className="list-card">
            <div className="sign">
              <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
              <h2>New list</h2>
            </div>
            <Link className="list-new" to="/list/new">
              <span className="list-new-plus" aria-hidden="true">+</span>
              <span className="list-new-title">Start a new list</span>
              <span>Pick items from the shelf or type your own.</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserMenu;
