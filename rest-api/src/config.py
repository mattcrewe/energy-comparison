import os
from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class PostgresSettings(BaseModel):
    host: str = ""
    port: int = 5432
    username: str = "admin"
    password: str = ""
    db: str = "energy"

    def get_postgres_address(self) -> PostgresDsn:
        return f'postgresql://{self.username}:{self.password}@{self.host}:{self.port}/{self.db}'

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_nested_delimiter='__')
    
    postgres: PostgresSettings = PostgresSettings()

settings = Settings()
