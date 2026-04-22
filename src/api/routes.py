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
        
        # Unimos nombre y apellido para la columna 'name' del modelo
        first = body.get("first_name", "")
        last = body.get("last_name", "")
        if first or last:
            user.name = f"{first} {last}".strip()

        # Sincronizado con tus columnas de models.py
        user.age = body.get("age", user.age)
        user.height = body.get("height", user.height)
        user.weight = body.get("weight", user.weight)
        user.diet_type = body.get("diet_type", user.diet_type)
        user.goal = body.get("goal", user.goal)

        db.session.commit()
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200

# --- 3. LOGS DIARIOS (AGUA Y COMIDA) ---

@api.route('/daily-summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    # Usamos la fecha actual del servidor
    today = datetime.utcnow().date()
    
    # Buscamos registros filtrando por usuario y fecha
    logs = DailyLog.query.filter_by(user_id=user_id, date=today).all()
    user = User.query.get(user_id)
    
    # Sumas blindadas contra valores None
    total_w = sum(l.water_ml for l in logs if l.water_ml is not None)
    total_c = sum(l.calories for l in logs if l.calories is not None)
    
    return jsonify({
        "total_calories": total_c,
        "total_water": total_w,
        "diet_type": user.diet_type if user else None
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
    
    # Verificamos si ya existe un ayuno sin terminar para este usuario
    active_fast = FastingLog.query.filter_by(user_id=user_id, end_time=None).first()
    if active_fast:
        return jsonify({"msg": "Ya tienes un ayuno en curso"}), 400

    new_fast = FastingLog(user_id=user_id, start_time=datetime.utcnow())
    db.session.add(new_fast)
    db.session.commit()
    return jsonify({"msg": "Ayuno iniciado", "fast": new_fast.serialize()}), 201

@api.route('/fasting/status', methods=['GET'])
@jwt_required()
def get_fasting():
    user_id = get_jwt_identity()
    # Obtenemos el último ayuno activo
    last_fast = FastingLog.query.filter_by(user_id=user_id, end_time=None).order_by(FastingLog.id.desc()).first()
    if last_fast:
        return jsonify(last_fast.serialize()), 200
    return jsonify({"msg": "No hay ayuno activo"}), 404

@api.route('/fasting/stop', methods=['PUT'])
@jwt_required()
def stop_fasting():
    user_id = get_jwt_identity()
    # Buscamos el ayuno activo para ponerle hora de fin
    active_fast = FastingLog.query.filter_by(user_id=user_id, end_time=None).first()
    
    if not active_fast:
        return jsonify({"msg": "No hay un ayuno activo para terminar"}), 404
    
    active_fast.end_time = datetime.utcnow()
    db.session.commit()
    return jsonify({"msg": "Ayuno terminado", "fast": active_fast.serialize()}), 200

# --- 5. HIDRATACIÓN (SOLO AGUA) ---

@api.route('/daily-log/water', methods=['POST'])
@jwt_required()
def add_water_log():
    try:
        user_id = get_jwt_identity()
        body = request.get_json()
        
        # 1. Validamos que recibimos el dato
        water_amount = body.get("water")
        if water_amount is None:
            return jsonify({"msg": "No se recibió la cantidad de agua"}), 400

        # 2. Creamos el registro con TODOS los campos que pide tu modelo
        # Forzamos la fecha para que no use el default fallido del modelo
        new_log = DailyLog(
            user_id=user_id,
            meal_category="Hydration",
            food_name="Water Consumption",
            calories=0,
            water_ml=int(water_amount),
            date=datetime.utcnow().date() 
        )
        
        db.session.add(new_log)
        db.session.commit()
        
        return jsonify({"msg": "¡Guardado con éxito!", "total": water_amount}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error real en consola: {str(e)}") # Mira tu terminal de VS Code
        return jsonify({"msg": "Error interno", "error": str(e)}), 500