import sqlite3
import csv

DB_PATH = 'cat_facts.db'
CSV_PATH = 'cat_facts_export.csv'

def export_to_csv(db_path=DB_PATH, csv_path=CSV_PATH):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT id, fact, created_at FROM cat_facts')
    rows = cursor.fetchall()
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'fact', 'created_at'])
        writer.writerows(rows)
    print(f'Exported {len(rows)} facts to {csv_path}')
    conn.close()

if __name__ == '__main__':
    export_to_csv()
