import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { cuisine1, cuisine2, meal } = req.body

  try {
    const completion = await openai.createCompletion({
      model: "text-babbage-001",
      prompt: generatePrompt(cuisine1, cuisine2, meal),
      temperature: 0.6,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(cuisine1, cuisine2, meal) {
  return `I am a fusion recipe generator. Give me two cuisines and a meal type. I will tell you what dish you can make combining those cuisines.
  Q: Tell me a dish that combines Indian and Japanese cuisines for lunch.
  A: One dish that combines Indian and Japanese cuisine for lunch could be a Indian-style Curry Rice Bowl. This dish typically features a Japanese style steamed white rice, topped with a flavorful Indian-style curry made with a blend of spices such as turmeric, cumin, and coriander. The curry is usually made with vegetables or meat, and it's typically served with some pickles or chutneys.
  This dish is a fusion of two different cuisines and it's quite popular in many places around the world.
  Q: Tell me a dish that combines Chinese and Mediterranean cuisines for dinner.
  A: One dish that combines Chinese and Mediterranean cuisine could be a stir-fry dish that uses Mediterranean ingredients such as olives, tomatoes, and feta cheese, paired with Chinese stir-fry techniques and flavors, such as ginger, garlic, and soy sauce.
  Q: Tell me a dish that combines ${cuisine1} and ${cuisine2} for ${meal}.
  A: 
  `;
}
