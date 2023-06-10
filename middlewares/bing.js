import { BingChat } from "bing-chat";
import "dotenv/config";

const api = new BingChat({
  cookie: process.env.BING,
});

export const genQuery = async (req, res, next) => {
  const timeoutDuration = 30 * 1000;

  function sendMessageWithTimeout(fullPrompt, options) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeoutDuration);

      api
        .sendMessage(fullPrompt, options)
        .then((response) => {
          clearTimeout(timeout);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  try {
    let prompt = req.body.prompt;

    console.log(prompt);
    if (prompt === undefined) {
      const error = new Error("No prompt provided");
      throw error;
    }

    let fullPrompt = `You are an professional software engineer with many years of experince. And your current task is to generate an elastic search v7 query for this prompt: "${prompt}", using only the fields provided in the example user model below. \n\nAny small mistake like using not present fields in your query, since it will impact to your reputation. \n\n
        If the prompt requires to search for fields not present in the model, just skip them, For example years of experinece.
        Model:
    {
      industry: "business supplies and equipment",
      job_title: "developer",
      job_title_role: "engineering",
      job_title_levels: ["senior"],
      skills: [
        "illustrator",
        "web design",
        "css",
        "wordpress",
      ],
      job_company_name: "bitwise industries",
      job_company_website: "bitwiseindustries.com",
      job_company_industry: "information technology and services",
      job_company_location_name: "fresno, california, united states",
      location_locality: "beaverton",
      location_region: "oregon",
      location_country: "united states",
      location_continent: "north america",
    }`;

    const resp = await sendMessageWithTimeout(fullPrompt, {
      variant: "precise",
    });

    let queryText = resp.text;

    const jsonStartIndex = queryText.indexOf("{");
    const jsonEndIndex = queryText.lastIndexOf("}");
    const eQuery = queryText.slice(jsonStartIndex, jsonEndIndex + 1);

    req.query = eQuery;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};
