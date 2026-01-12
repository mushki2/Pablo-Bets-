# Pablo-Bets Setup Checklist: Vercel & GitHub Actions

To successfully deploy and run the Pablo-Bets application, you need to configure secrets in your Vercel project and in your GitHub repository.

### Part 1: Configure Vercel Environment Variables

The Python serverless function (`api/mirror-check.py`) requires the following secrets to be set as Environment Variables in your Vercel project.

**Instructions:**
1.  Go to your project's dashboard on Vercel.
2.  Navigate to the **"Settings"** tab.
3.  Click on **"Environment Variables"** in the left sidebar.
4.  Add each of the following secrets, making sure they are available to the Serverless Function.

---

**1. `TELEGRAM_BOT_TOKEN`**
-   **Description**: The authentication token for your Telegram Bot.
-   **How to get it**: Get it from **@BotFather** on Telegram.

**2. `TELEGRAM_CHAT_ID`**
-   **Description**: The unique ID for the Telegram chat where the bot will send alerts.
-   **How to get it**: Find the chat ID by sending a message to your bot and checking the `getUpdates` endpoint.

**3. `ODDS_API_KEY`**
-   **Description**: Your personal API key for The Odds API.
-   **How to get it**: Sign up on [The Odds API website](https://the-odds-api.com/).

**4. `FIREBASE_SERVICE_ACCOUNT`**
-   **Description**: The JSON credentials for your Firebase service account.
-   **How to get it**: Generate a new private key in your Firebase project settings under "Service accounts". Copy the entire JSON content.

---

### Part 2: Configure GitHub Actions Secret

The GitHub Actions workflow requires a secret to know the URL of your Vercel deployment.

**Instructions:**
1.  Go to your GitHub repository.
2.  Navigate to **"Settings"** > **"Secrets and variables"** > **"Actions"**.
3.  Click the **"New repository secret"** button.
4.  Create the following secret:

**1. `VERCEL_DEPLOYMENT_URL`**
-   **Name**: `VERCEL_DEPLOYMENT_URL`
-   **Value**: `https://your-project-name.vercel.app` (Replace with your actual Vercel deployment URL).

Your application is now fully configured! The GitHub Action will now run every 15 minutes to trigger your API.
