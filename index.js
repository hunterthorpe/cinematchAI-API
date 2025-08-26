const suggest = require('./suggest').handler;
const search = require('./search').handler;
const details = require('./details').handler;

exports.handler = async (event, context) => {
  const path = event.requestContext.http.path;      // e.g., /suggest
  const method = event.requestContext.http.method;  // e.g., POST, GET

  try {
    if (path === '/suggest' && method === 'POST') {
      return suggest(event, context);
    } else if (path === '/search' && method === 'GET') {
      return search(event, context);
    } else if (path === '/details' && method === 'POST') {
      return details(event, context);
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' })
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};