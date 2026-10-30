import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthData } from "../../context/GetUser";
import { useItemListContext } from "../../context/GetItems";
import "../../CSS/New-List.css";

const API = process.env.REACT_APP_API_URL;

export default function NewList() {
    const navigate = useNavigate();
    const { user } = AuthData();
    const { itemList } = useItemListContext();
    const [list, setList] = useState({
        user_id: user.user_id,
        list_name: "",
        products: [...itemList],
        note: "",
        date_created: new Date().toISOString()
    });

    const addList = (list) => {
        const userId = user.user_id;
        console.log(user)
        //make a POST request to the "/list" route, where all user lists will be stored.
        axios
        //The user_id must be send in the URL as a parameter in order for the /lists route to successful identify and input the user_id. Thus, instead of /lists it is /lists/user.user_id or lists/${userId}. in the backend this is reflected by using "/:user_id" which accepts the user id as a parameter. 
         .post(`${API}/lists/${userId}`, list)
         .then((response) => {
            console.log("List added to the lists route:", response.data);
            setList(response.config.adapter.data);
            navigate(`/${user.username}`);
        })
        .catch((e) => {
            console.error("Error adding list to /lists route", e);
        });   
    };

    const  handleTextChange = (e) => {
        setList({...list, [e.target.id]: e.target.value});
        console.log(e.target.value);
    };

    const handleProductChange = (index, value) => {
        const updatedProducts = [...list.products];
        updatedProducts[index] = value;
        setList({ ...list, products: updatedProducts });
    };

    const handleAddProduct = (index, value) => {
        setList({ ...list, products: [...list.products, ""] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        //remove empty item
        const filteredProducts = list.products.filter(item => item.trim() !== "");
        setList({ ...list, products: filteredProducts });
        console.log("this is the list object", list);
        addList(list);
    };


    return (
        <div className="page-wrapper">
            <div className="new-list">
                <form onSubmit={handleSubmit}>
                    <div className="list-title">
                        <label htmlFor="list_name">Name:</label>
                        <input
                            id="list_name"
                            value={list.name}
                            type="text"
                            onChange={handleTextChange}
                            placeholder="Name of list"
                            required
                        />
                    </div>
                    <div className="list-products">
                        <label htmlFor="products">Products:</label>
                        <div className="list-products-box">
                            {list.products.map((product, index) => (
                                <div key={index}>
                                    <input
                                        value={product}
                                        type="text"
                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                        placeholder={`Product ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="product-btn">
                        <button className="list-button" type="button" onClick={handleAddProduct}>
                            Add Product
                        </button>
                    </div>
                        
                    <div className="note-section">
                        <label htmlFor="note">Note:</label>
                        <div className="note">
                            <textarea 
                            id="note"
                            value={list.note}
                            type="text"
                            placeholder="Any details you want to add?"
                            onChange={handleTextChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="space-out-btns">
                        <input className="list-button" type="submit" />
                        <button className="list-button">
                            <Link to="/search">Nevermind!</Link>
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}