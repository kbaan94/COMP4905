import uvicorn
from fastapi import FastAPI
from script import letsRecommend
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#https://fastapi.tiangolo.com/tutorial/cors/?h=+cors#use-corsmiddleware template was used here.
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/recommendationAPI")
def recommendationAPI(song_id: str, numOfRec: Optional[int] = 2):
    return letsRecommend(song_id, numOfRec)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
