const mongoose = require('mongoose');
const Movie = require('./models/Movie');

// Update existing movies with normalized titles
async function updateNormalizedTitles() {
  try {
    await mongoose.connect('mongodb://localhost:27017/primemovie2412');
    console.log('Connected to MongoDB');
    
    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies`);
    
    for (const movie of movies) {
      const normalizedTitle = movie.title
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
      
      await Movie.findByIdAndUpdate(movie._id, { normalizedTitle });
      console.log(`Updated: ${movie.title} -> ${normalizedTitle}`);
    }
    
    console.log('All movies updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateNormalizedTitles();
