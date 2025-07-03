def update_fact(fact_id: int, new_fact: str) -> bool:
    try:
        with get_connection() as conn:
            cur = conn.execute('UPDATE cat_facts SET fact = ? WHERE id = ?', (new_fact, fact_id))
            conn.commit()
            return cur.rowcount > 0
    except sqlite3.IntegrityError:
        return False
def clear_facts():
    with get_connection() as conn:
        conn.execute('DELETE FROM cat_facts')
        conn.commit()
def delete_fact(fact_id: int) -> bool:
    with get_connection() as conn:
        cur = conn.execute('DELETE FROM cat_facts WHERE id = ?', (fact_id,))
        conn.commit()
        return cur.rowcount > 0
import sqlite3
from typing import List, Optional, Tuple

import os
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cat_facts.db')

def get_connection():
    return sqlite3.connect(DB_PATH)

def create_table():
    with get_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cat_facts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fact TEXT UNIQUE,
                created_at DATE DEFAULT (DATE('now'))
            );
        ''')
        conn.commit()

def insert_fact(fact: str) -> bool:
    try:
        with get_connection() as conn:
            conn.execute('INSERT INTO cat_facts (fact) VALUES (?)', (fact,))
            conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False


def get_all_facts(limit: int = 5) -> List[Tuple[int, str, str]]:
    with get_connection() as conn:
        return conn.execute('SELECT id, fact, created_at FROM cat_facts ORDER BY id DESC LIMIT ?', (limit,)).fetchall()



def get_random_fact() -> Optional[str]:
    with get_connection() as conn:
        row = conn.execute('SELECT fact FROM cat_facts ORDER BY RANDOM() LIMIT 1').fetchone()
        return row[0] if row else None
