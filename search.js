const fetch = require('node-fetch');
const TMDB_API_KEY = process.env.TMDB_API_KEY;

exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters?.query;
    if (!query) return { statusCode: 400, body: JSON.stringify({ message: 'Query is required.' }) };

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const data = await (await fetch(url)).json();

    const uniqueMovies = Array.from(new Map(data.results.map(m => [m.title, m])).values());
    const results = uniqueMovies.map(m => ({
      id: m.id,
      title: m.title,
      year: m.release_date ? m.release_date.substring(0, 4) : 'N/A'
    })).slice(0, 10);

    return { statusCode: 200, body: JSON.stringify(results) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to search movies.' }) };
  }
};