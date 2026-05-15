from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()

engine = create_engine(
    "sqlite:///./db.sqlite", connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)


Base.metadata.create_all(bind=engine)


@app.get("/api/items")
def get_items():
    db = SessionLocal()
    items = db.query(Item).all()
    db.close()
    return items


@app.post("/api/items")
def create_item(name: str, description: str = ""):
    db = SessionLocal()
    item = Item(name=name, description=description)
    db.add(item)
    db.commit()
    db.refresh(item)
    db.close()
    return item


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
