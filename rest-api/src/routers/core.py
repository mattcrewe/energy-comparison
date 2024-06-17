from fastapi import APIRouter, Request
from src.models.errors import ErrorResourceNotFound, ErrorServerError


core_router = APIRouter(
    prefix="",
    tags=["API Core"],
    responses={
        404: {"model": ErrorResourceNotFound},
        500: {"model": ErrorServerError}
    },
)

@core_router.get("/")
def root(request: Request):
    return {"message": "/ root res", "root_path": request.scope.get("root_path")}

