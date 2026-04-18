from api.utils import generate_sitemap, APIException
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, DailyLog
from flask_cors import CORS

api = Blueprint('api', __name__)

CORS(api)

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(
        email=body.get("email"), 
        password=body.get("password")
    ).first()
    
    if user is None:
        return jsonify({"msg": "Error"}), 401
    return jsonify({"token": "test-token", "user": user.serialize()}), 200

@api.route('/daily-log', methods=['POST'])
def add_daily_log():
    body = request.get_json()
    new_log = DailyLog(
        user_id=body.get("user_id"),
        date=body.get("date"),
        weight=body.get("weight"),
        height=body.get("height"),
        age=body.get("age"),
        diet_type=body.get("diet_type"),
        calories=body.get("calories"),
        protein=body.get("protein"),
        carbs=body.get("carbs"),
        fat=body.get("fat")
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({"msg": "Guardado"}), 201

@api.route('/daily-log', methods=['GET'])
def get_all_logs():
    logs = DailyLog.query.order_by(DailyLog.id.desc()).all()
    return jsonify([log.serialize() for log in logs]), 200

foods = []
current_id = 1

# --- RUTAS DE FOODS ---

@api.route('/foods', methods=['GET'])
def get_foods():
    return jsonify(foods), 200

@api.route('/foods', methods=['POST'])
def create_food():
    global current_id
    data = request.json

    new_food = {
        "id": current_id,
        "name": data["name"],
        "calories": data["calories"],
        "category": data["category"]
    }

    foods.append(new_food)
    current_id += 1
    return jsonify(new_food), 201

@api.route('/foods/<int:id>', methods=['PUT'])
def update_food(id):
    data = request.json
    for food in foods:
        if food["id"] == id:
            food.update(data)
            return jsonify(food), 200
    return jsonify({"msg": "Not found"}), 404

@api.route('/foods/<int:id>', methods=['DELETE'])
def delete_food(id):
    global foods
    foods = [f for f in foods if f["id"] != id]
    return jsonify({"msg": "Deleted"}), 200

@api.route('/foods', methods=['DELETE'])
def delete_all_foods():
    global foods
    foods = []
    return jsonify({"msg": "All foods deleted"}), 200