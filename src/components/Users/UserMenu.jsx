import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthData } from "../../context/GetUser"
import UserListItem, { plural, savedItems } from "./UserListItem";
import "./MyLists.css"

//the profile page: the user's saved lists, each under its own sign
function UserMenu() {
  const { user, userList, listsError, getUserList } = AuthData()
  const lists = userList.lists || [];
  const itemCount = lists.reduce((total, list) => total + savedItems(list).length, 0);
  const [status, setStatus] = useState("");
  const title = useRef(null);

  //after a delete the card is gone, so focus moves to the page title and the change is announced
  const listDeleted = (name) => {
    setStatus(`${name} deleted.`);
    title.current.focus();
  };

  return (
    <div className="my-lists">
      <section className="my-lists-header" aria-labelledby="my-lists-title">
        <div>
          <h1 id="my-lists-title" ref={title} tabIndex={-1}>Hi, {user.username}</h1>
          <p>
            {user.email}
            {/* the counts wait for the lists, so a failed load doesn't read as none */}
            {userList.lists && <> · <strong>{plural(lists.length, "saved list")}</strong> · <strong>{plural(itemCount, "item")}</strong></>}
          </p>
          <p className="visually-hidden" role="status">{status}</p>
        </div>
        <Link className="button-primary" to="/list/new" state={{ empty: true }}>+ New list</Link>
      </section>

      {listsError && (
        <div className="my-lists-error" role="alert">
          <p>We couldn't load your lists.</p>
          <button type="button" className="button-outline" onClick={() => getUserList(user.user_id)}>Try again</button>
        </div>
      )}

      <section className="my-lists-shelf" aria-label="Your saved lists">
        <div className="rail" aria-hidden="true"></div>
        <div className="my-lists-grid">
          {lists.map((list) => <UserListItem key={list.list_id} list={list} onDeleted={listDeleted} />)}
          <div className="list-card">
            <div className="sign">
              <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
              <h2>New list</h2>
            </div>
            <Link className="list-new" to="/list/new" state={{ empty: true }}>
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
