import React from "react";
//import { Link } from 'react-router-dom';
import logo from '../Images/OIP.jpeg'; // Ensure the path to your image is correct
import NavigationBar from './Navigations/NavigationBar';


function ImageUpload() {
    return (
        <div className="bg-custom-black min-h-screen ml-14 mr-16">
            {/* Navigation Bar */}
            <NavigationBar logo={logo} />
            {/* End of Navigation Bar */}
        </div>
    );
}

export default ImageUpload;
