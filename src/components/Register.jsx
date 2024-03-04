import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";
import { postSignupData } from '../services/userService';
import { useAuth } from './AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logging, setLogging] = useState(false);
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setLogging(true)
            const response = await postSignupData({ name, email, password });

            if (response.success) {
                login(response.token);
            } else {
                setErrorMessage('Account with this email already exists. Please log in.');
            }
        } catch (error) {
            console.error('Signup Error:', error);
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
                <h2 className='mb-3 text-primary'>Register</h2>
                {errorMessage && <p className="error-message" style={{ color: "#FF9494" }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label htmlFor="exampleInputname" className="form-label">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            id="exampleInputname"
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary">Register
                        <Spinner animation="border" variant="light" size="sm" className='ms-2' style={logging ? {} : { display: "none" }} />
                    </button>
                </form>

                <p className='container my-2'>Already have an account?</p>
                <Link to='/login' className="btn btn-secondary">Login</Link>
            </div>
        </div>
    );
};

export default Register;

