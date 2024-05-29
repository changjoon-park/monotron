import uvicorn

from apis import create_app
from fastapi.responses import JSONResponse

HOST = "127.0.0.1"
PORT = 4040

app = create_app()


@app.get("/", response_class=JSONResponse)
async def read_root():
    return {"message": "Connection to FastAPI Server established."}


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
