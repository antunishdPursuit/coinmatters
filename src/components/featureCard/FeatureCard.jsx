import './FeatureCard.css';

const FeatureCard = ({
    imgUrl,
    imgAlt = "",
    title,
    text
}) => {
    return (
        <article className="feature-card">
            <img src={imgUrl} alt={imgAlt} />
            <h2>{title}</h2>
            <p>{text}</p>
        </article>
    )
}

export default FeatureCard;
