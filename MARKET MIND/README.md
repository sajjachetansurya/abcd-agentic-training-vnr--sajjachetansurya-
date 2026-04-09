<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5fb073c8-3bdf-4bbd-a6eb-21d3f437c922

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the backend API server:
   `npm run server`
4. Run the frontend app:
   `npm run dev`

When the frontend is running, it will proxy `/api` requests to `http://localhost:4000` and support login, user history, and persistent database storage.
