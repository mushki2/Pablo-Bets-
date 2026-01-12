# SocialBet Setup Checklist: GitHub Secrets

To successfully deploy and run the SocialBet application, you must configure the following secrets in your GitHub repository's settings. Go to `Settings > Secrets and variables > Actions` and create a new repository secret for each item on this list.

### 1. `VERCEL_DEPLOYMENT_URL`
This secret is used by the GitHub Action workflow (`.github/workflows/cron.yml`) to trigger your Vercel serverless function periodically.

-   **Description**: The full public URL of your Vercel deployment.
-   **Example Value**: `https://socialbet-your-username.vercel.app`
-   **How to get it**: After you deploy your project to Vercel for the first time, Vercel will assign you a public URL. Use that URL here.

### 2. `TELEGRAM_BOT_TOKEN`
This secret is used by the Python serverless function (`api/mirror-check.py`) to send alerts through your Telegram bot.

-   **Description**: The authentication token for your Telegram Bot.
-   **How to get it**:
    1.  Talk to the [BotFather](https://t.me/botfather) on Telegram.
    2.  Create a new bot by sending the `/newbot` command.
    3.  Follow the instructions and BotFather will give you a token.

### 3. `TELEGRAM_CHAT_ID`
The Python function needs to know which chat to send the alert messages to.

-   **Description**: The unique identifier for the Telegram chat, group, or channel where the bot will send alerts.
-   **How to get it**:
    1.  Add your bot to the desired group or channel.
    2.  Send a message to the bot (e.g., `/my_id`) in that chat.
    3.  You can find the chat ID by visiting `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`. Look for the `chat` object in the JSON response.

### 4. `ODDS_API_KEY`
The Python function uses this key to authenticate with The Odds API and fetch live sports betting odds.

-   **Description**: Your personal API key for The Odds API.
-   **How to get it**: Sign up for a free or paid plan on [The Odds API website](https://the-odds-api.com/). Your API key will be available in your user dashboard.

### 5. `FIREBASE_SERVICE_ACCOUNT`
This secret allows the Python function to securely authenticate with your Firebase project to log data to Firestore.

-   **Description**: A JSON object containing the credentials for a Firebase service account.
-   **How to get it**:
    1.  Open your Firebase project console.
    2.  Go to `Project settings` (click the gear icon).
    3.  Navigate to the `Service accounts` tab.
    4.  Click the "Generate new private key" button. A JSON file will be downloaded.
-   **IMPORTANT**: Copy the *entire contents* of the downloaded JSON file and paste it as the value for this GitHub secret. It's a multi-line value, and GitHub Secrets supports that.
