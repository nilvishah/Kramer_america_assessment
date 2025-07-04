import sqlite3
import os
from typing import List, Optional, Tuple

# Database file path
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cat_facts.db')

# Create and return a database connection
def get_connection():
    return sqlite3.connect(DB_PATH)

# Create database tables if not already present
def create_table():
    with get_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cat_facts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fact TEXT UNIQUE,
                created_at DATE DEFAULT (DATE('now'))
            );
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS liked_facts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fact_id INTEGER UNIQUE,
                liked_at DATE DEFAULT (DATETIME('now')),
                FOREIGN KEY (fact_id) REFERENCES cat_facts(id) ON DELETE CASCADE
            );
        ''')
        conn.commit()

# Insert a new cat fact (skip duplicates)
def insert_fact(fact: str) -> bool:
    try:
        with get_connection() as conn:
            conn.execute('INSERT INTO cat_facts (fact) VALUES (?)', (fact,))
            conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False

# Retrieve all cat facts (default limit: 5)
def get_all_facts(limit: int = 5) -> List[Tuple[int, str, str]]:
    with get_connection() as conn:
        return conn.execute(
            'SELECT id, fact, created_at FROM cat_facts ORDER BY id DESC LIMIT ?',
            (limit,)
        ).fetchall()

# Retrieve a single random cat fact
def get_random_fact() -> Optional[str]:
    with get_connection() as conn:
        row = conn.execute('SELECT fact FROM cat_facts ORDER BY RANDOM() LIMIT 1').fetchone()
        return row[0] if row else None

# Update an existing cat fact
def update_fact(fact_id: int, new_fact: str) -> bool:
    try:
        with get_connection() as conn:
            cur = conn.execute(
                'UPDATE cat_facts SET fact = ? WHERE id = ?',
                (new_fact, fact_id)
            )
            conn.commit()
            return cur.rowcount > 0
    except sqlite3.IntegrityError:
        return False

# Delete a specific cat fact
def delete_fact(fact_id: int) -> bool:
    with get_connection() as conn:
        cur = conn.execute('DELETE FROM cat_facts WHERE id = ?', (fact_id,))
        conn.commit()
        return cur.rowcount > 0

# Clear all cat facts from the database
def clear_facts():
    with get_connection() as conn:
        conn.execute('DELETE FROM cat_facts')
        conn.commit()

# Like a specific cat fact
def like_fact(fact_id: int) -> bool:
    try:
        with get_connection() as conn:
            conn.execute('INSERT INTO liked_facts (fact_id) VALUES (?)', (fact_id,))
            conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False

# Retrieve all liked facts with details
def get_liked_facts() -> list:
    with get_connection() as conn:
        return conn.execute('''
            SELECT liked_facts.id, cat_facts.id as fact_id, cat_facts.fact, cat_facts.created_at, liked_facts.liked_at
            FROM liked_facts
            JOIN cat_facts ON liked_facts.fact_id = cat_facts.id
            ORDER BY liked_facts.liked_at DESC
        ''').fetchall()

# Unlike a specific fact
def unlike_fact(fact_id: int) -> bool:
    with get_connection() as conn:
        cur = conn.execute('DELETE FROM liked_facts WHERE fact_id = ?', (fact_id,))
        conn.commit()
        return cur.rowcount > 0