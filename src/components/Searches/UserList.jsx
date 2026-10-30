import  { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import "../../CSS/UserList.css";
import cartIcon from "../../Images/cart-light-icon.png";
import cartIconHover from "../../Images/cart-solid-icon.png";
import circleIcon from "../../Images/circle-minus-light-icon.png";
import circleIconHover from "../../Images/circle-minus-solid-icon.png";
import itemUnavailable from "../../Images/unavailable-item.png";
import { AuthData } from "../../context/GetUser";
import { useItemListContext } from "../../context/GetItems";

import axios from 'axios';

//images for user list
import images from "./listImages";
const API = process.env.REACT_APP_API_URL;


export default function UserList() {
    //itemList that will store user's grocery list 
    const { itemList, setItemList } = useItemListContext();
    const [inputValue, setInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [areaMessage, setAreaMessage] = useState("Add items to your list to start searching for the best deals near you!");
    const [cheapestOptions, setCheapestOptions] = useState({});
    const [stores, setStores] = useState([]);
    const [matchedImages, setMatchedImages] = useState([]);

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
    


    //this is a hover state for list icons such as the shopping cart and minus button  for a user-friendly interface 
    const [isHovered, setIsHovered] = useState(false);
    const [isMinusHovered, setIsMinusHovered] = useState(Array(itemList.length).fill(false));

    //this fxns is responsible for creating the user's grocery list (itemList). Users input grocery items into the input form and on submit an item is added to the itemlist array
    // Get user data
    const { loggedIn } = AuthData();
    const { user } = AuthData();

    //add pictures to user's itemList
    const defaultProductImage = "https://png.pngtree.com/thumb_back/fh260/background/20230721/pngtree-assorted-grocery-items-arranged-in-a-white-3d-rendering-of-a-image_3722980.jpg";

    //useEffect is used to updated matchedImages when itemList changes
    useEffect(() => {
        const updatedMatchedImages = itemList.map((itemName) => {
            const matchingImage = images.find((image) => itemName.includes(image.name));
            return matchingImage || { name: itemName, image: defaultProductImage };
        });

        setMatchedImages(updatedMatchedImages);
    }, [itemList]);

    const addItem = () => {
        if (inputValue.trim() !== '') {
            //check for duplicate list items
            if (itemList.includes(inputValue)) {
                setErrorMessage("Item already added to the list");
            } else {
                //Clear the input for the next entry
                setItemList((prevItemList) => [...prevItemList, inputValue.toLowerCase()]);
                console.log(itemList);
                setInputValue('');
                setErrorMessage('');
                
            }
        };
    };


    //this fxn removes an item from the list if the user no longer wants that on their grocery list
    const removeListItem = (removedItem) => {
        const updatedList = itemList.filter((item)=> item.toLowerCase() !== removedItem.toLowerCase());
        setItemList(updatedList);

        setMatchedImages((prevMatchedImages) =>
        prevMatchedImages.filter((image) => image.name.toLowerCase() !== removedItem.toLowerCase())
        );
    }

    //this fxn takes in the itemList (user's grocery list) and the entered zipcode from the SearchBar component to find validStores. validStores are stores within that zipcode. Stores in the area are then evaluated to check for the cheapest store items that match the items on the user's itemList 
    const findCheapestOptions = (itemList, zipcode) => {
        const updatedCheapestOptions = { ...cheapestOptions };

        //this function filters stores in a specific area when a user enters their zip
        zipcode = Number(zipcode)
        const validStores = stores.filter(store => store.zipcodes_array.includes(zipcode)).map(store => ({...store,zipcodes_array: [...store.zipcodes_array],
        }));

        console.log(validStores);
        
        if (validStores.length === 0) {
            setCheapestOptions({});
            setAreaMessage("Sorry, at the moment we do not have store details for that zip code yet. We are working on expanding our location coverage. Please check back soon.")
            return; //no valid stores found
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
                        store: store.retailer_name,
                        item: cheapestProduct.product_name,
                        price: cheapestProduct.price,
                        image: cheapestProduct.thumbnail,
                        link: store.website,
                    });
                } else {
                    updatedCheapestOptions[store.retailer_id].push({ 
                        store: store.retailer_name,
                        item: `sorry, our list for ${store} doesn't have ${item}.`,
                        image: itemUnavailable,
                        className: 'unavailable-item',
                        price: 0,
                    });
                }
                console.log(updatedCheapestOptions)
            });
        });
        setCheapestOptions(updatedCheapestOptions);
    };

    //this fxn takes in the cheapestOptions which is an object of the matched items, store name, and price for each item. this fxn is responsible for calculating and returning the total price for all items within one store. For example, if you have 5 items from Target. the price of all those items are calculated and printed in a human readable form. This fxn returns the store name and the total price of all groceries from that store. Ex: {store: Walmart, total: $18}
    const calculateTotalPrice = (cheapestOptions) => {

        const totalPrices = {};

        Object.keys(cheapestOptions).forEach(store => {
            const storeItems = cheapestOptions[store];

            const storeTotalPrice = storeItems.reduce((sum, item) => {
                if(item.className ==='unavailable-item'){
                    return sum;
                }

                return sum + Number(item.price)
            }, 0);

            totalPrices[store] = storeTotalPrice.toFixed(2);
        });
        return totalPrices;
    }

    //Prices is a global variable. I created it inside the main scope. I wanted to use the return values from the calculateTotalPrice fxn, thus, I stored it in the prices variable so that I can access it globally - quick tip - another way to do this is to make a use state that will update the totalPrices object. 
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

 //useEffect is used to update the states and information inside the objects cheapestOptions and prices.
    useEffect(() => {
        calculateTotalPrice(cheapestOptions);
        bestDeal(prices);
    }, [cheapestOptions, prices]);

    const capitalizeFirstLetter = (str) => {
        if(str){
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
      }
    return (
        <div className="search-page-container">
            <div className="user-list-container">
                <div className="username">
                    {loggedIn
                    ? 
                    <h3>
                        <Link className="UserMenuLink"to={`/${user.username}`}> {capitalizeFirstLetter(user.username)}'s List </Link> 
                    </h3>

                    : 
                    <h3>Your List</h3>}
                </div>
                <div className="item-search">
                    <input
                        id="item-search"
                        type="text"
                        placeholder="Add your items"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                        // style={{ textAlign: "center" }}
                    />
                    <button style={{ all: 'unset' }} className="list-icon" onClick={addItem} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <img
                            src={isHovered ? cartIconHover : cartIcon }
                            alt="cart icon"
                        />
                    </button>
                </div>
                <div className="error-message">
                    {errorMessage && (
                        <div>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
                <div className="user-box">
                    <div className="user-list">
                        <ul>
                            {matchedImages.map((item, i) => (
                                <div key={i} className="item">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                    <li>{item.name}</li>
                                    <button 
                                        className="list-icon" 
                                        key ={i}
                                        style={{all: "unset"}} 
                                        onMouseEnter={() => {
                                            const newHoverStates = [...isMinusHovered];
                                            newHoverStates[i] = true;
                                            setIsMinusHovered(newHoverStates);
                                        }}
                                        onMouseLeave={() => {
                                            const newHoverStates = [...isMinusHovered];
                                            newHoverStates[i] = false;
                                            setIsMinusHovered(newHoverStates);
                                        }}
                                        onClick={() => removeListItem(item.name)}>
                                        <img 
                                            src={isMinusHovered[i] ? circleIconHover : circleIcon}
                                            alt="minus icon"
                                        />
                                    </button>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="zip-search">
                        <span>zip code</span>
                        <SearchBar userList={itemList} onSearch={findCheapestOptions} />
                    </div>
                </div>
            </div>
            <div className="deals-container">
                <h3>Your Options</h3>
                <SearchResults cheapestOptions={cheapestOptions} areaMessage={areaMessage} totalPrices = {calculateTotalPrice(cheapestOptions)} 
                bestDeal = {bestDeal(prices)}
                /> 
            </div>
        </div>
        
    )
}