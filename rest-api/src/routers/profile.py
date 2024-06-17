from fastapi import APIRouter, HTTPException, Request

from src.dal.user import UserDAL
from src.dal.review import ReviewDAL
from src.dal.recommendation import RecommendationDAL

from src.models.review import Rating, Review, ReviewCreate, ReviewPublic, ReviewUpdate
from src.models.user import UserPublic, UserUpdate, UserUpdatePublic

from src.utils.hash_password import generate_password_salt_hash
from src.utils.nanoid import Nanoid
from src.sessions import sessions

router = APIRouter(
    prefix="/profile",
    tags=["User Profile"]
)


@router.get("", response_model=UserPublic)
def read_my_profile(request: Request):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    return UserDAL().read_user(user_id)


@router.patch("", response_model=UserPublic)
def update_profile(request: Request, updates: UserUpdatePublic):

    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    # user_update = UserUpdate.model_validate(updates)
    user_update = UserUpdate.model_validate(updates.model_dump(exclude_unset=True))

    if updates.password:
        password_salt, password_hash = generate_password_salt_hash(
            updates.password)
        user_update.password_scrypt_salt = password_salt
        user_update.password_scrypt_hash = password_hash

    return UserDAL().update_user(user_id, user_update)


@router.get("/reviews", response_model=list[ReviewPublic])
def read_my_reviews(request: Request):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    return ReviewDAL().read_reviews(user_id)


@router.post("/review", response_model=ReviewPublic)
def create_review(request: Request, review_details: ReviewCreate):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    extra_data = {
        "id": str(Nanoid(prefix="rev")),
        "user_id": user_id
    }

    review = Review.model_validate(review_details, update=extra_data)

    ReviewDAL().create_review(review)
    return review


@router.patch("/review/{review_id}", response_model=ReviewPublic)
def update_review(review_id: str, request: Request, updates: ReviewUpdate):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    return ReviewDAL().update_review(review_id, updates)


@router.get("/recommendations", response_model=list[Rating])
def get_recommendations(request: Request):
    user_id = sessions.get_session(request.cookies.get("session"))
    if not user_id:
        raise HTTPException(
            status_code=401, detail="User is not authenticated.")

    user = UserDAL().read_user(user_id)

    user_property = UserPublic.model_validate(user)
    return RecommendationDAL().read_recommendations(user_property)
