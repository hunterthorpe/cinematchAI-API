const { GoogleGenAI, Type } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let ai;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { movies, exclude = [] } = body;

    if (!ai) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Gemini AI client not initialized.' }) };
    }

    const movieList = movies.map(m => `"${m}"`).join(', ');
    let prompt = `You are a movie recommendation expert. Based on this list: [${movieList}], suggest 5 movies.`;

    if (exclude.length > 0) {
      prompt += ` Do not suggest: [${exclude.map(e => `"${e}"`).join(', ')}].`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              year: { type: Type.NUMBER },
            },
            required: ["title", "year"],
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: response.text,
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to get suggestions.' }) };
  }
};