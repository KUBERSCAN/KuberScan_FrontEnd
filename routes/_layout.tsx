import { PageProps } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const Layout = ({ Component }: PageProps) => {
    return (
        <>
            <Header />
            <Component />
            <Footer />
            </>
    );
};

export default Layout;