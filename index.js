import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { getProfiles } from "./controllers/peopledata.js";
import { genQuery } from "./middlewares/bing.js";

const PORT = 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/profiles", genQuery, getProfiles);

app.listen(PORT, () => {
  console.log(`Server's running on port ${PORT}`);
});
