import React, { useState, useEffect } from "react";
import Axios from "axios";

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);

  // Fetch all reviews on component mount
  useEffect(() => {
    Axios.get("http://localhost:3001/GetAllReviews")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  }, []);

  // Handle status update (Show/Hide)
  const handleStatusChange = (id, status) => {
    Axios.put(`http://localhost:3001/UpdateReviewStatus/${id}`, { Status: status })
      .then((response) => {
        // Update the local state to reflect the new status
        setReviews(reviews.map(review => 
          review._id === id ? { ...review, Status: status } : review
        ));
      })
      .catch((error) => {
        console.error("There was an error updating the status!", error);
      });
  };

  return (
    <div className="container mx-auto mt-5">
      <table className="table-auto w-full text-left border-collapse border border-gray-700">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-2 border border-gray-700">First Name</th>
            <th className="px-4 py-2 border border-gray-700">Last Name</th>
            <th className="px-4 py-2 border border-gray-700">Rating</th>
            <th className="px-4 py-2 border border-gray-700">Review Title</th>
            <th className="px-4 py-2 border border-gray-700">Review</th>
            <th className="px-4 py-2 border border-gray-700">Status</th>
            <th className="px-4 py-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 text-gray-300">
          {reviews.map((review) => (
            <tr key={review._id}>
              <td className="px-4 py-2 border border-gray-700">{review.FirstName}</td>
              <td className="px-4 py-2 border border-gray-700">{review.LastName}</td>
              <td className="px-4 py-2 border border-gray-700">{review.rating}</td>
              <td className="px-4 py-2 border border-gray-700">{review.reviewTitle}</td>
              <td className="px-4 py-2 border border-gray-700">{review.review}</td>
              <td className="px-4 py-2 border border-gray-700">{review.Status}</td>
              <td className="px-4 py-2 border border-gray-700">
                <select
                  value={review.Status}
                  onChange={(e) => handleStatusChange(review._id, e.target.value)}
                  className="px-2 py-1 bg-gray-800 text-gray-300 border border-gray-600 rounded"
                >
                  <option value="Show" className="text-white">Show</option>
                  <option value="Hide" className="text-white">Hide</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;
