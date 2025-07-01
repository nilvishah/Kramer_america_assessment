import requests
from db import create_table, insert_fact

def fetch_cat_fact():
    url = 'https://catfact.ninja/fact'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('fact')
    return None

def main():
    create_table()
    facts_added = 0
    attempts = 0
    while facts_added < 5 and attempts < 15:
        fact = fetch_cat_fact()
        if fact:
            if insert_fact(fact):
                print(f"Inserted: {fact}")
                facts_added += 1
            else:
                print(f"Skipped (duplicate): {fact}")
        attempts += 1
    if facts_added < 5:
        print(f"Only {facts_added} unique facts could be added after {attempts} attempts.")

if __name__ == '__main__':
    main()
