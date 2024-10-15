import React, { useState, useEffect } from "react";
import Axios from "axios";
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import jsPDF autotable plugin
import logo from '../Images/Logo.png'

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [minRating, setMinRating] = useState(0); // Min rating filter state
  const [selectedRating, setSelectedRating] = useState("All"); // New state for specific rating

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
        setReviews(reviews.map((review) =>
          review._id === id ? { ...review, Status: status } : review
        ));
      })
      .catch((error) => {
        console.error("There was an error updating the status!", error);
      });
  };

  // Handle reply change in input field
  const handleReplyChange = (id, reply) => {
    setReviews(reviews.map((review) =>
      review._id === id ? { ...review, reply } : review
    ));
  };

  // Handle admin reply submission
  const handleReply = (id, reply) => {
    Axios.put(`http://localhost:3001/UpdateReviewReply/${id}`, { reply })
      .then((response) => {
        console.log("Reply updated successfully");
        toast.success("Reply updated successfully")
      })
      .catch((error) => {
        console.error("There was an error updating the reply!", error);
      });
  };

  // Filter reviews based on search term, selected rating, and minimum rating
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) || // Include first name
      review.LastName.toLowerCase().includes(searchTerm.toLowerCase()) || // Include last name
      review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.reply && review.reply.toLowerCase().includes(searchTerm.toLowerCase()));

    // If minRating is 0, show all ratings; otherwise filter by selected rating
    const matchesMinRating = minRating === 0 || review.rating >= minRating;

    // Filter by specific rating if selected
    const matchesSelectedRating = selectedRating === "All" || review.rating === parseInt(selectedRating);
    
    return matchesSearch && matchesMinRating && matchesSelectedRating;
  });

  // Sort filtered reviews by rating in ascending order
  const sortedReviews = filteredReviews.sort((a, b) => a.rating - b.rating);

  // Report generation function
  const generateReport = () => {
    const doc = new jsPDF();
  
    // Add logo to the top-left corner
    const img = new Image();
    img.src = logo; // Path to your logo image
    doc.addImage(img, 'PNG', 10, 10, 25, 20); // Adjust logo size and position
  
    // Centered title for the report
    doc.setFontSize(16);
    doc.text('Reviews Report', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' }); // Centered title, adjust Y position
  
    // Right corner contact info with smaller font size
    doc.setFontSize(7); // Smaller font size for the contact info
    const todayDate = new Date().toLocaleDateString(); // Get today's date
    doc.text([
      'Email: your-email@example.com',
      'Tel: 123-456-7890',
      'Website: www.example.com',
      `Date: ${todayDate}`
    ], doc.internal.pageSize.getWidth() - 50, 20); // Adjust the X position for contact info
  
    // Add a line below the header to separate content
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35); // Horizontal line to separate header from content
  
    // Table headers and rows for reviews
    const tableColumn = ["First Name", "Last Name", "Rating", "Review Title", "Review", "Status", "Reply"];
    const tableRows = [];
  
    sortedReviews.forEach(review => {
      const reviewData = [
        review.FirstName,
        review.LastName,
        review.rating,
        review.reviewTitle,
        review.review,
        review.Status,
        review.reply || "N/A"
      ];
      tableRows.push(reviewData);
    });
  
    // Add table after the header, with adjusted margin and custom styles
    doc.autoTable({
      head: [tableColumn], // Table column headers
      body: tableRows, // Table rows
      startY: 40, // Ensure the table starts after the header
      headStyles: {
        fillColor: [4, 73, 71], // Custom header color (dark green)
        textColor: [255, 255, 255], // White text for the header
        halign: 'center', // Center align header text
        fontSize: 10, // Font size for the header
      },
      bodyStyles: {
        halign: 'center', // Center align body text
        fontSize: 8, // Smaller text for the body
      },
      alternateRowStyles: {
        fillColor: [255, 244, 181], // Alternate row fill color (light yellow)
      },
    });
  
    // Save the PDF
    doc.save('reviews_report.pdf');
  };
  

  return (
    <div>
      <AdminNaviBar selectedPage="Review Management" />
      <Sidebar />
      <div className="container mx-auto mt-5 p-10 bg-gray-900 rounded-lg text-gray-200">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name, title, review or reply"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg w-1/3"
          />
          <div className="flex items-center space-x-4">
            <label className="text-gray-400">Minimum Rating:</label>
            <input
              type="range"
              min="0"
              max="5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="slider w-48 bg-gray-800"
            />
            <span className="text-gray-400">{minRating === 0 ? 'All' : minRating}</span>

            <label className="text-gray-400 ml-4">Filter by Rating:</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg"
            >
              <option value="All">All</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            {/* Button to generate the PDF report */}
            <button
              onClick={generateReport}
              className="bg-blue-500 text-black font-semibold py-2 px-4 rounded hover:bg-blue-700 hover:text-white  transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg "
            >
              Download Report <FontAwesomeIcon icon={faFilePdf} />
            </button>
          </div>
        </div>

        <table className="table-auto w-full text-left bg-gray-800 shadow-md rounded-lg">
          <thead className="bg-gray-700 text-gray-100">
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Review Title</th>
              <th className="px-4 py-2">Review</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Admin Reply</th>
            </tr>
          </thead>
          <tbody>
            {sortedReviews.length > 0 ? sortedReviews.map((review) => (
              <tr key={review._id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="px-4 py-2">{review.FirstName}</td>
                <td className="px-4 py-2">{review.LastName}</td>
                <td className="px-4 py-2">{review.rating}</td>
                <td className="px-4 py-2">{review.reviewTitle}</td>
                <td className="px-4 py-2">{review.review}</td>
                <td className="px-4 py-2">
                  <select
                    value={review.Status}
                    onChange={(e) => handleStatusChange(review._id, e.target.value)}
                    className="px-2 py-1 bg-gray-700 text-gray-300 border border-gray-600 rounded"
                  >
                    <option value="Show">Show</option>
                    <option value="Hide">Hide</option>
                  </select>
                </td>
                <td className="px-4 py-3 mt-2 flex">
                  <textarea
                    type="text"
                    value={review.reply || ""}
                    onChange={(e) => handleReplyChange(review._id, e.target.value)}
                    className="px-2 py-3 bg-gray-700 text-gray-300 border border-gray-600 rounded"
                  />

                  <button
                    onClick={() => handleReply(review._id, review.reply)}
                    className="ml-2 h-10 w-20 mt-4 p-2 bg-blue-600 text-white hover:bg-white hover:text-black transition-all duration-500 rounded"
                  >
                    Reply <FontAwesomeIcon icon={faReply} className="text-sm"/>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">No reviews found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReviewsTable;
