from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    Float,
    String,
    Boolean,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import enum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine(
    "sqlite:///./db.sqlite", connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Enums
class AssetLiabilityType(str, enum.Enum):
    asset = "asset"
    liability = "liability"


class AssetLiabilitySubType(str, enum.Enum):
    liquid = "liquid"
    semi_liquid = "semi_liquid"
    fixed = "fixed"


class AppreciationFrequency(str, enum.Enum):
    monthly = "monthly"
    bi_monthly = "quarterly"
    quarterly = "quarterly"
    semi_annually = "semi_annually"
    yearly = "yearly"


class IncomeExpenseType(str, enum.Enum):
    income = "income"
    expense = "expense"


class ItemType(str, enum.Enum):
    asset_liability = "asset_liability"
    income_expense = "income_expense"


class ImpactType(str, enum.Enum):
    add = "add"
    reduce = "reduce"


# Models
class AssetsLiabilities(Base):
    __tablename__ = "assets_liabilities"

    asset_liability_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, primary_key=True, index=True)
    type = Column(Enum(AssetLiabilityType))
    sub_type = Column(Enum(AssetLiabilitySubType))
    annual_appreciation_percentage = Column(Integer, nullable=True)
    appreciation_frequency = Column(Enum(AppreciationFrequency), nullable=True)
    is_loan = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class IncomeExpenses(Base):
    __tablename__ = "income_expenses"

    income_expense_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, primary_key=True, index=True)
    type = Column(Enum(IncomeExpenseType))
    application_frequency = Column(String, nullable=True)
    annual_appreciation = Column(Integer, nullable=True)
    appreciation_frequency = Column(Enum(AppreciationFrequency), nullable=True)
    start_month = Column(Integer)
    start_year = Column(Integer)
    end_month = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)
    associated_asset_id = Column(
        Integer, ForeignKey("assets_liabilities.asset_liability_id"), nullable=True
    )
    is_loan = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LoanDetails(Base):
    __tablename__ = "loan_details"

    loan_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, primary_key=True, index=True)
    interest_rate = Column(Integer)
    emi_start_month = Column(Integer)
    emi_start_year = Column(Integer)
    emi_end_month = Column(Integer)
    emi_end_year = Column(Integer)
    emi_value = Column(Integer)
    associated_asset_liability_id = Column(
        Integer, ForeignKey("assets_liabilities.asset_liability_id"), nullable=True
    )
    associated_income_expense_id = Column(
        Integer, ForeignKey("income_expenses.income_expense_id"), nullable=True
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MonthValues(Base):
    __tablename__ = "month_values"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(Integer)
    year = Column(Integer)
    item_type = Column(Enum(ItemType))
    item_id = Column(Integer)
    value = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Events(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String,primary_key=True, index=True)
    start_month = Column(Integer)
    end_month = Column(Integer)
    no_occurences = Column(Integer)
    interval = Column(Integer)
    applied = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EventsImpact(Base):
    __tablename__ = "events_impact"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.event_id"))
    impact_type = Column(Enum(ImpactType))
    associated_item_id = Column(Integer)
    value = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


Base.metadata.create_all(bind=engine)


# Pydantic Schemas
class AssetsLiabilitiesBase(BaseModel):
    name: str
    type: AssetLiabilityType
    sub_type: AssetLiabilitySubType
    annual_appreciation_percentage: Optional[int] = None
    appreciation_frequency: Optional[AppreciationFrequency] = None
    is_loan: bool = False


class AssetsLiabilitiesCreate(AssetsLiabilitiesBase):
    pass


class AssetsLiabilitiesUpdate(AssetsLiabilitiesBase):
    pass


class AssetsLiabilitiesResponse(AssetsLiabilitiesBase):
    asset_liability_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IncomeExpensesBase(BaseModel):
    name: str
    type: IncomeExpenseType
    application_frequency: Optional[str] = None
    annual_appreciation: Optional[int] = None
    appreciation_frequency: Optional[AppreciationFrequency] = None
    start_month: int
    start_year: int
    end_month: Optional[int] = None
    end_year: Optional[int] = None
    associated_asset_id: Optional[int] = None
    is_loan: bool = False


class IncomeExpensesCreate(IncomeExpensesBase):
    pass


class IncomeExpensesUpdate(IncomeExpensesBase):
    pass


class IncomeExpensesResponse(IncomeExpensesBase):
    income_expense_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LoanDetailsBase(BaseModel):
    name: str
    interest_rate: int
    emi_start_month: int
    emi_start_year: int
    emi_end_month: int
    emi_end_year: int
    emi_value: int
    associated_asset_liability_id: Optional[int] = None
    associated_income_expense_id: Optional[int] = None


class LoanDetailsCreate(LoanDetailsBase):
    pass


class LoanDetailsUpdate(LoanDetailsBase):
    pass


class LoanDetailsResponse(LoanDetailsBase):
    loan_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MonthValuesBase(BaseModel):
    month: int
    year: int
    item_type: ItemType
    item_id: int
    value: int


class MonthValuesCreate(MonthValuesBase):
    pass


class MonthValuesUpdate(MonthValuesBase):
    pass


class MonthValuesResponse(MonthValuesBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventsBase(BaseModel):
    event_name: str
    start_month: int
    end_month: int
    no_occurences: int
    interval: int
    applied: bool = False


class EventsCreate(EventsBase):
    pass


class EventsUpdate(EventsBase):
    pass


class EventsResponse(EventsBase):
    event_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventsImpactBase(BaseModel):
    event_id: int
    impact_type: ImpactType
    associated_item_id: int
    value: int


class EventsImpactCreate(EventsImpactBase):
    pass


class EventsImpactUpdate(EventsImpactBase):
    pass


class EventsImpactResponse(EventsImpactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Assets Liabilities CRUD
@app.get("/api/assets-liabilities", response_model=List[AssetsLiabilitiesResponse])
def get_assets_liabilities(db: Session = Depends(get_db)):
    return db.query(AssetsLiabilities).all()


# @app.get("/api/assets-liabilities/{id}", response_model=AssetsLiabilitiesResponse)
# def get_assets_liability(id: int, db: Session = Depends(get_db)):
#     obj = (
#         db.query(AssetsLiabilities)
#         .filter(AssetsLiabilities.asset_liability_id == id)
#         .first()
#     )
#     if not obj:
#         raise HTTPException(status_code=404, detail="Asset/Liability not found")
#     return obj


@app.post("/api/assets-liabilities", response_model=AssetsLiabilitiesResponse)
def create_assets_liability(
    obj: AssetsLiabilitiesCreate, db: Session = Depends(get_db)
):
    db_obj = AssetsLiabilities(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.put("/api/assets-liabilities/{id}", response_model=AssetsLiabilitiesResponse)
def update_assets_liability(
    id: int, obj: AssetsLiabilitiesUpdate, db: Session = Depends(get_db)
):
    db_obj = (
        db.query(AssetsLiabilities)
        .filter(AssetsLiabilities.asset_liability_id == id)
        .first()
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="Asset/Liability not found")
    for key, value in obj.model_dump().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.delete("/api/assets-liabilities/{id}")
def delete_assets_liability(id: int, db: Session = Depends(get_db)):
    db_obj = (
        db.query(AssetsLiabilities)
        .filter(AssetsLiabilities.asset_liability_id == id)
        .first()
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="Asset/Liability not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


# Income Expenses CRUD
@app.get("/api/income-expenses", response_model=List[IncomeExpensesResponse])
def get_income_expenses(db: Session = Depends(get_db)):
    return db.query(IncomeExpenses).all()


# @app.get("/api/income-expenses/{id}", response_model=IncomeExpensesResponse)
# def get_income_expense(id: int, db: Session = Depends(get_db)):
#     obj = (
#         db.query(IncomeExpenses).filter(IncomeExpenses.income_expense_id == id).first()
#     )
#     if not obj:
#         raise HTTPException(status_code=404, detail="Income/Expense not found")
#     return obj


@app.post("/api/income-expenses", response_model=IncomeExpensesResponse)
def create_income_expense(obj: IncomeExpensesCreate, db: Session = Depends(get_db)):
    db_obj = IncomeExpenses(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.put("/api/income-expenses/{id}", response_model=IncomeExpensesResponse)
def update_income_expense(
    id: int, obj: IncomeExpensesUpdate, db: Session = Depends(get_db)
):
    db_obj = (
        db.query(IncomeExpenses).filter(IncomeExpenses.income_expense_id == id).first()
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="Income/Expense not found")
    for key, value in obj.model_dump().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.delete("/api/income-expenses/{id}")
def delete_income_expense(id: int, db: Session = Depends(get_db)):
    db_obj = (
        db.query(IncomeExpenses).filter(IncomeExpenses.income_expense_id == id).first()
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="Income/Expense not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


# Loan Details CRUD
@app.get("/api/loan-details", response_model=List[LoanDetailsResponse])
def get_loan_details(db: Session = Depends(get_db)):
    return db.query(LoanDetails).all()


# @app.get("/api/loan-details/{id}", response_model=LoanDetailsResponse)
# def get_loan_detail(id: int, db: Session = Depends(get_db)):
#     obj = db.query(LoanDetails).filter(LoanDetails.loan_id == id).first()
#     if not obj:
#         raise HTTPException(status_code=404, detail="Loan not found")
#     return obj


@app.post("/api/loan-details", response_model=LoanDetailsResponse)
def create_loan_detail(obj: LoanDetailsCreate, db: Session = Depends(get_db)):
    db_obj = LoanDetails(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.put("/api/loan-details/{id}", response_model=LoanDetailsResponse)
def update_loan_detail(id: int, obj: LoanDetailsUpdate, db: Session = Depends(get_db)):
    db_obj = db.query(LoanDetails).filter(LoanDetails.loan_id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Loan not found")
    for key, value in obj.model_dump().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.delete("/api/loan-details/{id}")
def delete_loan_detail(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(LoanDetails).filter(LoanDetails.loan_id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Loan not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


# Month Values CRUD
@app.get("/api/month-values", response_model=List[MonthValuesResponse])
def get_month_values(
    month: Optional[int] = None,
    year: Optional[int] = None,
    item_type: Optional[ItemType] = None,
    db: Session = Depends(get_db),
):
    query = db.query(MonthValues)
    if month:
        query = query.filter(MonthValues.month == month)
    if year:
        query = query.filter(MonthValues.year == year)
    if item_type:
        query = query.filter(MonthValues.item_type == item_type)
    return query.all()


# @app.get("/api/month-values/{id}", response_model=MonthValuesResponse)
# def get_month_value(id: int, db: Session = Depends(get_db)):
#     obj = db.query(MonthValues).filter(MonthValues.id == id).first()
#     if not obj:
#         raise HTTPException(status_code=404, detail="Month value not found")
#     return obj


@app.post("/api/month-values", response_model=MonthValuesResponse)
def create_month_value(obj: MonthValuesCreate, db: Session = Depends(get_db)):
    db_obj = MonthValues(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# @app.put("/api/month-values/{id}", response_model=MonthValuesResponse)
# def update_month_value(id: int, obj: MonthValuesUpdate, db: Session = Depends(get_db)):
#     db_obj = db.query(MonthValues).filter(MonthValues.id == id).first()
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Month value not found")
#     for key, value in obj.model_dump().items():
#         setattr(db_obj, key, value)
#     db.commit()
#     db.refresh(db_obj)
#     return db_obj


@app.delete("/api/month-values/{id}")
def delete_month_value(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(MonthValues).filter(MonthValues.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Month value not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


# Events CRUD
@app.get("/api/events", response_model=List[EventsResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(Events).all()


# @app.get("/api/events/{id}", response_model=EventsResponse)
# def get_event(id: int, db: Session = Depends(get_db)):
#     obj = db.query(Events).filter(Events.event_id == id).first()
#     if not obj:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return obj


@app.post("/api/events", response_model=EventsResponse)
def create_event(obj: EventsCreate, db: Session = Depends(get_db)):
    db_obj = Events(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# @app.put("/api/events/{id}", response_model=EventsResponse)
# def update_event(id: int, obj: EventsUpdate, db: Session = Depends(get_db)):
#     db_obj = db.query(Events).filter(Events.event_id == id).first()
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Event not found")
#     for key, value in obj.model_dump().items():
#         setattr(db_obj, key, value)
#     db.commit()
#     db.refresh(db_obj)
#     return db_obj


@app.delete("/api/events/{id}")
def delete_event(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(Events).filter(Events.event_id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


# Events Impact CRUD
@app.get("/api/events-impact", response_model=List[EventsImpactResponse])
def get_events_impact(db: Session = Depends(get_db)):
    return db.query(EventsImpact).all()


@app.get("/api/events-impact/{id}", response_model=EventsImpactResponse)
def get_events_impact_by_id(id: int, db: Session = Depends(get_db)):
    obj = db.query(EventsImpact).filter(EventsImpact.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Event impact not found")
    return obj


@app.post("/api/events-impact", response_model=EventsImpactResponse)
def create_events_impact(obj: EventsImpactCreate, db: Session = Depends(get_db)):
    db_obj = EventsImpact(**obj.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.put("/api/events-impact/{id}", response_model=EventsImpactResponse)
def update_events_impact(
    id: int, obj: EventsImpactUpdate, db: Session = Depends(get_db)
):
    db_obj = db.query(EventsImpact).filter(EventsImpact.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Event impact not found")
    for key, value in obj.model_dump().items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@app.delete("/api/events-impact/{id}")
def delete_events_impact(id: int, db: Session = Depends(get_db)):
    db_obj = db.query(EventsImpact).filter(EventsImpact.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Event impact not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Deleted successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
