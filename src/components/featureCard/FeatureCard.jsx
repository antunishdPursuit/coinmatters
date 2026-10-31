import './FeatureCard.css';

// One card on the front page: a sign hanging from the rail, with a photo and a line below it.
const FeatureCard = ({
    imgUrl,
    imgAlt = "",
    title,
    text
}) => {
    return (
        <article className="feature-card">
            {/* on phones the cards stack, so each carries its own piece of rail */}
            <div className="rail feature-card-rail" aria-hidden="true"></div>
            <div className="sign">
                <div className="sign-cords" aria-hidden="true"><span></span><span></span></div>
                <h2>{title}</h2>
            </div>
            <img src={imgUrl} alt={imgAlt} />
            <p>{text}</p>
        </article>
    )
}

export default FeatureCard;
