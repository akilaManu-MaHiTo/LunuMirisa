// ProfilePic.jsx
import React, { useEffect } from 'react';
import './Profile.css';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';



function ProfilePic() {
    useEffect(() => {
        const readURL = (input) => {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                    $('#imagePreview').hide();
                    $('#imagePreview').fadeIn(650);
                }
                reader.readAsDataURL(input.files[0]);
            }
        };

        $("#imageUpload").change(function () {
            readURL(this);
        });
    }, []); 

    return (
        <div className='flex items-center justify-center w-30'>
        <div className="relative w-40 h-40">
        <img className="w-full h-full bg-cover bg-center rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl "/>

            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 flex items-center justify-center">
                <input 
                    type="file" 
                    id="imageUpload" 
                    accept=".png, .jpg, .jpeg" 
                    className="hidden" 
                />
                <label 
                    htmlFor="imageUpload" 
                    className="flex items-center justify-center"
                >
                    <FontAwesomeIcon 
                        icon={faPencilAlt} 
                        className="text-black text-[1rem] bg-white p-2 rounded-full hover:bg-blue-500 mb-10 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white " 
                    />
                </label>
            </div>
        </div>
    </div>
    
    );
}

export default ProfilePic;
