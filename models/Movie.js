const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required'],
    trim: true
  },
  downloadLink: {
    type: String,
    required: [true, 'Download link is required'],
    trim: true
  },
  categories: [{
    type: String,
    required: true,
    enum: {
      values: ['trending', 'bollywood', 'hollywood', 'marvel', 'dc', 'south'],
      message: 'Category must be one of: trending, bollywood, hollywood, marvel, dc, south'
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster search queries
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;