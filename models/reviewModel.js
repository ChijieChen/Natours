const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'
  //   });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
