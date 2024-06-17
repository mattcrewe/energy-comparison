from sqlalchemy import func, desc
from sqlmodel import SQLModel, Session, create_engine, select

from src.config import settings
from src.models.review import Review
from src.models.user import User, UserPublic


class RecommendationDAL():

    def __init__(self):
        self.db = settings.postgres.get_postgres_address()
        self.engine = create_engine(self.db)
        self.init_database()

    def init_database(self):
        SQLModel.metadata.create_all(self.engine)

    def read_recommendations(self, property_profile: UserPublic):

        with Session(self.engine) as session:

            cte = (
                select(
                    Review.provider,
                    func.avg(Review.affordability_rating).label("affordability_rating"),
                    func.avg(Review.customer_service_rating).label("customer_service_rating")
                ).join(
                    User, User.id == Review.user_id
                ).where(
                    User.house_type == property_profile.house_type,
                    User.house_size >= property_profile.house_size * 0.8,
                    User.house_size <= property_profile.house_size * 1.2,
                    User.solar_power == property_profile.solar_power,
                    User.electric_vehicle == property_profile.electric_vehicle,
                ).group_by(Review.provider)
                .cte("averages")
            )

            # Main query referencing the CTE
            statement = (
                select(
                    cte.c.provider,
                    cte.c.affordability_rating,
                    cte.c.customer_service_rating,
                    ((cte.c.affordability_rating + cte.c.customer_service_rating) / 2).label("rating")
                )
                .order_by(desc("rating"))
                .limit(5)
            )

            response = session.exec(statement).all()
            return response
