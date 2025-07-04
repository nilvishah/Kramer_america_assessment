import requests
from db import create_table, insert_fact

# Fetch a single random cat fact from the public API
def fetch_cat_fact():
    url = 'https://catfact.ninja/fact'
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json().get('fact')
        else:
            print(f"⚠️ Failed to fetch fact: Status {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"❌ Request error: {e}")
        return None

# Main function to create tables and populate facts
def main():
    create_table()  # Ensure the database tables exist

    facts_added = 0
    attempts = 0

    while facts_added < 5 and attempts < 15:
        fact = fetch_cat_fact()

        if fact:
            if insert_fact(fact):
                print(f"✅ Inserted: {fact}")
                facts_added += 1
            else:
                print(f"⏭️ Skipped (duplicate): {fact}")
        else:
            print("⚠️ No fact received or request failed.")

        attempts += 1

    if facts_added < 5:
        print(f"⚠️ Only {facts_added} unique facts could be added after {attempts} attempts.")

# Run this script directly
if __name__ == '__main__':
    main()
