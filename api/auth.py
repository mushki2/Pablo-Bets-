import os
import json
from flask import Flask, request, jsonify
from urllib.parse import parse_qsl
import hmac
import hashlib
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, auth

# --- Flask App Initialization ---
app = Flask(__name__)

# --- Environment Variables & Secrets ---
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
FIREBASE_SERVICE_ACCOUNT_JSON = os.getenv('FIREBASE_SERVICE_ACCOUNT')

# --- Firebase Initialization ---
try:
    if FIREBASE_SERVICE_ACCOUNT_JSON and not firebase_admin._apps:
        cred_json = json.loads(FIREBASE_SERVICE_ACCOUNT_JSON)
        cred = credentials.Certificate(cred_json)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized for auth.")
except Exception as e:
    print(f"Firebase auth initialization error: {e}")

def is_valid_telegram_data(init_data: str, bot_token: str) -> bool:
    """
    Validates the initData string from Telegram WebApp against the bot token.
    """
    try:
        parsed_data = dict(parse_qsl(init_data))
        received_hash = parsed_data.pop('hash')

        # 1. Check timestamp: reject data older than 24 hours
        auth_date = int(parsed_data.get('auth_date', 0))
        if datetime.utcnow() - datetime.utcfromtimestamp(auth_date) > timedelta(hours=24):
            print("Validation error: initData is outdated.")
            return False

        # 2. Verify hash
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed_data.items()))

        secret_key = hmac.new("WebAppData".encode(), bot_token.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        return calculated_hash == received_hash
    except (KeyError, ValueError, TypeError) as e:
        print(f"Validation error: {e}")
        return False

@app.route('/', methods=['POST'])
def verify_telegram_auth():
    """
    Handles the silent authentication request from the frontend.
    """
    try:
        data = request.json
        init_data = data.get('initData')

        if not init_data or not BOT_TOKEN:
            return jsonify({"error": "Missing initData or bot token configuration."}), 400

        # 1. Validate the Telegram hash
        if not is_valid_telegram_data(init_data, BOT_TOKEN):
            return jsonify({"error": "Invalid Telegram data: hash verification failed."}), 403

        # 2. Extract user ID and create Firebase custom token
        user_data = dict(parse_qsl(init_data))
        user_info = json.loads(user_data.get('user', '{}'))
        user_id = user_info.get('id')

        if not user_id:
            return jsonify({"error": "User ID not found in initData."}), 400

        # Create a custom token for Firebase Authentication
        custom_token = auth.create_custom_token(str(user_id))

        return jsonify({"firebase_token": custom_token.decode('utf-8')})

    except Exception as e:
        print(f"An unexpected error occurred in /api/auth: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# The 'app' object is the WSGI entry point for Vercel.
if __name__ == '__main__':
    app.run(debug=True, port=8001)
