from typing import Optional
from enum import Enum

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class HouseType(str, Enum):
    flat = "flat"
    studio = "studio"
    terrace = "terrace"
    semi = "semi" #also used for end of terrace
    house = "house"

class UserBase(SQLModel):
    email: str
    full_name: str
    house_type: Optional[HouseType] = None
    house_size: Optional[int] = None
    electric_vehicle: Optional[bool] = None
    solar_power: Optional[bool] = None

class User(UserBase, table=True):
    id: str = Field(primary_key=True)
    password_scrypt_salt: str
    password_scrypt_hash: str
    created_at: int

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    pass

class UserUpdateBase(SQLModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    house_type: Optional[HouseType] = None
    house_size: Optional[int] = None
    electric_vehicle: Optional[bool] = None
    solar_power: Optional[bool] = None

class UserUpdate(UserUpdateBase):
    password_scrypt_salt: Optional[str] = None
    password_scrypt_hash: Optional[str] = None

class UserUpdatePublic(UserUpdateBase):
    password: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str