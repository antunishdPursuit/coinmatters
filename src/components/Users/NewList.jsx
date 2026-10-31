import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthData } from "../../context/GetUser";
import { cleanItem, useItemListContext } from "../../context/GetItems";
import { findItemImage } from "../Searches/listImages";
import { buildShelf } from "./shelf";
import { savedItems } from "./UserListItem";
import "./NewList.css";

const API = import.meta.env.VITE_API_URL;

//a saved list's items, cleaned like the Search page's list and without repeats
const savedProducts = (list) => [...new Set(savedItems(list).map(cleanItem))];

//"Dairy and eggs" -> "aisle-dairy-and-eggs"
const aisleId = (name) => `aisle-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

//makes a new list, or edits a saved one at /list/:id/edit
export default function NewList() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, userList, getUserList } = AuthData();
    const { itemList } = useItemListContext();
    //My lists opens a blank list; Search's "Save my list" brings its items along
    const startEmpty = useLocation().state?.empty;
    const savedList = id && (userList.lists || []).find((list) => String(list.list_id) === id);

    const [name, setName] = useState(savedList ? savedList.list_name : "");
    const [products, setProducts] = useState(() => savedList ? savedProducts(savedList) : id || startEmpty ? [] : [...new Set(itemList.map(cleanItem))]);
    const [note, setNote] = useState(savedList ? savedList.note || "" : "");
    const [ownItem, setOwnItem] = useState("");
    const [itemError, setItemError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [saving, setSaving] = useState(false);
    const [shelf, setShelf] = useState(null);
    const [shelfError, setShelfError] = useState(false);
    const [filled, setFilled] = useState(!id || Boolean(savedList));
    const ownInput = useRef(null);

    useEffect(() => {
        axios.get(`${API}/products`)
            .then((response) => setShelf(buildShelf(response.data)))
            .catch((e) => {
                console.error("error fetching data", e);
                setShelfError(true);
            });
    }, []);

    //on a direct visit the saved lists arrive after the page opens, so the form
    //waits for them and is filled once they do
    useEffect(() => {
        if (savedList && !filled) {
            setName(savedList.list_name);
            setProducts(savedProducts(savedList));
            setNote(savedList.note || "");
            setFilled(true);
        }
    }, [savedList, filled]);

    const toggleProduct = (item) => {
        setProducts((current) => current.includes(item) ? current.filter((product) => product !== item) : [...current, item]);
    };

    const removeProduct = (item) => {
        setProducts((current) => current.filter((product) => product !== item));
        ownInput.current.focus();
    };

    const addOwnItem = () => {
        const item = cleanItem(ownItem);
        if (!item) {
            return;
        }
        if (products.includes(item)) {
            setItemError(`${item} is already on your list.`);
            return;
        }
        setProducts([...products, item]);
        setOwnItem("");
        setItemError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (saving) {
            return;
        }
        setSaving(true);
        const list = { list_name: name.trim(), products, note: note.trim() };
        const request = id
            ? axios.put(`${API}/lists/user/${user.user_id}/${id}`, list, { withCredentials: true })
            : axios.post(`${API}/lists/${user.user_id}`, list, { withCredentials: true });
        //My lists shows the saved list as soon as it opens
        request
            .then(() => getUserList(user.user_id))
            .then(() => navigate("/profile"))
            .catch((error) => {
                setSaving(false);
                setSaveError(error.response?.data?.error || "We couldn't save this list. Please try again.");
            });
    };

    if (id && userList.lists && !savedList) {
        return (
            <div className="new-list-missing">
                <p>We couldn't find that list.</p>
                <Link className="button-outline" to="/profile">Back to My lists</Link>
            </div>
        );
    }

    return (
        <div className="new-list-page">
            <div className="rail" aria-hidden="true"></div>
            <div className="new-list-grid">
                <section className="new-list-form" aria-labelledby="new-list-title">
                    <div className="sign">
                        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
                        <h1 id="new-list-title">{id ? "Edit list" : "New list"}</h1>
                    </div>
                    <form onSubmit={handleSubmit} aria-busy={!filled}>
                        <fieldset disabled={!filled}>
                            <div className="new-list-field">
                                <label htmlFor="list_name">Name</label>
                                <input id="list_name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of list" maxLength={255} required />
                            </div>
                            <div className="new-list-field">
                                <h2 id="new-list-items">Products · {products.length}</h2>
                                {products.length === 0
                                    ? <p className="new-list-hint">Pick from the shelf or type your own.</p>
                                    : (
                                        <ul className="new-list-items" aria-labelledby="new-list-items">
                                            {products.map((item) => (
                                                <li key={item}>
                                                    <img src={findItemImage(item)} alt="" />
                                                    <span>{item}</span>
                                                    <button type="button" aria-label={`Remove ${item}`} onClick={() => removeProduct(item)}>×</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                            <div className="new-list-field">
                                <label htmlFor="own-item" className="new-list-own-label">Not on the shelf? Type it</label>
                                <div className="new-list-own">
                                    <input
                                        id="own-item"
                                        ref={ownInput}
                                        className="field-input"
                                        value={ownItem}
                                        onChange={(e) => setOwnItem(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addOwnItem();
                                            }
                                        }}
                                        placeholder="Add a product"
                                        maxLength={255}
                                    />
                                    <button type="button" className="button-outline" onClick={addOwnItem}>Add</button>
                                </div>
                                {itemError && <p className="new-list-error" role="alert">{itemError}</p>}
                            </div>
                            <div className="new-list-field">
                                <label htmlFor="note">Note</label>
                                <textarea id="note" className="field-input" rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any details you want to add?" maxLength={255} />
                            </div>
                            {saveError && <p className="new-list-error" role="alert">{saveError}</p>}
                            <div className="new-list-actions">
                                <button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save list"}</button>
                                <Link className="button-outline" to={id ? "/profile" : "/search"}>Nevermind!</Link>
                            </div>
                        </fieldset>
                    </form>
                </section>

                <section className="new-list-shelf" aria-labelledby="shelf-title">
                    <div className="sign">
                        <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
                        <h2 id="shelf-title">Pick from the shelf</h2>
                    </div>
                    {shelfError && <p className="shelf-message">We couldn't load the shelf. You can still type your own items.</p>}
                    {!shelf && !shelfError && <p className="shelf-message">Loading the shelf…</p>}
                    <div className="shelf-aisles">
                        {(shelf || []).map((aisle) => (
                            <section key={aisle.name} className="shelf-aisle" aria-labelledby={aisleId(aisle.name)}>
                                <h3 id={aisleId(aisle.name)}>{aisle.name}</h3>
                                <ul>
                                    {aisle.items.map((item) => {
                                        const added = products.includes(item);
                                        return (
                                            <li key={item}>
                                                <button type="button" className={added ? "shelf-item added" : "shelf-item"} aria-pressed={added} onClick={() => toggleProduct(item)}>
                                                    <img src={findItemImage(item)} alt="" />
                                                    <span className="shelf-item-name">{item}</span>
                                                    <span className="shelf-item-tag" aria-hidden="true">{added ? "✓ Added" : "+ Add"}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
