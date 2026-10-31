import logo from "../../Images/navLogo.png"

//this fxn returns the results of the user's search
export default function SearchResults({ cheapestOptions, areaMessage, totalPrices, bestDeal}) {
  const storeIds = Object.keys(cheapestOptions);

  if (storeIds.length === 0) {
    return (
      <div className="search-empty">
        <img src={logo} alt="" />
        <p>{areaMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="store-grid">
        {storeIds.map((store) => {
          const storeName = cheapestOptions[store][0].store;
          const isBestDeal = bestDeal && bestDeal.store === store;
          return (
            <article key={store} className="store-card" aria-labelledby={`store-${store}`}>
              <div className="sign">
                <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
                <h3 id={`store-${store}`}>{storeName}</h3>
              </div>
              <div className={isBestDeal ? "store-items best-deal" : "store-items"}>
                {cheapestOptions[store].map((option) => (
                  <div key={option.name} className="store-item">
                    <img src={option.image} alt="" />
                    <div className="store-item-text">
                      <div className="store-item-top">
                        <strong>{option.name}</strong>
                        {!option.unavailable && <span className="price-tag">${Number(option.price).toFixed(2)}</span>}
                      </div>
                      {option.unavailable
                        ? <span className="store-item-detail">Not at {storeName}</span>
                        : <span className="store-item-detail">{option.size} · {option.item}</span>}
                    </div>
                  </div>
                ))}
                <div className="store-total">
                  {isBestDeal && <span className="best-deal-tag">Best deal</span>}
                  <div className="store-total-row">
                    <strong>Total cost</strong>
                    <span>${totalPrices[store]}</span>
                  </div>
                </div>
              </div>
              {/* rel="noopener noreferrer" keeps the store's page from reaching back into this one */}
              <a className="store-link" href={cheapestOptions[store][0].link} target="_blank" rel="noopener noreferrer">
                View on {storeName}
              </a>
            </article>
          );
        })}
      </div>
      <p className="search-note">Sample prices for demonstration.</p>
    </>
  );
}
