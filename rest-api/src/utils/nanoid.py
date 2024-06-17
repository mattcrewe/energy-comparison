import json
from hashlib import blake2b
import uuid as uuid_lib
import os

from src.utils import base62


class Nanoid:

    def __init__(self, nano_id=None, uuid=None, from_bytes=None, from_hex=None, prefix=""):
        self.prefix: str = prefix
        self.bytes: bytes
        self.str: str

        if nano_id:
            if "_" in nano_id:
                self.prefix, nano_id = nano_id.split("_")
            self.bytes = base62.b62_decode(nano_id)
            self.str = nano_id

        if uuid:
            self.bytes = uuid_lib.UUID(uuid).bytes
            self.str = base62.b62_encode(self.bytes)

        if from_bytes:
            self.bytes = from_bytes
            self.str = base62.b62_encode(self.bytes)

        if from_hex:
            self.bytes = bytes.fromhex(from_hex)
            self.str = base62.b62_encode(self.bytes)

        if not (nano_id or uuid or from_bytes or from_hex):
            self.generate()

    def generate(self, size=16):
        self.bytes = os.urandom(size)
        self.str = base62.b62_encode(self.bytes)

    def hash(self, to_hash: str | list | tuple | dict) -> None:

        if isinstance(to_hash, str):
            combined = to_hash
        else:
            combined = json.dumps(to_hash)

        self.bytes = blake2b(combined.encode(), digest_size=16).digest()
        self.str = base62.b62_encode(self.bytes)

        return self

    def uuid(self):
        return uuid_lib.UUID(bytes=self.bytes)

    def __repr__(self):
        if self.prefix:
            return f"Nanoid('{self.prefix}_{self.str}')"
        else:
            return f"Nanoid('{self.str}')"

    def __str__(self):
        if self.prefix:
            return f"{self.prefix}_{self.str}"
        else:
            return self.str
