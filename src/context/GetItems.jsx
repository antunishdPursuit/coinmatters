import { createContext, useContext, useState } from "react";

const ItemListContext = createContext();

//items in the shared list are kept trimmed and lowercase
export const cleanItem = (name) => name.trim().toLowerCase();

export const useItemListContext = () => {
    return useContext(ItemListContext);
};

export const ItemListProvider = ({ children }) => {
    const [itemList, setItemList] = useState([]);

    const contextValue = {
        itemList,
        setItemList,
    }; 

    return (
        <ItemListContext.Provider value={contextValue}>
            {children}
        </ItemListContext.Provider>
    );
};