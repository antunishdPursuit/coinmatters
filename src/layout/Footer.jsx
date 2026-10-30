import './Footer.css';
 
 const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__col"></div>
            <div className="footer__col"></div>
            <div className="footer__col github">
                <p className='footer__col_title'>Sources</p>
                <a href="https://github.com/antunishdPursuit/coinmatterscapstone-frontend">FrontEnd</a>
                <a href="https://github.com/Irwinj7/Coinmatters-backened">BackEnd</a>
            </div>

        </div>
    )
 }

 export default Footer;