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
    trim: true,
    validate: {
      validator: function(v) {
        // downloadLink is required only if downloadLinks is empty or doesn't exist
        const hasDownloadLinks = this.downloadLinks && Array.isArray(this.downloadLinks) && this.downloadLinks.length > 0;
        return hasDownloadLinks || (v && v.trim().length > 0);
      },
      message: 'Either downloadLink or at least one downloadLinks item is required'
    }
  },
  downloadLinks: [{
    name: {
      type: String,
      trim: true,
      default: 'Download'
    },
    url: {
      type: String,
      trim: true,
      required: true
    }
  }],
  categories: [{
    type: String,
    required: true,
    enum: {
      values: ['trending', 'bollywood', 'hollywood', 'marvel', 'dc', 'south', 'webseries', 'netflixprime', 'animation'],
      message: 'Category must be one of: trending, bollywood, hollywood, marvel, dc, south, webseries, netflixprime, animation'
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  normalizedTitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster search queries
movieSchema.index({ title: 'text' });

// Pre-save middleware to generate normalizedTitle and auto-fill downloadLink
movieSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.normalizedTitle = this.title
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9]/g, ''); // Remove special characters
  }
  
  // Auto-fill downloadLink from downloadLinks[0] if downloadLink is empty and downloadLinks exist
  if ((!this.downloadLink || this.downloadLink.trim() === '') && 
      this.downloadLinks && 
      Array.isArray(this.downloadLinks) && 
      this.downloadLinks.length > 0 && 
      this.downloadLinks[0].url) {
    this.downloadLink = this.downloadLinks[0].url.trim();
  }
  
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;