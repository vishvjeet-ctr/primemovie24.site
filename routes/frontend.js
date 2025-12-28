const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Helper function to normalize search terms
function normalizeSearchTerm(term) {
  return term
    .toLowerCase()
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
}

// Home page - Display all movie sections
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    
    // If search query exists, show search results
    if (searchQuery) {
      const normalizedQuery = normalizeSearchTerm(searchQuery);
      
      const movies = await Movie.find({
        $or: [
          // Exact title match (case-insensitive)
          { title: { $regex: new RegExp(`^${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          // Partial title match (case-insensitive)
          { title: { $regex: new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
          // Normalized title match (space-insensitive)
          { normalizedTitle: { $regex: new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
          // Category match
          { categories: { $regex: new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
          { category: { $regex: new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
          // Description matches
          { description: { $regex: new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
          { description: { $regex: new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } }
        ]
      })
      .sort({ createdAt: -1, rating: -1 })
      .limit(50);
      
      return res.render('frontend/search', {
        movies,
        searchQuery,
        title: `Search Results for "${searchQuery}"`,
        resultCount: movies.length
      });
    }

    // Get trending movies (latest 10)
    const trendingMovies = await Movie.find({ 
      $or: [
        { categories: 'trending' },
        { category: 'trending' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get movies by category (45 each)
    const bollywoodMovies = await Movie.find({ 
      $or: [
        { categories: 'bollywood' },
        { category: 'bollywood' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const hollywoodMovies = await Movie.find({ 
      $or: [
        { categories: 'hollywood' },
        { category: 'hollywood' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const marvelMovies = await Movie.find({ 
      $or: [
        { categories: 'marvel' },
        { category: 'marvel' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const dcMovies = await Movie.find({ 
      $or: [
        { categories: 'dc' },
        { category: 'dc' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const southMovies = await Movie.find({ 
      $or: [
        { categories: 'south' },
        { category: 'south' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const webseriesMovies = await Movie.find({ 
      $or: [
        { categories: 'webseries' },
        { category: 'webseries' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const netflixprimeMovies = await Movie.find({ 
      $or: [
        { categories: 'netflixprime' },
        { category: 'netflixprime' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);
    
    const animationMovies = await Movie.find({ 
      $or: [
        { categories: 'animation' },
        { category: 'animation' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(45);

    res.render('frontend/index', {
      trendingMovies,
      bollywoodMovies,
      hollywoodMovies,
      marvelMovies,
      dcMovies,
      southMovies,
      webseriesMovies,
      netflixprimeMovies,
      animationMovies,
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


