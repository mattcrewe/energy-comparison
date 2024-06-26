import time

from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

from src.models.user import LoginRequest, User, UserCreate
from src.dal.user import UserDAL
from src.utils.hash_password import password_kdf, generate_password_salt_hash
from src.utils.nanoid import Nanoid
from src.sessions import sessions

router = APIRouter(
    prefix="/auth",
    tags=["User authentication"]
)


@router.get("", response_model=dict)
def check_authentication_status(request: Request):

    session_token = request.cookies.get("session")

    if not session_token:
        return JSONResponse(status_code=401, content={"error": {
            "code": "api_error",
            "type": "unauthenticated",
            "message": "User is not authenticated."
        }})

    user_id = sessions.get_session(session_token)

    if not user_id:
        return JSONResponse(status_code=401, content={"error": {
            "code": "api_error",
            "type": "unauthenticated",
            "message": "User is not authenticated."
        }})

    return {
        "status": "ok"
    }


@router.post("/login", response_model=dict)
def authenticate_user(request: Request, login_request: LoginRequest, response: Response):

    user = UserDAL().read_user_by_email(login_request.email)

    if not user:
        return JSONResponse(status_code=400, content={"error": {
            "code": "api_error",
            "type": "user_not_found",
            "message": f"User with email {login_request.email} not found."
        }})

    password_hash = password_kdf(user.password_scrypt_salt, login_request.password)

    if password_hash != user.password_scrypt_hash:
        return JSONResponse(status_code=400, content={"error": {
            "code": "api_error",
            "type": "invalid_password",
            "message": "Invalid password."
        }})

    session_token = sessions.create_session(user.id)
    response.set_cookie("session", session_token, samesite="Strict")

    return {
        "status": "ok"
    }

@router.get("/logout", response_model=dict)
def deauthenticate_user(request: Request, response: Response):

    session_token = request.cookies.get("session")

    if session_token:
        session_token = sessions.delete_session(session_token)

    response.delete_cookie("session")

    return {
        "status": "ok"
    }


@router.post("/register", response_model=dict)
def register_new_user(request: Request, registration_request: UserCreate, response: Response):

    if not (registration_request.email and registration_request.full_name and registration_request.password):
        return JSONResponse(status_code=400, content={"error": {
            "code": "api_error",
            "type": "invalid_request_error",
            "message": "Please enter missing fields."
        }})

    user_dal = UserDAL()

    if user_dal.read_user_by_email(registration_request.email):

        return JSONResponse(status_code=400, content={"error": {
            "code": "api_error",
            "type": "email_already_registered",
            "message": f"Email address {registration_request.email} is already registered."
        }})
    
    password_salt, password_hash = generate_password_salt_hash(registration_request.password)

    extra_data = {
        'id': str(Nanoid(prefix="usr")),
        'password_scrypt_hash': password_hash,
        'password_scrypt_salt': password_salt,
        'created_at': int(time.time())
    }

    user = User.model_validate(registration_request, update=extra_data)

    user_dal.create_user(user)

    session_token = sessions.create_session(user.id)
    response.set_cookie("session", session_token, samesite="Strict")

    return {
        "status": "ok"
    }
