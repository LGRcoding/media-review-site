const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/reviews', { useNewUrlParser: true, useUnifiedTopology: true });

const reviewSchema = new mongoose.Schema({
  user: String,
  review: String,
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit-review', async (req, res) => {
  const { user, review } = req.body;
  const newReview = new Review({ user, review });
  await newReview.save();
  res.redirect(`/reviews/${newReview._id}`);
});

app.get('/reviews/:id', async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.send(`
    <h1>Review by ${review.user}</h1>
    <p>${review.review}</p>
    <p>${review.date}</p>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
