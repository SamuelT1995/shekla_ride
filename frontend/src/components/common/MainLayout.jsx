import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <Navbar />
            <main className={`flex-grow ${isHome ? '' : 'pt-28 md:pt-32'}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
