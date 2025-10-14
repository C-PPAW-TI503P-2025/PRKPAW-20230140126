const express = require('express');
const router = express.Router();

let movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8 },
  { id: 2, title: 'Interstellar', genre: 'Sci-Fi', year: 2014, rating: 8.6 },
  { id: 3, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0 }
];

// ✅ GET all movies
router.get('/', (req, res) => {
  res.json(movies);
});

// ✅ GET movie by ID
router.get('/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
});

// ✅ CREATE new movie
router.post('/', (req, res) => {
  const { title, genre, year, rating } = req.body;
  if (!title || !genre || !year || !rating)
    return res.status(400).json({ message: 'All fields are required (title, genre, year, rating)' });

  const newMovie = {
    id: movies.length + 1,
    title,
    genre,
    year,
    rating
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// ✅ UPDATE movie by ID
router.put('/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  const { title, genre, year, rating } = req.body;
  if (!title || !genre || !year || !rating)
    return res.status(400).json({ message: 'All fields are required (title, genre, year, rating)' });

  movie.title = title;
  movie.genre = genre;
  movie.year = year;
  movie.rating = rating;

  res.json(movie);
});

// ✅ DELETE movie by ID
router.delete('/:id', (req, res) => {
  const index = movies.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Movie not found' });

  const deletedMovie = movies.splice(index, 1);
  res.json(deletedMovie);
});

module.exports = router;
