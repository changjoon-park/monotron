from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src import main
from backend.models import base

# Create a router
router = APIRouter(
    prefix="/api",
    tags=["main"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_class=JSONResponse)
async def check_connection():
    message = main.check_connection()
    data = base.ConnectionStatus(**message)

    return data
