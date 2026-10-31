import { useEffect,useState } from "react";
import "./UserListItem.css"
import { findItemImage } from "../Searches/listImages";

function UserListItem({ list  }) {
  const [matchedImages, setMatchedImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };


  function removeEmptyStrings(arr) {
    return arr.filter(item => item.trim() !== '');
  }
  function formattedDate(str) {
    const date = new Date(str);
    return date.toLocaleDateString();
  }

  //useEffect is used to updated matchedImages when itemList changes
  useEffect(() => {
    const updatedLists = removeEmptyStrings(list.products);
    const updatedMatchedImages = updatedLists.map((itemName) => {
        return { name: itemName, image: findItemImage(itemName) };
    });

    setMatchedImages(updatedMatchedImages);
}, [list, list.products]);

//Passing the sort function to sort the lists
//this fxn removes an item from the list if the user no longer wants that on their grocery list
// const removeListItem = (removedItem) => {
//   const removeList = updatedList.filter((item)=> item.toLowerCase() !== removedItem.toLowerCase());
//   setMenuList(removeList);

//   setMatchedImages((prevMatchedImages) =>
//   prevMatchedImages.filter((image) => image.name.toLowerCase() !== removedItem.toLowerCase())
//   );
// }
// const editListItem = async () => {
  
// }

// const deleteListItem = () => {

// }


  return (
    <div key={list.list_id} className={`userListItem_box ${isExpanded ? 'expanded' : 'truncated'}`}>
      <h4 className="userListItem_box_name" onClick={toggleExpansion}>{list.list_name}</h4>
      <div className="date-created">Date Created: {formattedDate(list.date_created)}</div>
      <div className="userList-container">
        <div className="saved-items">
          <ul>
              {matchedImages.map((item, i) => (
                <div key={i} className="list-item">
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "50px", height: "50px" }}
                    />
                    <li>{item.name}</li>
                </div>
              ))}
          </ul>
        </div>
        <div className="user-note">
            <span>Note: </span>{list.note}
        </div>
        <div className="list-buttons">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default UserListItem;