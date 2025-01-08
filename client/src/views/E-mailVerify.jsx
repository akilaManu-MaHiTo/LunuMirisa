import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';


const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const url = `https://lunu-mirisa.vercel.app/users/${param.id}/verify/${param.token}`;
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
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold text-green-600 mb-6">Email verified successfully</h1>
                    <Link to="/login">
                        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                            Login
                        </button>
                    </Link>
                </div>
        </div>
    );
};

export default EmailVerify;
