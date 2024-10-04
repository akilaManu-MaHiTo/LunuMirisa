const express = require('express'); // Require express first
const router = express.Router();    // Then use express.Router()
const Rating = require('../models/Review');

router.post("/PlaceReview", (req, res) => {
  console.log(req.body); // Log the incoming data
  Rating.create(req.body)
      .then(rating => res.json(rating))
      .catch(err => {
          console.error(err); // Log the error
          res.status(500).json({ error: 'Failed to place review' });
      });
});

router.get("/GetAllReviews", (req, res) => {
    Rating.find() // Fetch all reviews from the database
      .then(reviews => res.json(reviews)) // Send the reviews back to the client as JSON
      .catch(err => res.status(500).json({ error: err.message })); // Error handling
  });

router.get("/GetAllReviewsbyId/:userId", (req, res) => {
    const userId = req.params.userId;
    console.log(userId)
    if (!userId) {
        return res.status(400).json({ error: "userId is required" }); // Error if userId is not provided
    }

    Rating.find({ userId }) // Filter reviews by userId
      .then(reviews => res.json(reviews)) // Send the filtered reviews back to the client as JSON
      .catch(err => res.status(500).json({ error: err.message })); // Error handling
});

// PUT route to update only specific fields (rating, reviewTitle, review)
router.put('/updateReview/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { rating, reviewTitle, review } = req.body; // Destructure only the required fields

  try {
      // Update only the provided fields
      const updatedReview = await Rating.findByIdAndUpdate(
          reviewId,
          { rating, reviewTitle, review }, // Update these fields
          { new: true } // Return the updated review
      );

      if (!updatedReview) {
          return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json(updatedReview); // Return updated review
  } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE route to delete a review by ID
router.delete('/deleteReview/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try {
      // Find the review by ID and delete it
      const deletedReview = await Rating.findByIdAndDelete(reviewId);

      if (!deletedReview) {
          return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({ message: 'Review deleted successfully', deletedReview });
  } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/UpdateReviewStatus/:id", (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;
  
    Rating.findByIdAndUpdate(id, { Status }, { new: true })
      .then((updatedReview) => res.json(updatedReview))
      .catch((err) => res.status(500).json({ error: err.message }));
});
  
router.get("/GetNonHideReviews", (req, res) => {
    Rating.find({ Status: "Show" }) // Fetch reviews where Status is "Show"
      .then((reviews) => res.json(reviews)) // Send the filtered reviews back as JSON
      .catch((err) => res.status(500).json({ error: err.message })); // Error handling
});
  



module.exports = router;
