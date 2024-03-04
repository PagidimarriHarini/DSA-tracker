import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";
import { checkLoginData } from '../services/userService';
import { useAuth } from './AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logging, setLogging] = useState(false);
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setLogging(true)
            const response = await checkLoginData(email, password);

            if (response.success) {
                login(response.token);
            } else {
                setErrorMessage('Incorrect email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
        } finally {
            setLogging(false)
        }
    };

    useEffect(() => {
        isLoggedIn && navigate("/")
        // eslint-disable-next-line
    }, [isLoggedIn])

    return (
        <div className="d-flex justify-content-center align-items-center text-center vh-100">
            <div className="bg-white p-3 rounded" style={{ width: '50%' }}>
                <h2 className='mb-3 text-primary'>Login</h2>
                {errorMessage && <p className="error-message" style={{ color: "#FF9494" }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            <strong>Email Id</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-control"
                            id="exampleInputEmail1"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            id="exampleInputPassword1"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login
                        <Spinner animation="border" variant="light" size="sm" className='ms-2' style={logging ? {} : { display: "none" }} />
                    </button>
                </form>
                <p className='container my-2'>Don&apos;t have an account?</p>
                <Link to='/signup' className="btn btn-secondary">Register</Link>
            </div>
        </div>
    );
};

export default Login;
