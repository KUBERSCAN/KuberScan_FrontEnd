import logo from "../assets/logo.png";

const Header = () => { 
    return(
        <header>
        <div class="logo">
            <div class="logo-icon">
                <img class="logo-icon" src={logo} />
            </div>
            KuberScan
        </div>
        <nav>
            <a href="/static/scan">Scan Image</a>
            <a href="#features">Information</a>
            <a href="#about">About</a>
            <a href="/login" class="login-btn">Log in</a>
        </nav>
    </header>
    )
};

export default Header;