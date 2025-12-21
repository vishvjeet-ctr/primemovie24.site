const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { ensureAdmin } = require('../middleware/auth');

// Admin Dashboard
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const trendingCount = await Movie.countDocuments({ category: 'trending' });
    
    const categoryCounts = {
      bollywood: await Movie.countDocuments({ category: 'bollywood' }),
      hollywood: await Movie.countDocuments({ category: 'hollywood' }),
      marvel: await Movie.countDocuments({ category: 'marvel' }),
      dc: await Movie.countDocuments({ category: 'dc' }),
      south: await Movie.countDocuments({ category: 'south' })
    };

    res.render('admin/dashboard', {
      totalMovies,
      trendingCount,
      categoryCounts,
      title: 'Admin Dashboard',
      page: 'dashboard'
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).render('error', { error: 'Failed to load dashboard' });
  }
});

// Add Movie Page
router.get('/add', ensureAdmin, (req, res) => {
  res.render('admin/add-movie', {
    title: 'Add New Movie',
    page: 'add'
  });
});

// Create Movie
router.post('/add', ensureAdmin, async (req, res) => {
  try {
    const { title, poster, downloadLink, category, rating } = req.body;
    
    // Validation
    if (!title || !poster || !downloadLink || !category) {
      return res.status(400).render('admin/add-movie', {
        title: 'Add New Movie',
        page: 'add',
        error: 'Please fill all required fields'
      });
    }

    const movie = new Movie({
      title: title.trim(),
      poster: poster.trim(),
      downloadLink: downloadLink.trim(),
      category: category.trim(),
      rating: rating ? parseFloat(rating) : 0
    });

    await movie.save();
    console.log('✅ Movie saved successfully:', movie.title);
    res.redirect('/admin/movies');
  } catch (error) {
    console.error('❌ Error creating movie:', error);
    res.status(500).render('admin/add-movie', {
      title: 'Add New Movie',
      page: 'add',
      error: error.message || 'Failed to create movie. Please try again.'
    });
  }
});

// All Movies Page
router.get('/movies', ensureAdmin, async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render('admin/all-movies', {
      movies,
      title: 'All Movies',
      page: 'movies'
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).render('error', { error: 'Failed to load movies' });
  }
});

// Edit Movie Page
router.get('/movies/:id/edit', ensureAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).render('error', { error: 'Movie not found' });
    }

    res.render('admin/edit-movie', {
      movie,
      title: `Edit ${movie.title}`,
      page: 'edit'
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).render('error', { error: 'Failed to load movie' });
  }
});

// Update Movie
router.put('/movies/:id', ensureAdmin, async (req, res) => {
  try {
    const { title, poster, downloadLink, category, rating } = req.body;
    
    await Movie.findByIdAndUpdate(req.params.id, {
      title,
      poster,
      downloadLink,
      category,
      rating: rating || 0
    });

    res.redirect('/admin/movies');
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).render('error', { error: 'Failed to update movie' });
  }
});

// Delete Movie
router.delete('/movies/:id', ensureAdmin, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/admin/movies');
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).render('error', { error: 'Failed to delete movie' });
  }
});

module.exports = router;