# Pablo-Bets Setup Checklist: Vercel & Uptime Robot

To successfully deploy and run the Pablo-Bets application, you need to configure secrets in your Vercel project and set up an Uptime Robot monitor to trigger the API.

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
-   **How to get it**:
    1.  Talk to the **@BotFather** on Telegram.
    2.  Use the `/newbot` command to create a new bot.
    3.  The BotFather will give you a token. Copy and paste it here.

**2. `TELEGRAM_CHAT_ID`**

-   **Description**: The unique identifier for the Telegram chat, group, or channel where the bot will send alerts.
-   **How to get it**:
    1.  Add your bot to the desired group or channel.
    2.  Send a message like `/my_id` in that chat.
    3.  Find the chat ID by visiting `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`. Look for the `chat` object in the JSON response.

**3. `ODDS_API_KEY`**

-   **Description**: Your personal API key for The Odds API.
-   **How to get it**: Sign up on [The Odds API website](https://the-odds-api.com/). Your API key will be in your user dashboard.

**4. `FIREBASE_SERVICE_ACCOUNT`**

-   **Description**: A JSON object containing the credentials for a Firebase service account, which allows the backend to securely connect to Firestore.
-   **How to get it**:
    1.  Open your Firebase project console.
    2.  Go to **Project settings** > **Service accounts**.
    3.  Click **"Generate new private key"**. A JSON file will be downloaded.
-   **IMPORTANT**: Copy the *entire contents* of the downloaded JSON file and paste it as the value for this environment variable.

---

### Part 2: Set Up Uptime Robot

To trigger your API every 15 minutes, use an external service like Uptime Robot.

**Instructions:**
1.  **Sign up** for a free account at [UptimeRobot.com](https://uptimerobot.com/).
2.  Click **"+ Add New Monitor"**.
3.  Set the **Monitor Type** to **"HTTP(s)"**.
4.  **Friendly Name**: `Pablo-Bets Mirror Check`
5.  **URL (or IP)**: `https://your-project-name.vercel.app/api/mirror-check` (Replace with your actual Vercel deployment URL).
6.  **Monitoring Interval**: **15 minutes**.
7.  Click **"Create Monitor"**.

Your application is now fully configured!
