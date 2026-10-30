import searchResults from "../../CSS/SearchResults.module.css";
import logo from "../../Images/navLogo.png"

//this fxn returns the results of the user's search
export default function SearchResults({ cheapestOptions, areaMessage, totalPrices, bestDeal}) {
  const storeLogos = {
    "CTown": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAUyB296Y__767dlKXEnaFSXktjvg31I9UHw&usqp=CAU",
    "Target": 'https://corporate.target.com/getmedia/890f3192-ce35-496a-a3cf-15fc0a8105d0/Target_Bullseye-Logo_Red.jpg',
    "Walmart": 'https://s3.amazonaws.com/www-inside-design/uploads/2018/04/walmart-square.jpg'
  }
  console.log(cheapestOptions);
  return (
    <div className={searchResults["result-page"]}>
      <div className={searchResults["results-container"]}>
        {Object.keys(cheapestOptions).length > 0 ? (
          Object.keys(cheapestOptions).map((store, index) => (
            <div key={index} className={searchResults["store-container"]}>
              <div className={searchResults["store-logo"]}>
                {storeLogos.hasOwnProperty(cheapestOptions[store][0].store) ? (
                  <img
                    src={storeLogos[cheapestOptions[store][0].store]}
                    alt={`${store} Logo`}
                  />
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpiYlKcWYd8qjxGaRCMLuzHsHAiasM53ETMfLUwkQITO0zvB0wdbsZ6qyrIDXU7eDlB0c&usqp=CAU"
                    alt={`${store} Default Logo`}
                  />
                )}
                <div className={searchResults["logo-text"]}>
                  {cheapestOptions[store][0].store}
                </div>
              </div>
              <div className={searchResults["store-results"]}>
                {cheapestOptions[store].map((option, optionIndex) => (
                  <div key={optionIndex} className={searchResults["item-container"]}>
                    <img
                      src={option.image} 
                      alt="Product Thumbnail"
                    />
                    <div>{option.item}</div>
                    <div className={searchResults["item-price"]}>${option.price}</div>
                  </div>
                ))}
              </div>
              <div className={searchResults["total"]}>
                <p style={{"font-size": "12px"}}>Total cost</p>
                <p>
                  ${totalPrices[store]}{bestDeal.store === store ? <span className={searchResults["best-deal-label"]}>best deal</span> : null}
                </p>
              </div>
              <div className={searchResults["store-link"]}>
                {/* target = "_blank" is a html command that ensures the link opens up in a new tab/window & rel="noopener noreferrer" attribute sets the security standards for opening links in a new tab/window*/}
                {/* noopener: When a new tab or window is opened using target="_blank", the new page gains access to the window.opener object of the original page. This could potentially be a security risk. Adding noopener prevents the new page from having access to window.opener. the noreferrer: attribute ensures that no referrer info is passed when the user navigates from the current page to the provided link */}
                <a href={cheapestOptions[store][0].link} target="_blank" rel="noopener noreferrer">
                  View on {cheapestOptions[store][0].store}
                  {console.log(cheapestOptions[store][0].store)}
                </a>
              </div>
            </div>
          ))
        ) : (
        <div className={searchResults["empty-results"]}>
          <img 
            src={logo} 
            alt="logo" />
          <p>{areaMessage}</p>
        </div>
        )}
      </div>
    </div>
  );          
}

