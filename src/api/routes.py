import os
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, DailyLog, FastingLog
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

api = Blueprint('api', __name__)
CORS(api)

# --- 1. AUTENTICACIÓN ---

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if not body or "password" not in body:
        return jsonify({"msg": "Datos incompletos"}), 400

    # Usamos scrypt como tienes en tu DB
    password_hash = generate_password_hash(body["password"], method='scrypt')
    new_user = User(email=body["email"], password=password_hash, is_active=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except:
        return jsonify({"msg": "El email ya existe"}), 400

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email")).first()

    if user and check_password_hash(user.password, body.get("password")):
        # Identity como string es más seguro para JWT
        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token, "user_id": user.id}), 200
    
    return jsonify({"msg": "Credenciales incorrectas"}), 401

# --- 2. PERFIL DE USUARIO (LA RUTA QUE FALTABA) ---

@api.route('/user-profile', methods=['GET', 'PUT'])
@jwt_required()
def handle_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    if request.method == 'PUT':
        body = request.get_json()
        
        # Sincronizado con tus columnas de models.py
        user.age = body.get("age", user.age)
        user.height = body.get("height", user.height)
        user.weight = body.get("weight", user.weight)
        user.diet_type = body.get("diet_type", user.diet_type)
        user.goal = body.get("goal", user.goal)

        db.session.commit()
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200

# --- 3. LOGS DIARIOS (AGUA Y COMIDA) ---

@api.route('/daily-summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    
    logs = DailyLog.query.filter_by(user_id=user_id, date=today).all()
    user = User.query.get(user_id)
    
    return jsonify({
        "total_calories": sum(l.calories for l in logs),
        "total_water": sum(l.water_ml for l in logs),
        "diet_type": user.diet_type,
        "logs": [l.serialize() for l in logs]
    }), 200

@api.route('/daily-log', methods=['POST'])
@jwt_required()
def add_log():
    user_id = get_jwt_identity()
    body = request.get_json()
    
    # Mapeamos lo que viene del front (category, food, water) 
    # a lo que pide la DB (meal_category, food_name, water_ml)
    new_log = DailyLog(
        user_id=user_id,
        meal_category=body.get("category"), 
        food_name=body.get("food"),
        calories=body.get("calories", 0),
        water_ml=body.get("water", 0) 
    )
    
    db.session.add(new_log)
    db.session.commit()
    return jsonify({"msg": "Registro guardado", "log": new_log.serialize()}), 201

# --- 4. AYUNO ---

@api.route('/fasting/start', methods=['POST'])
@jwt_required()
def start_fasting():
    user_id = get_jwt_identity()
    new_fast = FastingLog(user_id=user_id, start_time=datetime.utcnow())
    db.session.add(new_fast)
    db.session.commit()
    return jsonify({"msg": "Ayuno iniciado"}), 201

@api.route('/fasting/status', methods=['GET'])
@jwt_required()
def get_fasting():
    user_id = get_jwt_identity()
    # Obtenemos el último ayuno sin terminar
    last_fast = FastingLog.query.filter_by(user_id=user_id, end_time=None).order_by(FastingLog.id.desc()).first()
    if last_fast:
        return jsonify(last_fast.serialize()), 200
    return jsonify({"msg": "No hay ayuno activo"}), 404