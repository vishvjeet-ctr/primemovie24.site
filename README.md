# PrimeMovie24 - Professional Movie Website

A complete, production-ready movie website built with Node.js, Express.js, MongoDB, and EJS templates. Features a professional OTT-style frontend and a comprehensive admin panel for managing movies.

## 🎬 Features

### Frontend (User Side)
- **OTT-Style UI**: Professional Netflix/Prime Video-inspired design
- **Movie Sections**: 
  - Trending Movies (with ranking numbers)
  - Bollywood Movies
  - Hollywood Movies
  - Marvel Movies
  - DC Movies
  - South Indian Movies
- **Search Functionality**: Real-time search by movie title with partial matching
- **Movie Detail Pages**: Individual pages for each movie with download links
- **Fully Responsive**: Optimized for Mobile, Tablet, Laptop, and Desktop

### Admin Panel
- **Dark Theme**: Professional dark-themed admin interface
- **Dashboard**: Statistics overview with movie counts by category
- **Add Movies**: Form to add new movies with validation
- **Edit Movies**: Update existing movie details
- **Delete Movies**: Remove movies from the database
- **All Movies Table**: View all movies in a sortable table format

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project Directory

```bash
cd MOVIE
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- ejs
- dotenv
- method-override

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
MONGODB_URI=mongodb://localhost:27017/primemovie24
PORT=3000
```

**Note**: If you're using MongoDB Atlas or a remote MongoDB instance, update the `MONGODB_URI` accordingly.

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

**On macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**On Windows:**
```bash
net start MongoDB
```

Or if MongoDB is installed as a service, it should start automatically.

### Step 5: Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📁 Project Structure

```
MOVIE/
├── models/
│   └── Movie.js              # Mongoose schema for movies
├── routes/
│   ├── admin.js              # Admin panel routes
│   └── frontend.js           # Frontend routes
├── views/
│   ├── admin/
│   │   ├── layout.ejs        # Admin layout template
│   │   ├── dashboard.ejs     # Admin dashboard
│   │   ├── add-movie.ejs     # Add movie form
│   │   ├── all-movies.ejs    # All movies table
│   │   └── edit-movie.ejs    # Edit movie form
│   ├── frontend/
│   │   ├── index.ejs         # Home page
│   │   ├── search.ejs        # Search results
│   │   └── movie-detail.ejs  # Movie detail page
│   ├── partials/
│   │   ├── header.ejs        # Frontend header
│   │   └── footer.ejs        # Frontend footer
│   └── error.ejs             # Error page
├── public/
│   └── css/
│       ├── frontend.css      # Frontend styles
│       └── admin.css         # Admin panel styles
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables example
└── README.md                 # This file
```

## 🎯 Usage Guide

### Accessing the Website

1. **Frontend (User Side)**: 
   - Open your browser and go to `http://localhost:3000`
   - Browse movies by category
   - Use the search bar to find specific movies
   - Click on any movie poster to view details and download

2. **Admin Panel**: 
   - Navigate to `http://localhost:3000/admin`
   - Use the sidebar to navigate between sections:
     - **Dashboard**: View statistics
     - **Add Movie**: Add new movies to the database
     - **All Movies**: View, edit, or delete existing movies

### Adding Movies

1. Go to `/admin/add`
2. Fill in the form:
   - **Movie Title**: Name of the movie
   - **Poster Image URL**: URL to the movie poster image
   - **Download Link**: URL where users can download the movie
   - **Category**: Select from trending, bollywood, hollywood, marvel, dc, or south
   - **Rating**: Optional rating (0-10)
3. Click "Add Movie"

### Editing Movies

1. Go to `/admin/movies`
2. Click "Edit" next to the movie you want to modify
3. Update the fields
4. Click "Update Movie"

### Deleting Movies

1. Go to `/admin/movies`
2. Click "Delete" next to the movie you want to remove
3. Confirm the deletion

## 🗄️ Database Schema

The Movie model includes the following fields:

```javascript
{
  title: String (required),
  poster: String (required),
  downloadLink: String (required),
  category: String (enum: ['trending', 'bollywood', 'hollywood', 'marvel', 'dc', 'south']),
  rating: Number (0-10, optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in:
- `public/css/frontend.css` for the frontend
- `public/css/admin.css` for the admin panel

### Adding Categories

1. Update the enum in `models/Movie.js`
2. Add the new category option in admin forms (`views/admin/add-movie.ejs` and `views/admin/edit-movie.ejs`)
3. Add a new section in `views/frontend/index.ejs`
4. Add a route handler in `routes/frontend.js`

## 🔧 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod --version`
- Check your `.env` file has the correct `MONGODB_URI`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

- Change the `PORT` in your `.env` file
- Or kill the process using the port: `lsof -ti:3000 | xargs kill`

### Module Not Found Errors

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## 📝 Notes

- This is a production-ready application but does not include authentication. Add authentication middleware if deploying to production.
- Poster images and download links should be valid URLs.
- The search functionality uses MongoDB regex for partial matching.
- All movie sections are limited (Trending: 10, Others: 15) for performance.

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in your `.env` file
2. Use a process manager like PM2: `pm2 start server.js`
3. Set up MongoDB Atlas or a managed MongoDB service
4. Configure environment variables on your hosting platform
5. Set up a reverse proxy (nginx) if needed

## 📄 License

This project is open source and available for use.

## 👨‍💻 Support

For issues or questions, please check:
- MongoDB documentation
- Express.js documentation
- Mongoose documentation

---

**Built with ❤️ using Node.js, Express.js, MongoDB, and EJS**


