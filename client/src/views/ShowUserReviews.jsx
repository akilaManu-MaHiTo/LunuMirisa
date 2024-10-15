import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit, faTrash, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan, faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgReview from '../Images/Review-edit-bg.jpg';
import Navigation from './Components/NavigationBar';
import logo from '../Images/Logo.png';
import Footer from './Footer';

const UserReviews = () => {
    const { userId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/GetAllReviewsbyId/${userId}`)
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error('Error fetching reviews:', error);
                toast.error('Failed to fetch reviews!', { autoClose: 2000 });
            });
    }, [userId]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ShowProfilePic/${userId}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the profile picture!', error);
                setError('There was an error fetching the profile picture!');
            });
    }, [userId]);

    const handleChange = (e, reviewId) => {
        const { name, value } = e.target;
        setReviews((prev) =>
            prev.map((review) =>
                review._id === reviewId ? { ...review, [name]: value, isEdited: true } : review
            )
        );
    };

    const handleRatingChange = (reviewId, newRating) => {
        setReviews((prev) =>
            prev.map((review) =>
                review._id === reviewId ? { ...review, rating: newRating, isEdited: true } : review
            )
        );
    };

    const handleUpdate = (reviewId) => {
        const reviewToUpdate = reviews.find((review) => review._id === reviewId);
        if (reviewToUpdate) {
            const updatedFields = {
                rating: reviewToUpdate.rating,
                reviewTitle: reviewToUpdate.reviewTitle,
                review: reviewToUpdate.review
            };

            axios.put(`http://localhost:3001/updateReview/${reviewToUpdate._id}`, updatedFields)
                .then((response) => {
                    toast.success('Review updated successfully!', { autoClose: 2000 });
                    console.log('Review updated:', response.data);
                })
                .catch((error) => {
                    toast.error('Failed to update review!', { autoClose: 2000 });
                    console.error('Error updating review:', error);
                });
        }
    };

    const handleDelete = (reviewId) => {
        axios.delete(`http://localhost:3001/deleteReview/${reviewId}`)
            .then((response) => {
                toast.success('Review deleted successfully!', { autoClose: 2000 });
                setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
                console.log('Review deleted:', response.data);
            })
            .catch((error) => {
                toast.error('Failed to delete review!', { autoClose: 2000 });
                console.error('Error deleting review:', error);
            });
    };

    return (
        <div className='bg-black'
        
        >
            <Navigation logo={logo} />
            <div className="p-4">
                <ToastContainer />
                <div className='flex justify-center '>
                
                <div className='w-1/2'>
                <h2 className="text-3xl text-white font-thin my-10">My Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-custom-light opacity-70 rounded-xl p-10 my-10 shadow text-white relative">
                            <div className="absolute top-0 right-0 m-2">
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="bg-red-600 text-white px-3 mr-3 mt-3 py-2 rounded hover:bg-red-400 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out transform"
                                >
                                   <FontAwesomeIcon icon={faTrashCan} className='text-3' />
                                </button>
                            </div>
                            <div className="flex items-center">
                                {profile && profile.image && (
                                    <img
                                        src={`http://localhost:3001/Images/${profile.image}`}
                                        alt={`${review.FirstName} ${review.LastName}`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-white select-none">{`${review.FirstName} ${review.LastName}`}</h3>
                                    <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className='pt-2 pb-2'><strong className='font-thin'>Title</strong></div>
                                <input
                                    type="text"
                                    name="reviewTitle"
                                    value={review.reviewTitle || ''}
                                    onChange={(e) => handleChange(e, review._id)}
                                    className="border p-5 w-full mb-2 text-black rounded-xl shadow-lg"
                                    placeholder="Review Title"
                                />
                                <div className='pt-2 pb-2'><strong className='font-thin'>Review</strong></div>
                                <textarea
                                    name="review"
                                    value={review.review || ''}
                                    onChange={(e) => handleChange(e, review._id)}
                                    className="border p-4 w-full h-40 mb-2 text-black rounded-xl shadow-lg"
                                    placeholder="Your Review"
                                />
                            </div>
                            
                            
                            <div className='pt-2 pb-2'><strong className='font-thin'>Reply from a manager</strong></div>
                                <div className="border bg-white p-5 w-full h-28 mb-2 text-black rounded-xl shadow-lg">
                                {review.reply ? review.reply : "We will get back to you soon"}
                                </div>

                            <div className='flex justify-between mt-7'>

                                <div className="">
                                    <p className='text-xl'>Rating </p>
                                    <div>
                                        {renderStarRating(review.rating, review._id, handleRatingChange)}
                                    </div>
                                </div>
                                <div className="flex mt-4 justify-end">
                                    <div className='mb-5 mr-2'>
                                        <button
                                            className="flex items-center bg-blue-500 text-white gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md hover:bg-blue-600 duration-300 hover:gap-2 hover:translate-x-3
                                            ${!review.isEdited ? 'opacity-50 cursor-not-allowed' : ''}"
                                            onClick={() => handleUpdate(review._id)}
                                            disabled={!review.isEdited}>
                                            Send
                                            <svg
                                                className="w-5 h-5"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                                    stroke-linejoin="round"
                                                    stroke-linecap="round"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))
                ) : (
                    <p>No reviews found.</p>
                )}
            </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

const renderStarRating = (rating, reviewId, handleRatingChange) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span
                key={i}
                className="cursor-pointer text-2xl mt-3 relative"
                onClick={() => handleRatingChange(reviewId, i + 1)}
            >
                <FontAwesomeIcon
                    icon={i < rating ? solidStar : regularStar}
                    className={`
                        ${i < rating ? 'text-yellow-400' : 'text-gray-500'}
                        ${i < rating ? 'shadow-glow' : ''}
                        hover:shadow-glow-hover transition-all duration-500 ease-in-out
                    `}
                />
            </span>
        );
    }
    return stars;
    
};

export default UserReviews;
