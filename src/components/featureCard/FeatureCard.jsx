import { useNavigate } from 'react-router-dom';
import './FeatureCard.css';

const FeatureCard = ({
    imgUrl,
    title, 
    text, 
    buttonText
}) => { 

    const navigate = useNavigate()
    function toGoToLogin() {
        navigate("/register")
    }
    return (
        <div className="feature-card">
            <div className="feature-card__img">
                <img src={require(`${imgUrl}`)} alt="a user who uses this app" />
            </div>
            <div className="feature-card__info">
                <div className="feature-card__title">
                    {title}
                </div>
                <p>
                    {text}
                </p>
                <button onClick={toGoToLogin}>
                    {buttonText}
                </button>
            </div>
      </div>
    )
}

export default FeatureCard;