from sqlmodel import SQLModel, Session, create_engine, select

from src.config import settings
from src.models.review import Review, ReviewUpdate

class ReviewDAL:

    def __init__(self) -> None:
        self.db = settings.postgres.get_postgres_address()
        self.engine = create_engine(self.db)
        self.init_database()

    def init_database(self) -> None:
        SQLModel.metadata.create_all(self.engine)

    def create_review(self, review: Review) -> None:
        with Session(self.engine) as session:

            session.add(review)
            session.commit()
            session.refresh(review)
            return review

    def read_reviews(self, user_id: str) -> list[Review]:
        with Session(self.engine) as session:

            statement = select(Review).where(Review.user_id == user_id)
            return session.exec(statement).all()

    def update_review(self, review_id: str, updates: ReviewUpdate) -> Review:
        with Session(self.engine) as session:

            review = session.get(Review, review_id)

            review_updates = updates.model_dump(exclude_unset=True)

            review.sqlmodel_update(review_updates)

            session.add(review)
            session.commit()
            session.refresh(review)
            return review

    def delete_review(self, review_id: str) -> bool:
        with Session(self.engine) as session:

            statement = select(Review).where(Review.id == review_id)
            results = session.exec(statement)
            review = results.first()

            if review is None:
                return False

            session.delete(review)
            session.commit()

            statement = select(Review).where(Review.id == review_id)
            results = session.exec(statement)
            review = results.first()

            return (review is None)
