from fastapi import FastAPI, Form, Path, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import redis
import json
import os

# Database functions
from db import (
    create_table, get_all_facts, get_random_fact, insert_fact,
    delete_fact, update_fact, like_fact, get_liked_facts, unlike_fact
)

# -------------------------------
# App Initialization & CORS Setup
# -------------------------------
app = FastAPI()

# Allow frontend to access backend resources
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Redis Caching Setup
# -------------------------------
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
r = redis.Redis(host=REDIS_HOST, port=6379, decode_responses=True)

# Define keys used for Redis caching
ALL_FACTS_KEY = "all_facts"
RANDOM_FACT_KEY = "random_fact"

# Clear Redis cache when needed (reused across endpoints)
def clear_facts_cache():
    r.delete(ALL_FACTS_KEY)

# -------------------------------
# Database Table Creation
# -------------------------------
@app.on_event("startup")
def startup():
    create_table()  # Create tables on app startup (if not exists)

# -------------------------------
# Likes Endpoints
# -------------------------------

# Like a cat fact
@app.post("/likes")
def like_a_fact(data: dict = Body(...)):
    fact_id = data.get("fact_id")
    if not fact_id:
        raise HTTPException(status_code=400, detail="fact_id is required")
    if like_fact(fact_id):
        clear_facts_cache()
        return {"success": True, "message": "Fact liked!"}
    return JSONResponse(status_code=409, content={"message": "Already liked or invalid fact."})

# Get all liked cat facts
@app.get("/likes")
def get_likes():
    likes = get_liked_facts()
    return [
        {
            "like_id": row[0],
            "fact_id": row[1],
            "fact": row[2],
            "created_at": row[3],
            "liked_at": row[4],
        }
        for row in likes
    ]

# Unlike a cat fact
@app.delete("/likes/{fact_id}")
def unlike_a_fact(fact_id: int = Path(...)):
    if unlike_fact(fact_id):
        clear_facts_cache()
        return {"success": True, "message": "Fact unliked!"}
    return JSONResponse(status_code=404, content={"message": "Like not found."})

# -------------------------------
# Cat Fact API Endpoints
# -------------------------------

# Get all cat facts (cached)
@app.get("/catfacts")
def read_cat_facts():
    cached = r.get(ALL_FACTS_KEY)
    if cached:
        print("🚀 Serving all facts from Redis cache!")
        return json.loads(cached)

    facts = get_all_facts()
    result = [{"id": row[0], "fact": row[1], "created_at": row[2]} for row in facts]
    r.setex(ALL_FACTS_KEY, 60, json.dumps(result))  # Cache for 60s
    print("📦 Fetched from DB and cached.")
    return result

# Get one random cat fact (cached)
@app.get("/catfacts/random")
def random_cat_fact():
    cached = r.get(RANDOM_FACT_KEY)
    if cached:
        print("🚀 Serving random fact from Redis cache!")
        return {"fact": cached, "source": "redis"}

    fact = get_random_fact()
    if fact:
        r.setex(RANDOM_FACT_KEY, 60, fact)
        return {"fact": fact, "source": "db"}
    return JSONResponse(status_code=404, content={"error": "No facts found."})

# Add a new cat fact (form-based input)
@app.post("/catfacts")
def add_cat_fact(fact: str = Form(...)):
    if not fact or not fact.strip():
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})

    if insert_fact(fact):
        clear_facts_cache()
        return {"success": True, "message": "Fact added!"}
    return JSONResponse(status_code=409, content={"message": "Duplicate fact."})

# Delete a cat fact by ID
@app.delete("/catfacts/{fact_id}")
def delete_cat_fact(fact_id: int = Path(...)):
    if delete_fact(fact_id):
        clear_facts_cache()
        return {"success": True, "message": "Fact deleted!"}
    return JSONResponse(status_code=404, content={"message": "Fact not found."})

# Update a fact by ID
@app.put("/catfacts/{fact_id}")
def update_cat_fact(fact_id: int = Path(...), data: dict = Body(...)):
    new_fact = data.get("fact", "").strip()
    if not new_fact:
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})

    if update_fact(fact_id, new_fact):
        clear_facts_cache()
        return {"success": True, "message": "Fact updated!"}
    return JSONResponse(status_code=409, content={"message": "Duplicate or not found."})

# Fetch and insert a random cat fact from external API
@app.post("/catfacts/fetch_external")
def fetch_external_cat_fact():
    url = 'https://catfact.ninja/fact'
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            fact = response.json().get('fact')
            if not fact:
                return JSONResponse(status_code=500, content={"message": "No fact found in response."})

            if insert_fact(fact):
                return {"success": True, "fact": fact, "message": "Fact added!"}
            return JSONResponse(status_code=409, content={"message": "Duplicate fact.", "fact": fact})
        return JSONResponse(status_code=502, content={"message": "Failed to fetch from external API."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})