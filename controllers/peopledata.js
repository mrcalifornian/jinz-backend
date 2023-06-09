import PDLJS from "peopledatalabs";
import "dotenv/config";

const PDLClient = new PDLJS({
  apiKey: process.env.PDL,
});

export const getProfiles = async (req, res, next) => {
  try {
    let esQuery = req.query;

    const params = {
      dataset: "all",
      searchQuery: esQuery,
      size: parseInt(process.env.SIZE),
      pretty: true,
      titleeCase: true,
    };

    const response = await PDLClient.person.search.elastic(params);
    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};
