import { createContext, useContext, useState } from "react";

const ItemListContext = createContext();

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