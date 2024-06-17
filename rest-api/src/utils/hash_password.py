import base64
import os
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt


def generate_password_salt_hash(password: str) -> tuple[str, str]:
    password_salt = base64.b64encode(os.urandom(16)).decode()
    password_hash = password_kdf(password_salt, password)

    return (password_salt, password_hash)


def password_kdf(salt: str, password: str) -> bytes:
    '''
    RFC 7914 recommends values of r=8 and p=1 while scaling n to a number appropriate
    for your system. The scrypt paper suggests a minimum value of n=2**14 for
    interactive logins (t < 100ms).
    '''
    kdf = Scrypt(
        salt=base64.b64decode(salt),
        length=32,
        n=2**14,
        r=8,
        p=1,
    )
    return base64.b64encode(kdf.derive(password.encode())).decode()