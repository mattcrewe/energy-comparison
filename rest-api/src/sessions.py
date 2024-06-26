'''
Simple in memory session store to track active user sessions.
'''
from typing import Optional
from src.utils.nanoid import Nanoid

class SessionStore:
    def __init__(self) -> None:
        self.sessions: dict[str, str] = {}

    def create_session(self, user_id: int) -> str:
        session_token = str(Nanoid(prefix="session"))
        self.sessions[session_token] = user_id
        return session_token

    def get_session(self, session_token: str) -> Optional[str]:
        if not session_token:
            return None

        return self.sessions.get(session_token)
    
    def delete_session(self, session_token: str) -> bool:
        if not session_token:
            return False
        
        del self.sessions[session_token]
        return True

# singleton instance of the session store
sessions = SessionStore()
