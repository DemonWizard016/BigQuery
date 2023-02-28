import express from "express";
import cors from "cors";
import "./big_query.js";
import * as dotenv from 'dotenv';

import address_search_router from './router/address_search.js';
// get .env configuration
dotenv.config();

//App initialization
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Set router
app.use("/address-search", address_search_router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
