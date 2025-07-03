from fastapi import FastAPI, Form, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from db import create_table, get_all_facts, get_random_fact, insert_fact, delete_fact, update_fact
import json
import redis
from fastapi.responses import JSONResponse
import requests



app = FastAPI()

# Connect to Redis (host='redis' for Docker Compose)
r = redis.Redis(host='redis', port=6379, decode_responses=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        return {"message": "Fact added!"}
    else:
        return JSONResponse(status_code=409, content={"message": "Duplicate fact."})


@app.delete("/catfacts/{fact_id}")
def delete_cat_fact(fact_id: int = Path(...)):
    if delete_fact(fact_id):
        return {"message": "Fact deleted!"}
    else:
        return JSONResponse(status_code=404, content={"message": "Fact not found."})


@app.put("/catfacts/{fact_id}")
def update_cat_fact(fact_id: int = Path(...), data: dict = Body(...)):
    new_fact = data.get("fact", "").strip()
    if not new_fact:
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})
    if update_fact(fact_id, new_fact):
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

