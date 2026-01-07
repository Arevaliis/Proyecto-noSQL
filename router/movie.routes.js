const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        return res.status(200).json("Welcome to API Movies !! ")
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        return movies.length === 0 
            ? res.status(404).json('No movies found') 
            : res.status(200).json(movies);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/movies/id/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const movie = await Movie.findById(id);
        return movie 
            ? res.status(200).json(movie) 
            : res.status(404).json('No movie found by this id');
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get('/movies/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const movieByTitle = await Movie.find({ title });
        return movieByTitle.length === 0 
            ? res.status(404).json('No movie found by this title') 
            : res.status(200).json(movieByTitle);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get('/movies/genre/:genre', async (req, res) => {
    const { genre } = req.params;

    try {
        const movieByGenre = await Movie.find({ genre });
        return movieByGenre.length === 0 
            ? res.status(404).json('No movie found by this genre') 
            : res.status(200).json(movieByGenre);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get('/movies/year/:year', async (req, res) => {
    const { year } = req.params;

    try {
        const movieByYear = await Movie.find({ year: { $gt: year } });
        return movieByYear.length === 0 
            ? res.status(404).json('No movie found by this year') 
            : res.status(200).json(movieByYear);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.post('/movies/create', async (req, res, next) => {
    try {
        const newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            genre: req.body.genre
        });

        const createdMovie = await newMovie.save();
        return res.status(201).json(createdMovie);
    } catch (error) {
        next(error.message);
    }
});

router.delete('/movies/delete/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        await Movie.findByIdAndDelete(id);
        return res.status(200).json('Movie deleted!');
    } catch (error) {
        return next(error.message);
    }
});

router.put('/movies/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params 
        const movieModify = new Movie(req.body) 
        movieModify._id = id 
        const movieUpdated = await Movie.findByIdAndUpdate(id , movieModify)
        return res.status(200).json(movieUpdated)
    } catch (error) {
        return next(error.message)
    }
});

module.exports = router;