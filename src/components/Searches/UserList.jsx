import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import "./Search.css";
import { cleanItem, useItemListContext } from "../../context/GetItems";

import axios from 'axios';

//images for user list
import { findItemImage } from "./listImages";
import { markSmallerSizes } from "./sizes";
const API = import.meta.env.VITE_API_URL;


export default function UserList() {
    //itemList that will store user's grocery list
    const { itemList, setItemList } = useItemListContext();
    const [inputValue, setInputValue] = useState("");
    const itemInput = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [areaMessage, setAreaMessage] = useState("Add items to your list to start searching for the best deals near you!");
    const [cheapestOptions, setCheapestOptions] = useState({});
    const [searchedZip, setSearchedZip] = useState("");
    const [stores, setStores] = useState([]);

    //Products Data Retrieved Here
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API}/products`)
        .then((response) => {
            setProducts(response.data);
        })
        .catch((e) => console.error("error fetching data", e));
    }, []);

    //Retailers/Stores data retrieved here
    useEffect(() => {
        axios.get(`${API}/retailer`)
        .then((response) => {
            setStores(response.data);
        })
        .catch((e) => console.error("error fetching data", e));
    }, []);

    //every zip code a store covers, for the hint under the zip field
    const zipcodes = [...new Set(stores.flatMap(store => store.zipcodes_array))].sort((a, b) => a - b);

    //this fxns is responsible for creating the user's grocery list (itemList). Users input grocery items into the input form and on submit an item is added to the itemlist array
    const addItem = (e) => {
        e.preventDefault();
        const newItem = cleanItem(inputValue);
        if (newItem !== '') {
            //check for duplicate list items
            if (itemList.includes(newItem)) {
                setErrorMessage("Item already added to the list");
            } else {
                //Clear the input for the next entry
                setItemList((prevItemList) => [...prevItemList, newItem]);
                setInputValue('');
                setErrorMessage('');
            }
        }
    };

    //this fxn removes an item from the list if the user no longer wants that on their grocery list
    const removeListItem = (removedItem) => {
        setItemList(itemList.filter((item) => item !== removedItem));
        setErrorMessage("");
        //the remove button is gone, so keep keyboard focus on the list
        itemInput.current.focus();
    }

    //this fxn takes in the itemList (user's grocery list) and the entered zipcode from the SearchBar component to find validStores. validStores are stores within that zipcode. Stores in the area are then evaluated to check for the cheapest store items that match the items on the user's itemList
    const findCheapestOptions = (itemList, zipcode) => {
        const updatedCheapestOptions = {};

        //this function filters stores in a specific area when a user enters their zip
        const validStores = stores.filter(store => store.zipcodes_array.includes(Number(zipcode)));

        if (validStores.length === 0) {
            setCheapestOptions({});
            setAreaMessage("Sorry, at the moment we do not have store details for that zip code yet. We are working on expanding our location coverage. Please check back soon.")
            return; //no valid stores found
        }

        if (itemList.length === 0) {
            setCheapestOptions({});
            setAreaMessage("Add items to your list to start searching for the best deals near you!");
            return;
        }

        //now that we have the stores in a specific location we will iterate over them; checking for the cheapest item(s) that closely match user's list
        validStores.forEach(store => {
            updatedCheapestOptions[store.retailer_id] = [];

            //iterate over each item in the user's list
            itemList.forEach(item => {
                const storeProducts = products.filter(product => (product.retailer_id) === (store.retailer_id) && ((product.product_name.toLowerCase()).includes(item.toLowerCase()))
                  );

                //find the cheapest product among the matching products
                if (storeProducts.length > 0) {
                    const cheapestProduct = storeProducts.reduce((min, product) =>  {
                        return product.price < min.price? product : min
                    }, storeProducts[0]);

                    //push the cheapest product into the cheapestOptions[store] array
                    updatedCheapestOptions[store.retailer_id].push({
                        name: item,
                        store: store.retailer_name,
                        item: cheapestProduct.product_name,
                        size: cheapestProduct.size,
                        price: cheapestProduct.price,
                        image: findItemImage(item),
                        link: store.website,
                    });
                } else {
                    updatedCheapestOptions[store.retailer_id].push({
                        name: item,
                        store: store.retailer_name,
                        image: findItemImage(item),
                        link: store.website,
                        unavailable: true,
                        price: 0,
                    });
                }
            });
        });
        setSearchedZip(zipcode);
        setCheapestOptions(markSmallerSizes(updatedCheapestOptions));
    };

    //this fxn takes in the cheapestOptions which is an object of the matched items, store name, and price for each item. this fxn is responsible for calculating and returning the total price for all items within one store. For example, if you have 5 items from Target. the price of all those items are calculated and printed in a human readable form. This fxn returns the store name and the total price of all groceries from that store. Ex: {store: Walmart, total: $18}
    const calculateTotalPrice = (cheapestOptions) => {

        const totalPrices = {};

        Object.keys(cheapestOptions).forEach(store => {
            const storeTotalPrice = cheapestOptions[store].reduce((sum, item) => {
                if (item.unavailable) {
                    return sum;
                }

                return sum + Number(item.price)
            }, 0);

            totalPrices[store] = storeTotalPrice.toFixed(2);
        });
        return totalPrices;
    }

    const prices = calculateTotalPrice(cheapestOptions);

    //bestDeal takes in the prices variable which is an object with store names and their total for all items, compares them, and returns the store with the least lowest total cost. Ex: {store: Walmart, total: $18}.
    const bestDeal = (prices) => {
        if (Object.keys(prices).length === 0) {
            return null;
        }

        let cheapestStore;
        let lowestTotal = Infinity;

        Object.keys(prices).forEach((store) => {
            const totalPrice = parseFloat(prices[store]);

            if (totalPrice < lowestTotal) {
                lowestTotal = totalPrice;
                cheapestStore = store;
            }
        });

        return {
            store: cheapestStore,
            totalPrice: lowestTotal,
        };
    }

    return (
        <div className="search-page">
            <section className="search-list" aria-labelledby="list-title">
                <h1 id="list-title">Your list</h1>
                <form className="search-add" onSubmit={addItem}>
                    <label htmlFor="item-search" className="visually-hidden">Add your items</label>
                    <input
                        id="item-search"
                        ref={itemInput}
                        className="field-input"
                        type="text"
                        placeholder="Add your items"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="submit" className="button-outline">Add</button>
                </form>
                {errorMessage && <p className="search-error" role="alert">{errorMessage}</p>}
                {itemList.length > 0 && (
                    <ul className="search-items" aria-label="Items on your list">
                        {itemList.map((item) => (
                            <li key={item}>
                                {item}
                                <button type="button" aria-label={`Remove ${item}`} onClick={() => removeListItem(item)}>×</button>
                            </li>
                        ))}
                    </ul>
                )}
                <SearchBar userList={itemList} onSearch={findCheapestOptions} zipcodes={zipcodes} />
            </section>
            <section className="search-options" aria-labelledby="options-title">
                <h2 id="options-title" className="visually-hidden">
                    {searchedZip ? `Your options near ${searchedZip}` : "Your options"}
                </h2>
                <div className="rail" aria-hidden="true"></div>
                <SearchResults cheapestOptions={cheapestOptions} areaMessage={areaMessage} totalPrices={prices}
                bestDeal={bestDeal(prices)}
                />
            </section>
        </div>
    )
}
