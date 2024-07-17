import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageShow = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/showImages')
            .then(response => setImages(response.data))
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {images.map(image => (
                <div key={image._id} className="border rounded-lg overflow-hidden shadow-lg">
                    <img src={image.image} alt={`Image ${image._id}`} className="w-full h-auto" />
                </div>
            ))}
        </div>
    );
};

export default ImageShow;
