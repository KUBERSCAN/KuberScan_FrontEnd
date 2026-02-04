

const Footer = () => {
    return (
        <footer>
        <div class="footer-grid">
            <div class="footer-column">
                <div class="logo" style="margin-bottom: 20px;">
                    <div class="logo-icon">
                        <img class="logo-icon" src="https://i.ibb.co/yK42BzN/Chat-GPT-Image-4-feb-2026-12-06-17.png" />
                    </div>
                    KuberScan
                </div>
                <p>Your Real Time Kubernetes Watchdog</p>
                <div class="social-links">
                    <a href="https://www.linkedin.com/in/sergio-martin-de-la-fuente/" target="_blank"><img class="logo-icon" style="background:inherit" src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"/></a>
                    <a href="https://mail.google.com/mail/?view=cm&to=sseergiioo9@gmail.com" target="_blank"><img class="logo-icon" style="background:inherit" src="https://cdn-icons-png.flaticon.com/512/732/732200.png"/></a>
                    <a href="https://github.com/sergioom9" target="_blank"><img class="logo-icon" style="background:white" src="https://cdn-icons-png.flaticon.com/512/3291/3291695.png"/></a>
                </div>
            </div>
            <div class="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
            </div>
            <div class="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
            </div>
            <div class="footer-column">
                <h4>Support</h4>
                <a href="/help">Help Center</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 KuberScan. Developed by Sergio Martin.</p>
        </div>
    </footer>
    );
}
export default Footer;