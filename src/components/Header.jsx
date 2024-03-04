import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Header.css';

const Header = ({ setQuestionData }) => {
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        setQuestionData([])
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link to="/" className="navbar-brand">DSA Tracker</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/problems" className="nav-link">Problems</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/interviews" className="nav-link">Interview Experiences</Link>
                        </li>
                    </ul>
                </div>

                <div className="d-flex">
                    {isLoggedIn ? (
                        <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;