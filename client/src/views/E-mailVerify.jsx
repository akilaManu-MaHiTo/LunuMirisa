import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';


const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const url = `http://localhost:3001/users/${param.id}/verify/${param.token}`;
                const { data } = await axios.get(url);
                console.log(data);
                setValidUrl(true);
            } catch (error) {
                console.log(error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param]);

    return (
        <div>
            {validUrl ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold text-green-600 mb-6">Email verified successfully</h1>
                    <Link to="/login">
                        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                            Login
                        </button>
                    </Link>
                </div>
            ) : (
                <h1 className="text-4xl font-bold text-red-600 text-center mt-20">404 Not Found</h1>
            )}
        </div>
    );
};

export default EmailVerify;
