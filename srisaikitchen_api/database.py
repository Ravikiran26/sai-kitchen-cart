from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

load_dotenv()

# Allow an explicit DATABASE_URL override (useful for Docker/production)
DATABASE_URL = os.getenv("DATABASE_URL")

# Quick dev option: set USE_SQLITE=1 in your `.env` to avoid MySQL setup
USE_SQLITE = os.getenv("USE_SQLITE", "0") == "1"

if not DATABASE_URL:
    if USE_SQLITE:
        # Use a local SQLite file for zero-config local development
        DATABASE_URL = "sqlite:///./dev.db"
    else:
        MYSQL_USER = os.getenv("MYSQL_USER", "root")
        RAW_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
        MYSQL_PASSWORD = quote_plus(RAW_PASSWORD)  # <-- encodes @ to %40
        MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
        MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
        MYSQL_DB = os.getenv("MYSQL_DB", "srisaikitchen")

        DATABASE_URL = (
            f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
            f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
        )

engine = create_engine(DATABASE_URL, echo=False, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
print(">>> USING DATABASE_URL =", DATABASE_URL)

Base = declarative_base()
