import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthData } from "../../context/GetUser"
import { cleanItem, useItemListContext } from "../../context/GetItems";
import { findItemImage } from "../Searches/listImages";

const API = import.meta.env.VITE_API_URL;

export const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

//a list saved without products has none; blank entries are skipped
export const savedItems = (list) => (list.products || []).filter((item) => item.trim());

function formattedDate(str) {
  return new Date(str).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

//one saved list: its items, date and note, with buttons to compare its prices, edit it or delete it
function UserListItem({ list, onDeleted }) {
  const { user, getUserList } = AuthData()
  const { setItemList } = useItemListContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const items = savedItems(list);
  const titleId = `list-${list.list_id}`;

  //the Search page starts with this list's items
  const comparePrices = () => {
    setItemList([...new Set(items.map(cleanItem))]);
    navigate("/search");
  };

  const deleteList = () => {
    if (!window.confirm(`Delete the list "${list.list_name}"? This can't be undone.`)) {
      return;
    }
    setError("");
    axios
      .delete(`${API}/lists/user/${user.user_id}/${list.list_id}`, { withCredentials: true })
      .then(() => getUserList(user.user_id))
      .then(() => onDeleted(list.list_name))
      .catch(() => setError("We couldn't delete this list. Please try again."));
  };

  return (
    <article className="list-card" aria-labelledby={titleId}>
      <div className="sign">
        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
        <h2 id={titleId}>{list.list_name}</h2>
      </div>
      <div className="list-body">
        <ul className="list-tiles" aria-label={`${items.length} items`}>
          {items.map((item, i) => (
            <li key={i}>
              <img src={findItemImage(item)} alt="" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="list-meta">{plural(items.length, "item")} · Created {formattedDate(list.date_created)}</p>
        {list.note && <p className="list-note"><strong>Note:</strong> {list.note}</p>}
        <button type="button" className="button-primary" onClick={comparePrices} aria-label={`Compare prices for ${list.list_name}`}>Compare prices</button>
        <div className="list-actions">
          <Link className="button-outline" to={`/list/${list.list_id}/edit`} aria-label={`Edit ${list.list_name}`}>Edit</Link>
          <button type="button" className="button-danger" onClick={deleteList} aria-label={`Delete ${list.list_name}`}>Delete</button>
        </div>
        {error && <p className="list-error" role="alert">{error}</p>}
      </div>
    </article>
  )
}

export default UserListItem;
