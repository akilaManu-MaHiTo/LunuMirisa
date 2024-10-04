import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './Components/NavigationBar';
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
        <div>
            <NavigationBar />
            <div className="p-4">
                <ToastContainer />
                <h2 className="text-xl font-semibold">My Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border p-4 my-4 rounded shadow text-white">
                            <div className="flex items-center">
                                {profile && profile.image && (
                                    <img
                                        src={`http://localhost:3001/Images/${profile.image}`}
                                        alt={`${review.FirstName} ${review.LastName}`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                )}
                                <div>
                                    <h3 className="font-bold text-white">{`${review.FirstName} ${review.LastName}`}</h3>
                                    <p className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold">Edit Review</h4>
                                <input
                                    type="text"
                                    name="reviewTitle"
                                    value={review.reviewTitle || ''}
                                    onChange={(e) => handleChange(e, review._id)}
                                    className="border p-2 w-full mb-2 text-black"
                                    placeholder="Review Title"
                                />
                                <textarea
                                    name="review"
                                    value={review.review || ''}
                                    onChange={(e) => handleChange(e, review._id)}
                                    className="border p-2 w-full mb-2 text-black"
                                    placeholder="Your Review"
                                />
                            </div>
                            <div className="mt-2">
                                <p>Rating:</p>
                                <div>
                                    {renderStarRating(review.rating, review._id, handleRatingChange)}
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleUpdate(review._id)}
                                    disabled={!review.isEdited}
                                    className={`bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ${!review.isEdited ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Update Review
                                </button>

                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

// Helper function to render star rating using Font Awesome
const renderStarRating = (rating, reviewId, handleRatingChange) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span
                key={i}
                className="cursor-pointer"
                onClick={() => handleRatingChange(reviewId, i + 1)}
            >
                <FontAwesomeIcon icon={i < rating ? solidStar : regularStar} className={i < rating ? 'text-yellow-500' : 'text-gray-400'} />
            </span>
        );
    }
    return stars;
};

export default UserReviews;
