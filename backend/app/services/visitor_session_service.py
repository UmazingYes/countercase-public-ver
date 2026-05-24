import hashlib
import os
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import VisitorSession


SESSION_COOKIE_NAME = "countercase_session"
SESSION_DAYS = 30


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class VisitorSessionService:
    def get_or_create_session(
        self,
        db: Session,
        request: Request,
        response: Response,
    ) -> VisitorSession:
        token = request.cookies.get(SESSION_COOKIE_NAME)

        if token is not None:
            token_hash = hash_token(token)

            session = db.execute(
                select(VisitorSession).where(VisitorSession.token_hash == token_hash)
            ).scalar_one_or_none()

            if session is not None and session.expires_at > datetime.now(UTC):
                session.last_seen_at = datetime.now(UTC)
                db.commit()
                db.refresh(session)
                return session

        new_token = secrets.token_urlsafe(32)

        session = VisitorSession(
            token_hash=hash_token(new_token),
            expires_at=datetime.now(UTC) + timedelta(days=SESSION_DAYS),
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        is_production = os.getenv("ENVIRONMENT") == "production"

        response.set_cookie(
            key=SESSION_COOKIE_NAME,
            value=new_token,
            httponly=True,
            samesite="none" if is_production else "lax",
            secure=is_production,
            max_age=SESSION_DAYS * 24 * 60 * 60,
            path="/",
        )

        return session