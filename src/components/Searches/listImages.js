// Photos for list items. A name earlier in the list wins, so the more
// specific names (such as "mac & cheese") come before the plain ones. The one
// exception is "eggs" before "egg whites", so a partial "egg" finds eggs.
import eggwhites from "../../Images/products/eggwhites.jpg";
import maccheese from "../../Images/products/maccheese.jpg";
import milk from "../../Images/products/milk.jpg";
import eggs from "../../Images/products/eggs.jpg";
import cheese from "../../Images/products/cheese.jpg";
import chicken from "../../Images/products/chicken.jpg";
import coffee from "../../Images/products/coffee.jpg";
import water from "../../Images/products/water.jpg";
import strawberries from "../../Images/products/strawberries.jpg";
import pizza from "../../Images/products/pizza.jpg";
import icecream from "../../Images/products/icecream.jpg";
import coldcuts from "../../Images/products/coldcuts.jpg";
import bread from "../../Images/products/bread.jpg";
import bananas from "../../Images/products/bananas.jpg";
import pasta from "../../Images/products/pasta.jpg";
import yogurt from "../../Images/products/yogurt.jpg";
import rice from "../../Images/products/rice.jpg";
import orangejuice from "../../Images/products/orangejuice.jpg";
import peanutbutter from "../../Images/products/peanutbutter.jpg";
import apples from "../../Images/products/apples.jpg";
import cereal from "../../Images/products/cereal.jpg";
import navLogo from "../../Images/navLogo.png";

const images = [
  { name: "eggs", image: eggs },
  { name: "egg whites", image: eggwhites },
  { name: "mac & cheese", image: maccheese },
  { name: "milk", image: milk },
  { name: "cheese", image: cheese },
  { name: "chicken", image: chicken },
  { name: "coffee", image: coffee },
  { name: "water", image: water },
  { name: "strawberries", image: strawberries },
  { name: "pizza", image: pizza },
  { name: "ice cream", image: icecream },
  { name: "cold cuts", image: coldcuts },
  { name: "bread", image: bread },
  { name: "bananas", image: bananas },
  { name: "pasta", image: pasta },
  { name: "yogurt", image: yogurt },
  { name: "rice", image: rice },
  { name: "orange juice", image: orangejuice },
  { name: "peanut butter", image: peanutbutter },
  { name: "apples", image: apples },
  { name: "cereal", image: cereal },
];

// Finds the photo for a list item. An exact name wins, so "cheese" isn't shown
// as mac & cheese; then "whole milk" finds milk, and "straw" finds strawberries
// (at least three letters, so "a" doesn't find mac & cheese).
// Items we have no photo for get the CoinMatters logo.
export function findItemImage(itemName) {
  const name = itemName.toLowerCase();
  const match = images.find((image) => image.name === name)
    || images.find((image) => name.includes(image.name))
    || (name.length >= 3 && images.find((image) => image.name.includes(name)));
  return match ? match.image : navLogo;
}

export default images;
