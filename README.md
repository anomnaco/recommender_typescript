## Quick deploy to Vercel

You can clone & deploy it to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anant/astra-llm-recommendation-typescript)

# Environment Variables

When you deploy with vercel, create envrionment variables via the Vercel UI.

- KEYSPACE=existing Astra keyspace in a vector enables DB
- COLLECTION_NAME=name of a JSON API Astra collection
- OPENAI_API_KEY=api key for OPENAI
- ASTRA_DB_ID=Astra database id
- ASTRA_DB_REGION=Astra database region
- ASTRA_DB_APPLICATION_TOKEN=Generate app token for Astra database

When deploying locally, generate a `.env` file by duplicating content from `.env.example` and replace variables.

# Local Development

To install deps run the following command

```
npm install
```

To start the frontend in a new terminal run the following

```
npm run dev
```
