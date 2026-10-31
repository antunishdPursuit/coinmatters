import { useNavigate } from "react-router-dom";
import { useItemListContext } from "../../context/GetItems";
import { findItemImage } from "../Searches/listImages";

export const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

//a list saved without products has none; blank entries are skipped
export const savedItems = (list) => (list.products || []).filter((item) => item.trim());

function formattedDate(str) {
  return new Date(str).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

//one saved list: its items, date and note, with a button to compare its prices
function UserListItem({ list }) {
  const { setItemList } = useItemListContext();
  const navigate = useNavigate();
  const items = savedItems(list);
  const titleId = `list-${list.list_id}`;

  //the Search page starts with this list's items
  const comparePrices = () => {
    setItemList([...new Set(items.map((item) => item.trim().toLowerCase()))]);
    navigate("/search");
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
      </div>
    </article>
  )
}

export default UserListItem;
