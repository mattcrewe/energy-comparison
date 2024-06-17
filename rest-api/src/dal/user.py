from sqlmodel import SQLModel, Session, create_engine, select

from src.config import settings
from src.models.user import User, UserUpdate

class UserDAL():

    def __init__(self) -> None:
        self.db = settings.postgres.get_postgres_address()
        self.engine = create_engine(self.db)
        self.init_database()

    def init_database(self) -> None:
        SQLModel.metadata.create_all(self.engine)

    def create_user(self, user: User) -> User:
        with Session(self.engine) as session:

            session.add(user)
            session.commit()
            session.refresh(user)

            return user
        

    def read_users(self) -> list[User]:
        with Session(self.engine) as session:

            statement = select(User)
            return session.exec(statement).all()

    def read_user(self, user_id: str) -> User:
        with Session(self.engine) as session:

            statement = select(User).where(User.id == user_id)
            return session.exec(statement).one()

    def read_user_by_email(self, email: str) -> User:
        with Session(self.engine) as session:

            statement = select(User).where(User.email == email)
            return session.exec(statement).first()

    def update_user(self, user_id: str, updates: UserUpdate) -> User:
        with Session(self.engine) as session:

            user = session.get(User, user_id)

            user_updates = updates.model_dump(exclude_unset=True)

            user.sqlmodel_update(user_updates)

            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    def delete_user(self, user_id: str) -> bool:
        with Session(self.engine) as session:

            statement = select(User).where(User.id == user_id)
            results = session.exec(statement)
            user = results.first()

            if user is None:
                return False

            session.delete(user)
            session.commit()
            session.refresh(user)

            statement = select(User).where(User.id == user_id)
            results = session.exec(statement)
            user = results.first()

            return (user is None)
