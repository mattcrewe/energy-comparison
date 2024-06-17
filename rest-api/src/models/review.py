from typing import Optional

from sqlmodel import Field, SQLModel

class RatingBase(SQLModel):
    provider: str
    affordability_rating: float
    customer_service_rating: float

class Rating(RatingBase):
    rating: float

class ReviewBase(RatingBase):
    start_date: int
    end_date: Optional[int] = None

class Review(ReviewBase, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="user.id")

class ReviewPublic(ReviewBase):
    id: str

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(SQLModel):
    start_date: Optional[int] = None
    end_date: Optional[int] = None
    affordability_rating: Optional[int] = None
    customer_service_rating: Optional[int] = None
