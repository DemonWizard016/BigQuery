import { BigQuery } from "@google-cloud/bigquery";
import * as dotenv from 'dotenv';
// get .env configuration
dotenv.config();

const bigQuery = new BigQuery({
    projectId: process.env.PROJECTID,
    keyFilename: process.env.KEYFILENAME
});
console.log("BigQuery successfully connected!");

export default bigQuery;