import os
import json
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request
from datetime import datetime

# --- Flask App Initialization ---
app = Flask(__name__)

# --- Environment Variables & Secrets ---
# These are expected to be set in the Vercel project settings
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
ODDS_API_KEY = os.getenv('ODDS_API_KEY')
FIREBASE_SERVICE_ACCOUNT_JSON = os.getenv('FIREBASE_SERVICE_ACCOUNT')

# --- Firebase Initialization ---
# This block should only run once when the serverless function instance starts
try:
    if FIREBASE_SERVICE_ACCOUNT_JSON and not firebase_admin._apps:
        cred_json = json.loads(FIREBASE_SERVICE_ACCOUNT_JSON)
        cred = credentials.Certificate(cred_json)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized for mirror-check.")
except Exception as e:
    print(f"Firebase mirror-check initialization error: {e}")

def send_telegram_alert(message):
    """Sends a message to a predefined Telegram chat."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram secrets not found. Skipping alert.")
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {'chat_id': TELEGRAM_CHAT_ID, 'text': message, 'parse_mode': 'Markdown'}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("Telegram alert sent successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send Telegram alert: {e}")

def log_to_firestore(bet_data):
    """Logs the betting opportunity to the 'PublicLedger' collection in Firestore."""
    if not firebase_admin._apps:
        print("Firebase not initialized. Skipping Firestore log.")
        return
    try:
        db = firestore.client()
        doc_ref = db.collection('PublicLedger').document()
        bet_data['timestamp'] = firestore.SERVER_TIMESTAMP
        doc_ref.set(bet_data)
        print(f"Successfully logged to Firestore: {bet_data.get('event_id', 'N/A')}")
    except Exception as e:
        print(f"Error logging to Firestore: {e}")

@app.route('/', methods=['GET'])
def mirror_check_handler():
    """
    Flask route handler for the Vercel Serverless Function.
    """
    if not ODDS_API_KEY:
        return jsonify({"error": "ODDS_API_KEY is not configured."}), 500

    # --- 1. Fetch Live Odds ---
    SPORT, REGIONS, MARKETS, ODDS_FORMAT = 'soccer_epl', 'uk', 'h2h', 'decimal'
    api_url = f"https://api.the-odds-api.com/v4/sports/{SPORT}/odds/?apiKey={ODDS_API_KEY}&regions={REGIONS}&markets={MARKETS}&oddsFormat={ODDS_FORMAT}"

    try:
        odds_response = requests.get(api_url)
        odds_response.raise_for_status()
        odds_data = odds_response.json()
        print(f"Successfully fetched {len(odds_data)} events from The Odds API.")
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch from The Odds API: {e}"}), 500

    # --- 2. Analyze for "High-Signal" Opportunities (odds > 3.0) ---
    high_signal_bets = []
    for event in odds_data:
        for bookmaker in event.get('bookmakers', []):
            for market in bookmaker.get('markets', []):
                for outcome in market.get('outcomes', []):
                    if outcome['price'] > 3.0:
                        high_signal_bets.append({
                            "event_id": event['id'],
                            "sport": event['sport_title'],
                            "home_team": event['home_team'],
                            "away_team": event['away_team'],
                            "bookmaker": bookmaker['title'],
                            "market": market['key'],
                            "outcome_name": outcome['name'],
                            "odds": outcome['price'],
                            "scheduled_at": datetime.fromisoformat(event['commence_time'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S UTC')
                        })

    # --- 3. Log to Firestore and Alert on Telegram ---
    if high_signal_bets:
        print(f"Found {len(high_signal_bets)} high-signal bets.")
        bet_to_process = high_signal_bets[0]
        log_to_firestore(bet_to_process)

        message = (
            f"🚀 *High-Signal Bet Alert!* 🚀\n\n"
            f"**Event:** {bet_to_process['home_team']} vs {bet_to_process['away_team']}\n"
            f"**Sport:** {bet_to_process['sport']}\n"
            f"**Bet:** {bet_to_process['outcome_name']} to win\n"
            f"**Odds:** *{bet_to_process['odds']}*\n"
            f"**Bookmaker:** {bet_to_process['bookmaker']}\n"
            f"**Match Time:** {bet_to_process['scheduled_at']}"
        )
        send_telegram_alert(message)

    # --- 4. Send HTTP Response ---
    return jsonify({
        "status": "success",
        "found_opportunities": len(high_signal_bets),
        "processed_bet": high_signal_bets[0] if high_signal_bets else None
    })

# The 'app' object is the WSGI entry point for Vercel.
# The following block is for local development and will not run on Vercel.
if __name__ == '__main__':
    app.run(debug=True, port=8000)
