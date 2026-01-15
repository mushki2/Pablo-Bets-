import os
from flask import Flask, jsonify
import requests

# --- Flask App Initialization ---
# This app object will be discovered by Vercel
app = Flask(__name__)

# --- Environment Variables & Secrets ---
# In a real scenario, this would be securely stored in environment variables.
# For now, we will use a placeholder and mock data.
ODDS_API_KEY = os.getenv('ODDS_API_KEY', 'YOUR_API_KEY_HERE')

def get_mock_odds_data():
    """
    Returns mock odds data to simulate a response from The Odds API.
    This allows for frontend development without a live API key.
    """
    return [
        {
            "id": "mock-event-1",
            "sport_key": "soccer_epl",
            "commence_time": "2024-08-17T14:00:00Z",
            "home_team": "Manchester United",
            "away_team": "Fulham",
            "bookmakers": [
                {"key": "bookie_a", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 1.85}, {"name": "Under 2.5", "price": 2.15}]}]},
                {"key": "bookie_b", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 1.95}, {"name": "Under 2.5", "price": 2.05}]}]},
                {"key": "bookie_c", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 1.90}, {"name": "Under 2.5", "price": 2.20}]}]},
            ],
        },
        {
            "id": "mock-event-2-arb",
            "sport_key": "soccer_epl",
            "commence_time": "2024-08-18T16:30:00Z",
            "home_team": "Chelsea",
            "away_team": "Manchester City",
            "bookmakers": [
                {"key": "bookie_x", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 2.15}, {"name": "Under 2.5", "price": 1.80}]}]},
                {"key": "bookie_y", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 2.05}, {"name": "Under 2.5", "price": 1.90}]}]},
                {"key": "bookie_z", "markets": [{"key": "h2h", "outcomes": [{"name": "Over 2.5", "price": 1.95}, {"name": "Under 2.5", "price": 2.05}]}]},
            ],
        }
    ]

def find_arbitrage_opportunities(odds_data):
    """
    Scans odds from multiple bookmakers to find arbitrage opportunities.
    An opportunity exists if the sum of the inverse of the odds for all outcomes is less than 1.
    """
    arbitrage_opportunities = []
    for event in odds_data:
        best_odds = {} # {outcome_name: (price, bookmaker_key)}

        # Find the best odds for each outcome across all bookmakers
        for bookmaker in event.get("bookmakers", []):
            for market in bookmaker.get("markets", []):
                for outcome in market.get("outcomes", []):
                    outcome_name = outcome["name"]
                    price = outcome["price"]
                    if outcome_name not in best_odds or price > best_odds[outcome_name][0]:
                        best_odds[outcome_name] = (price, bookmaker["key"])

        # Check for 2-way arbitrage (e.g., Over/Under 2.5)
        if "Over 2.5" in best_odds and "Under 2.5" in best_odds:
            over_price, over_bookie = best_odds["Over 2.5"]
            under_price, under_bookie = best_odds["Under 2.5"]

            # Calculate the arbitrage margin
            margin = (1 / over_price) + (1 / under_price)

            if margin < 1:
                profit_percentage = (1 - margin) * 100
                arbitrage_opportunities.append({
                    "id": event["id"],
                    "match": f"{event['home_team']} vs {event['away_team']}",
                    "profit_percentage": round(profit_percentage, 2),
                    "commence_time": event["commence_time"],
                    "legs": [
                        {"bookmaker": over_bookie, "outcome": "Over 2.5", "odds": over_price},
                        {"bookmaker": under_bookie, "outcome": "Under 2.5", "odds": under_price},
                    ],
                })
    return arbitrage_opportunities


@app.route('/', methods=['GET'])
def get_arbs():
    """
    Vercel entry point for the /api/arbs endpoint.
    Fetches odds and returns a list of arbitrage opportunities.
    """
    # In a real implementation, you would fetch from the live API:
    # url = f"https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey={ODDS_API_KEY}&regions=us&markets=totals"
    # response = requests.get(url)
    # odds_data = response.json()

    # For now, we use mock data.
    odds_data = get_mock_odds_data()

    arbs = find_arbitrage_opportunities(odds_data)

    return jsonify(arbs)

# This is for local development testing if needed
if __name__ == '__main__':
    app.run(debug=True, port=8002)
