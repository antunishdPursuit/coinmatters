import './Footer.css';
import navLogo from "../Images/navLogo.png";

 const Footer = () => {
    return (
        <footer className="site-footer">
            <span className="footer-name">
                <img src={navLogo} alt="" />
                CoinMatters
            </span>
            <nav className="footer-links" aria-label="Sources">
                <a href="https://github.com/antunishdPursuit/coinmatters">Frontend source</a>
                <a href="https://github.com/antunishdPursuit/coinmatters-backend">Backend source</a>
            </nav>
        </footer>
    )
 }

 export default Footer;
