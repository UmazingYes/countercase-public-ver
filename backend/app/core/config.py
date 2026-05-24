from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://countercase:countercase@localhost:5432/countercase"
    frontend_origin: str = "http://localhost:5173"
    judge_path: str = "../judge/build/judge"
    environment: str = "development"

    submit_rate_limit_count: int = 15
    submit_rate_limit_window_seconds: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
