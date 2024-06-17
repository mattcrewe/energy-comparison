import traceback

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.models.errors import ErrorResourceNotFound, ErrorServerError
from src.routers.core import core_router
from src.routers.auth import router as auth_router
from src.routers.supplier import router as supplier_router
from src.routers.profile import router as profile_router

title = "Energy Comparison API"
version = "1.0.0"
description = """
API to facilitate an app for users to rate energy providers based on service and pricing.
"""
tags_metadata = []

app = FastAPI(
    title=title,
    description=description,
    version=version,
    openapi_tags=tags_metadata,
    openapi_url="/openapi.json",
    docs_url="/swagger",
    redoc_url=None,
    root_path="/api/v1",
    responses={
        404: {"model": ErrorResourceNotFound},
        500: {"model": ErrorServerError}
    },
)

@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: Exception):

    error = ErrorResourceNotFound()

    return JSONResponse(status_code=404, content=error.model_dump())

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):

    error = ErrorServerError(
        exception=str(exc),
        traceback=traceback.format_exc()
    )

    return JSONResponse(status_code=500, content=error.model_dump())

app.include_router(core_router)
app.include_router(auth_router)
app.include_router(supplier_router)
app.include_router(profile_router)

def main_dev():
    uvicorn.run(
        "fastapi_backend:app",
        host="0.0.0.0",
        port=80,
        log_level="debug",
        reload=True, # dev only
        root_path="/api/v1"
    )

def main_prod():
    uvicorn.run(
        "fastapi_backend:app",
        host="0.0.0.0",
        port=80,
        log_level="info",
        root_path="/api/v1"
    )