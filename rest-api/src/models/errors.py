from pydantic import BaseModel

class ErrorResourceNotFound(BaseModel):
    object: str = "error"
    message: str = "Resource not found"

class ErrorServerError(BaseModel):
    object: str = "error"
    message: str = "Server error"
    exception: str = None
    traceback: str = None
