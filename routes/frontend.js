const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Home page - Display all movie sections
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    
    // If search query exists, show search results
    if (searchQuery) {
      const movies = await Movie.find({
        title: { $regex: searchQuery, $options: 'i' }
      }).sort({ createdAt: -1 }).limit(50);
      
      return res.render('frontend/search', {
        movies,
        searchQuery,
        title: 'Search Results'
      });
    }

    // Get trending movies (latest 10)
    const trendingMovies = await Movie.find({ category: 'trending' })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get movies by category (15 each)
    const bollywoodMovies = await Movie.find({ category: 'bollywood' })
      .sort({ createdAt: -1 })
      .limit(15);
    
    const hollywoodMovies = await Movie.find({ category: 'hollywood' })
      .sort({ createdAt: -1 })
      .limit(15);
    
    const marvelMovies = await Movie.find({ category: 'marvel' })
      .sort({ createdAt: -1 })
      .limit(15);
    
    const dcMovies = await Movie.find({ category: 'dc' })
      .sort({ createdAt: -1 })
      .limit(15);
    
    const southMovies = await Movie.find({ category: 'south' })
      .sort({ createdAt: -1 })
      .limit(15);

    res.render('frontend/index', {
      trendingMovies,
      bollywoodMovies,
      hollywoodMovies,
      marvelMovies,
      dcMovies,
      southMovies,
      title: 'PrimeMovie24 - Home'
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).render('error', { error: 'Failed to load movies' });
  }
});

// Movie detail page
router.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).render('error', { error: 'Movie not found' });
    }

    res.render('frontend/movie-detail', {
      movie,
      title: `${movie.title} - PrimeMovie24`
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).render('error', { error: 'Failed to load movie details' });
  }
});

module.exports = router;