// The shelf on the New list page. Each item is a plain name that the Search
// page can match, grouped the way a store lays them out. An item only shows
// when at least one store sells a product with that name in it.
const aisles = [
  { name: "Dairy and eggs", items: ["milk", "eggs", "egg whites", "cheese", "yogurt"] },
  { name: "Meat and deli", items: ["chicken", "cold cuts"] },
  { name: "Produce", items: ["bananas", "apples", "strawberries"] },
  { name: "Drinks", items: ["water", "coffee", "orange juice"] },
  { name: "Frozen", items: ["pizza", "ice cream"] },
  { name: "Pantry", items: ["bread", "pasta", "rice", "cereal", "peanut butter", "mac & cheese"] },
];

export function buildShelf(products) {
  const names = products.map((product) => product.product_name.toLowerCase());
  return aisles
    .map((aisle) => ({ ...aisle, items: aisle.items.filter((item) => names.some((name) => name.includes(item))) }))
    .filter((aisle) => aisle.items.length > 0);
}
