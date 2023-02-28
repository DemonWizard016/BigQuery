On GCP: Go to “IAM & Admin” → Service Accounts → Create Service Account
Create a new account and select the appropriate role, e.g., for this article: BigQuery Data Editor + BigQuery User
Select the created service account → Keys → Add Key → Create New Key → Key Type JSON → Download the key

To run
npm install
npm install @babel/node -g
npm start