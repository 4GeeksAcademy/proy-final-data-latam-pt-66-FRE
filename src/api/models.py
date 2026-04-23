from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    # Perfil y Metas
    name: Mapped[str] = mapped_column(String(100), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    height: Mapped[float] = mapped_column(Float, nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)
    goal: Mapped[str] = mapped_column(String(50), nullable=True)
    diet_type: Mapped[str] = mapped_column(String(50), nullable=True)
    daily_calories_limit: Mapped[int] = mapped_column(Integer, default=2000)

    # Relaciones
    logs = relationship("DailyLog", back_populates="user")
    fasts = relationship("FastingLog", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "goal": self.goal,
            "diet_type": self.diet_type,
            "daily_calories_limit": self.daily_calories_limit,
            "height": self.height,
            "weight": self.weight,
            "age": self.age
        }


class DailyLog(db.Model):
    __tablename__ = 'daily_log'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    # Usamos Date para que el filtrado por "hoy" sea exacto
    date: Mapped[datetime.date] = mapped_column(
        Date, default=datetime.utcnow().date())

    meal_category: Mapped[str] = mapped_column(String(50), nullable=True)
    food_name: Mapped[str] = mapped_column(String(200), nullable=True)
    calories: Mapped[int] = mapped_column(Integer, default=0)
    water_ml: Mapped[int] = mapped_column(Integer, default=0)

    user = relationship("User", back_populates="logs")

    def serialize(self):
        return {
            "id": self.id,
            "category": self.meal_category,
            "food": self.food_name,
            "calories": self.calories,
            "water": self.water_ml,
            "date": str(self.date)
        }


class FastingLog(db.Model):
    __tablename__ = 'fasting_log'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    start_time: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    user = relationship("User", back_populates="fasts")

    def serialize(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None
        }
