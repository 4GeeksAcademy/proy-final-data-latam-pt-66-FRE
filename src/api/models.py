from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)

    def serialize(self):
        return {"id": self.id, "email": self.email}

class DailyLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    diet_type = db.Column(db.String(100), nullable=False)
    calories = db.Column(db.Integer, default=0)
    protein = db.Column(db.Integer, default=0)
    carbs = db.Column(db.Integer, default=0)
    fat = db.Column(db.Integer, default=0)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date,
            "weight": self.weight,
            "height": self.height,
            "age": self.age,
            "diet_type": self.diet_type,
            "calories": self.calories,
            "protein": self.protein,
            "carbs": self.carbs,
            "fat": self.fat
        }