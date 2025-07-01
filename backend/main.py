from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from db import create_table, get_all_facts, get_random_fact, insert_fact
from fastapi.responses import JSONResponse

app = FastAPI()

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
    facts = get_all_facts()
    return [
        {"id": row[0], "fact": row[1], "created_at": row[2]} for row in facts
    ]

@app.get("/catfacts/random")
def random_cat_fact():
    fact = get_random_fact()
    if fact:
        return {"fact": fact}
    return JSONResponse(status_code=404, content={"error": "No facts found."})

@app.post("/catfacts")
def add_cat_fact(fact: str = Form(...)):
    if not fact or not fact.strip():
        return JSONResponse(status_code=400, content={"message": "Fact cannot be empty."})
    if insert_fact(fact):
        return {"message": "Fact added!"}
    else:
        return JSONResponse(status_code=409, content={"message": "Duplicate fact."})
