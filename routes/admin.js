const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.redirect('/admin/login');
  }
}

// Login page
router.get('/login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin');
  }
  res.render('login');
});


// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin Dashboard
router.get('/', requireAuth, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const trendingCount = await Movie.countDocuments({
      $or: [
        { categories: 'trending' },
        { category: 'trending' }
      ]
    });

    const categoryCounts = {
      bollywood: await Movie.countDocuments({
        $or: [
          { categories: 'bollywood' },
          { category: 'bollywood' }
        ]
      }),
      hollywood: await Movie.countDocuments({
        $or: [
          { categories: 'hollywood' },
          { category: 'hollywood' }
        ]
      }),
      marvel: await Movie.countDocuments({
        $or: [
          { categories: 'marvel' },
          { category: 'marvel' }
        ]
      }),
      dc: await Movie.countDocuments({
        $or: [
          { categories: 'dc' },
          { category: 'dc' }
        ]
      }),
      south: await Movie.countDocuments({
        $or: [
          { categories: 'south' },
          { category: 'south' }
        ]
      }),
      webseries: await Movie.countDocuments({
        $or: [
          { categories: 'webseries' },
          { category: 'webseries' }
        ]
      }),
      netflixprime: await Movie.countDocuments({
        $or: [
          { categories: 'netflixprime' },
          { category: 'netflixprime' }
        ]
      }),
      animation: await Movie.countDocuments({
        $or: [
          { categories: 'animation' },
          { category: 'animation' }
        ]
      })
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
router.get('/add', requireAuth, (req, res) => {
  res.render('admin/add-movies', {
    title: 'Add New Movie',
    page: 'add'
  });
});

// Create Movie
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { title, poster, downloadLink, downloadLinks, linkNames, linkUrls, categories, rating } = req.body;

    // Handle multiple download links - form sends linkNames and linkUrls arrays
    let processedDownloadLinks = [];
    if (linkUrls && Array.isArray(linkUrls) && linkUrls.length > 0) {
      linkUrls.forEach((url, index) => {
        if (url && url.trim()) {
          processedDownloadLinks.push({
            name: (linkNames && linkNames[index] && linkNames[index].trim()) || 'Download',
            url: url.trim()
          });
        }
      });
    } else if (linkUrls && typeof linkUrls === 'string' && linkUrls.trim()) {
      // Single link case
      processedDownloadLinks.push({
        name: (linkNames && typeof linkNames === 'string' && linkNames.trim()) || 'Download',
        url: linkUrls.trim()
      });
    }

    // Handle legacy downloadLink field for backward compatibility
    let finalDownloadLink = downloadLink;
    if (!finalDownloadLink && processedDownloadLinks.length > 0) {
      finalDownloadLink = processedDownloadLinks[0].url;
    } else if (finalDownloadLink && processedDownloadLinks.length === 0) {
      // If only legacy downloadLink exists, create downloadLinks array from it
      processedDownloadLinks.push({
        name: 'Download',
        url: finalDownloadLink.trim()
      });
    }

    // Handle categories - convert from form array to proper format
    let selectedCategories = [];
    if (categories) {
      if (Array.isArray(categories)) {
        selectedCategories = categories;
      } else {
        selectedCategories = [categories];
      }
    }

    // Validation
    if (!title || !poster || !finalDownloadLink || selectedCategories.length === 0) {
      return res.status(400).render('admin/add-movies', {
        title: 'Add New Movie',
        page: 'add',
        error: 'Please fill all required fields and select at least one category'
      });
    }

    const movie = new Movie({
      title: title.trim(),
      poster: poster.trim(),
      downloadLink: finalDownloadLink.trim(),
      downloadLinks: processedDownloadLinks.length > 0 ? processedDownloadLinks : undefined,
      categories: selectedCategories,
      rating: rating ? parseFloat(rating) : 0
    });

    await movie.save();
    console.log('✅ Movie saved successfully:', movie.title);
    res.redirect('/admin/movies');
  } catch (error) {
    console.error('❌ Error creating movie:', error);
    res.status(500).render('admin/add-movies', {
      title: 'Add New Movie',
      page: 'add',
      error: error.message || 'Failed to create movie. Please try again.'
    });
  }
});

// All Movies Page
router.get('/movies', requireAuth, async (req, res) => {
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
router.get('/movies/:id/edit', requireAuth, async (req, res) => {
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
router.put('/movies/:id', requireAuth, async (req, res) => {
  try {
    const { title, poster, downloadLink, linkNames, linkUrls, categories, rating } = req.body;

    // Get existing movie to preserve old data
    const existingMovie = await Movie.findById(req.params.id);
    if (!existingMovie) {
      return res.status(404).render('error', { error: 'Movie not found' });
    }

    // Handle multiple download links - form sends linkNames and linkUrls arrays
    let processedDownloadLinks = [];
    if (linkUrls && Array.isArray(linkUrls) && linkUrls.length > 0) {
      linkUrls.forEach((url, index) => {
        if (url && url.trim()) {
          processedDownloadLinks.push({
            name: (linkNames && linkNames[index] && linkNames[index].trim()) || 'Download',
            url: url.trim()
          });
        }
      });
    } else if (linkUrls && typeof linkUrls === 'string' && linkUrls.trim()) {
      // Single link case
      processedDownloadLinks.push({
        name: (linkNames && typeof linkNames === 'string' && linkNames.trim()) || 'Download',
        url: linkUrls.trim()
      });
    }

    // Handle legacy downloadLink field for backward compatibility
    let finalDownloadLink = downloadLink;
    if (!finalDownloadLink && processedDownloadLinks.length > 0) {
      // Auto-fill from first downloadLinks item
      finalDownloadLink = processedDownloadLinks[0].url;
    } else if (finalDownloadLink && processedDownloadLinks.length === 0) {
      // If only legacy downloadLink exists, create downloadLinks array from it
      processedDownloadLinks.push({
        name: 'Download',
        url: finalDownloadLink.trim()
      });
    } else if (!finalDownloadLink && processedDownloadLinks.length === 0 && existingMovie.downloadLink) {
      // Preserve existing downloadLink if no new links provided
      finalDownloadLink = existingMovie.downloadLink;
    }

    // Handle categories - convert from form array to proper format
    let selectedCategories = [];
    if (categories) {
      if (Array.isArray(categories)) {
        selectedCategories = categories;
      } else {
        selectedCategories = [categories];
      }
    }

    // Build update object - preserve all existing fields
    const updateData = {
      title: title ? title.trim() : existingMovie.title,
      poster: poster ? poster.trim() : existingMovie.poster,
      downloadLink: finalDownloadLink ? finalDownloadLink.trim() : existingMovie.downloadLink,
      categories: selectedCategories.length > 0 ? selectedCategories : existingMovie.categories,
      rating: rating !== undefined ? parseFloat(rating) : existingMovie.rating
    };

    // Only update downloadLinks if new ones were provided
    if (processedDownloadLinks.length > 0) {
      updateData.downloadLinks = processedDownloadLinks;
    }

    await Movie.findByIdAndUpdate(req.params.id, updateData);

    res.redirect('/admin/movies');
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).render('error', { error: 'Failed to update movie' });
  }
});

// Delete Movie
router.delete('/movies/:id', requireAuth, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/admin/movies');
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).render('error', { error: 'Failed to delete movie' });
  }
});

module.exports = router;

