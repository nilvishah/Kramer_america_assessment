import sqlite3
import csv

# Paths for database and CSV export
DB_PATH = 'cat_facts.db'
CSV_PATH = 'cat_facts_export.csv'

# Export cat facts from SQLite to CSV
def export_to_csv(db_path=DB_PATH, csv_path=CSV_PATH):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Fetch all facts
        cursor.execute('SELECT id, fact, created_at FROM cat_facts')
        rows = cursor.fetchall()

        # Write to CSV
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'fact', 'created_at'])  # CSV Header
            writer.writerows(rows)

        print(f'✅ Exported {len(rows)} facts to "{csv_path}"')

    except sqlite3.Error as e:
        print(f'❌ Database error: {e}')
    except Exception as e:
        print(f'❌ Unexpected error: {e}')
    finally:
        # Always close the connection
        if conn:
            conn.close()

# Run when executed directly
if __name__ == '__main__':
    export_to_csv()
