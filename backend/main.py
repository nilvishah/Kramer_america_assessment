from fastapi import FastAPI, Form, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from db import create_table, get_all_facts, get_random_fact, insert_fact, delete_fact, update_fact, like_fact, get_liked_facts, unlike_fact


import json
import redis
from fastapi.responses import JSONResponse
import requests

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Likes Endpoints ---
from fastapi import HTTPException

@app.post("/likes")
def like_a_fact(data: dict = Body(...)):
    fact_id = data.get("fact_id")
    if not fact_id:
        raise HTTPException(status_code=400, detail="fact_id is required")
    if like_fact(fact_id):
        r.delete("all_facts")
        return {"message": "Fact liked!"}
    else:
        return JSONResponse(status_code=409, content={"message": "Already liked or invalid fact."})

@app.get("/likes")
def get_likes():
    likes = get_liked_facts()
    # Each row: (like_id, fact_id, fact, created_at, liked_at)
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

@app.delete("/likes/{fact_id}")
def unlike_a_fact(fact_id: int = Path(...)):
    if unlike_fact(fact_id):
        r.delete("all_facts")  # 🧹 Clear cache
        return {"message": "Fact unliked!"}
    else:
        return JSONResponse(status_code=404, content={"message": "Like not found."})


# Connect to Redis (host='redis' for Docker Compose, 'localhost' for local dev)
import os
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
r = redis.Redis(host=REDIS_HOST, port=6379, decode_responses=True)



@app.on_event("startup")
def startup():
    create_table()



@app.get("/catfacts")
def read_cat_facts():
    cached = r.get("all_facts")
    if cached:
        print("Serving all facts from Redis cache!")
        return json.loads(cached)
    facts = get_all_facts()
    result = [{"id": row[0], "fact": row[1], "created_at": row[2]} for row in facts]
    r.setex("all_facts", 60, json.dumps(result))  # cache for 60 seconds
    print("Serving all facts from DB and caching in Redis!")
    return result



@app.get("/catfacts/random")
def random_cat_fact():
    cached = r.get("random_fact")
    if cached:
        print("Serving from Redis cache!")
        return {"fact": cached, "source": "redis"}
    fact = get_random_fact()
    if fact:
        r.setex("random_fact", 60, fact)  # cache for 60 seconds
        print("Serving fresh from DB!")
        return {"fact": fact, "source": "db"}
    return JSONResponse(status_code=404, content={"error": "No facts found."})



@app.post("/catfacts")
def add_cat_fact(fact: str = Form(...)):
    if not fact or not fact.strip():
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})
    if insert_fact(fact):
        r.delete("all_facts")  # 🧹 Clear cache
        return {"message": "Fact added!"}
    else:
        return JSONResponse(status_code=409, content={"message": "Duplicate fact."})


@app.delete("/catfacts/{fact_id}")
def delete_cat_fact(fact_id: int = Path(...)):
    if delete_fact(fact_id):
        r.delete("all_facts")
        return {"message": "Fact deleted!"}
    else:
        return JSONResponse(status_code=404, content={"message": "Fact not found."})


@app.put("/catfacts/{fact_id}")
def update_cat_fact(fact_id: int = Path(...), data: dict = Body(...)):
    new_fact = data.get("fact", "").strip()
    if not new_fact:
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})
    if update_fact(fact_id, new_fact):
        r.delete("all_facts")  # 🧹 Clear cache
        return {"success": True, "message": "Fact updated!"}
    else:
        return JSONResponse(status_code=409, content={"message": "Duplicate or not found."})

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
                return {"fact": fact, "message": "Fact added!"}
            else:
                return JSONResponse(status_code=409, content={"message": "Duplicate fact.", "fact": fact})
        else:
            return JSONResponse(status_code=502, content={"message": "Failed to fetch from external API."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})

