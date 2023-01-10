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

  const { ingreds, cuisine, meal } = req.body
  // const animal = req.body.animal || '';
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid animal",
  //     }
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createCompletion({
      model: "text-curie-001",
      prompt: generatePrompt(ingreds, cuisine, meal),
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

function generatePrompt(ingreds, cuisine, meal) {
  console.log({ ingreds, cuisine, meal })
  debugger;
  // animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `I am a recipe generator. Tell me a cuisine, meal type, and what ingredients you have. I will tell you what dish you can make using those ingredients.
  Q: I have potatoes, chicken, spinach, cucumber, butter, oil, tomatoes, onion, garlic. What Russian dish can I make for dinner?
  A: With the ingredients you have on hand, you could make a dish called "Chicken Potato Spinach Bake".
  Q: I have sweet potatoes, beef, lamb, peas, lettuce, butter, tomatoes, broccoli, spaghetti. What Japanese dish can I make for lunch?
  A: With those ingredients, you could make a dish called "Yaki Udon" It's a stir-fried udon dish that commonly made with vegetables and meat. It's a flavorful, hearty and comforting dish that can be prepared in a short time.
  It's typically made with udon noodles, but you can use spaghetti instead as a replacement. Just be sure to cook the spaghetti al dente before stir-frying it with the other ingredients.
  You can use beef or lamb as your main protein source, but you can also add some sliced or diced sweet potatoes as a replacement of regular potatoes, also you can add some peas and broccoli to make it more healthy.
  Q: I have ${ingreds}. What ${cuisine} dish can I make for ${meal}?
  A: 
  `;
}
