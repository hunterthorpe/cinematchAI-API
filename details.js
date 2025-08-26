const fetch = require('node-fetch');
const TMDB_API_KEY = process.env.TMDB_API_KEY;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { title, year, includePoster } = body;
    if (!title) return { statusCode: 400, body: JSON.stringify({ message: 'Title required.' }) };

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const data = await (await fetch(url)).json();

    if (!data.results || data.results.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ overview: "No description found.", posterUrl: null }) };
    }

    const movie = data.results[0];
    const posterUrl = includePoster && movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

    return { statusCode: 200, body: JSON.stringify({ overview: movie.overview, posterUrl }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to get movie details.' }) };
  }
};