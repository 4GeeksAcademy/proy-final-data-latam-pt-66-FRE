from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, DailyLog
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email"), password=body.get("password")).first()
    if user is None: return jsonify({"msg": "Error"}), 401
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