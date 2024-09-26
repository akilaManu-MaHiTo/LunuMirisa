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


module.exports = router;
