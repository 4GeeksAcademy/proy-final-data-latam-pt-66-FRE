import os
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, DailyLog, FastingLog
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date

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
    new_user = User(email=body["email"],
                    password=password_hash, is_active=True)

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
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    body = request.get_json()
    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    first = body.get("first_name", "")
    last = body.get("last_name", "")
    if first or last:
        user.name = f"{first} {last}".strip()

    user.age = body.get("age", user.age)
    user.height = body.get("height", user.height)
    user.weight = body.get("weight", user.weight)
    user.diet_type = body.get("diet_type", user.diet_type)
    user.goal = body.get("goal", user.goal)

    db.session.commit()

    return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200


# ---------------- DAILY SUMMARY ----------------
@api.route('/daily-summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = int(get_jwt_identity())
    today = date.today()

    logs = DailyLog.query.filter_by(user_id=user_id, dates=today).all()
    user = db.session.get(User, user_id)

    total_c = sum(l.calories or 0 for l in logs)
    total_p = sum(l.protein or 0 for l in logs)
    total_carbs = sum(l.carbs or 0 for l in logs)
    total_f = sum(l.fat or 0 for l in logs)
    total_w = sum(l.water_ml or 0 for l in logs)

    return jsonify({
        "total_calories": total_c,
        "protein": total_p,
        "carbs": total_carbs,
        "fat": total_f,
        "total_water": total_w,
        "diet_type": user.diet_type if user else None
    }), 200


# ---------------- DAILY LOG ----------------
@api.route('/daily-log', methods=['POST'])
@jwt_required()
def add_log():
    user_id = int(get_jwt_identity())
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Body vacío"}), 400

    food = (body.get("food") or "").strip()
    category = (body.get("category") or "").strip()

    if not food or not category:
        return jsonify({"msg": "Faltan datos"}), 400

    try:
        new_log = DailyLog(
            user_id=user_id,
            meal_category=category,
            food_name=food,
            calories=int(body.get("calories", 0)),
            protein=float(body.get("protein", 0)),
            carbs=float(body.get("carbs", 0)),
            fat=float(body.get("fat", 0)),
            water_ml=int(body.get("water", 0)),
            dates=date.today()
        )

        db.session.add(new_log)
        db.session.commit()

        return jsonify({"log": new_log.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error", "error": str(e)}), 500


@api.route('/daily-log', methods=['GET'])
@jwt_required()
def get_daily_log():
    user_id = int(get_jwt_identity())
    today = date.today()

    logs = DailyLog.query.filter_by(user_id=user_id, dates=today).all()

    return jsonify([log.serialize() for log in logs]), 200


@api.route('/daily-log/<int:log_id>', methods=['PUT'])
@jwt_required()
def update_log(log_id):
    user_id = int(get_jwt_identity())
    log = DailyLog.query.filter_by(id=log_id, user_id=user_id).first()

    if not log:
        return jsonify({"msg": "Registro no encontrado"}), 404

    body = request.get_json()

    log.food_name = body.get("food", log.food_name)
    log.meal_category = body.get("category", log.meal_category)
    log.calories = int(body.get("calories", log.calories))

    log.protein = float(body.get("protein", log.protein))
    log.carbs = float(body.get("carbs", log.carbs))
    log.fat = float(body.get("fat", log.fat))

    db.session.commit()

    return jsonify({"msg": "Actualizado", "log": log.serialize()}), 200


@api.route('/daily-log/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_log(log_id):
    user_id = int(get_jwt_identity())
    log = DailyLog.query.filter_by(id=log_id, user_id=user_id).first()

    if not log:
        return jsonify({"msg": "Registro no encontrado"}), 404

    db.session.delete(log)
    db.session.commit()

    return jsonify({"msg": "Eliminado correctamente"}), 200


# --- 4. AYUNO ---


@api.route('/fasting/status', methods=['GET'])
@jwt_required()
def get_fasting_status():
    """Obtiene el ayuno activo actual del usuario si existe."""
    user_id = get_jwt_identity()
    # Buscamos el último registro que no tenga end_time (ayuno en curso)
    active_fast = FastingLog.query.filter_by(
        user_id=user_id, end_time=None).first()

    if active_fast:
        return jsonify(active_fast.serialize()), 200
    return jsonify(None), 200


@api.route('/fasting/start', methods=['POST'])
@jwt_required()
def start_fasting():
    """Inicia un nuevo registro de ayuno."""
    user_id = get_jwt_identity()

    # Verificación de seguridad para evitar múltiples ayunos abiertos
    exists = FastingLog.query.filter_by(user_id=user_id, end_time=None).first()
    if exists:
        return jsonify({"msg": "Ya tienes un ayuno activo"}), 400

    new_fast = FastingLog(
        user_id=user_id,
        start_time=datetime.utcnow()
    )

    try:
        db.session.add(new_fast)
        db.session.commit()
        return jsonify(new_fast.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al iniciar ayuno", "error": str(e)}), 500


@api.route('/fasting/stop', methods=['PUT'])
@jwt_required()
def stop_fasting():
    """Detiene el ayuno actual y calcula la duración total."""
    user_id = get_jwt_identity()
    active_fast = FastingLog.query.filter_by(
        user_id=user_id, end_time=None).first()

    if not active_fast:
        return jsonify({"msg": "No se encontró un ayuno activo para detener"}), 404

    # Marcamos la hora de finalización
    active_fast.end_time = datetime.utcnow()

    # --- CÁLCULO DE DURACIÓN ---
    diff = active_fast.end_time - active_fast.start_time
    total_seconds = int(diff.total_seconds())

    # Desglosamos los segundos en formato legible
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    duration_msg = f"{hours}h {minutes}m {seconds}s"

    try:
        db.session.commit()
        return jsonify({
            "msg": "Ayuno completado con éxito",
            "duration": duration_msg,
            "fast": active_fast.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar el fin del ayuno", "error": str(e)}), 500

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
            dates=datetime.utcnow().date()
        )

        db.session.add(new_log)
        db.session.commit()

        return jsonify({"msg": "¡Guardado con éxito!", "total": water_amount}), 201

    except Exception as e:
        db.session.rollback()
        # Mira tu terminal de VS Code
        print(f"Error real en consola: {str(e)}")
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


# PLAN NUTRICIONAL


def generate_nutrition_plan(user):
    if not all([user.weight, user.height, user.age]):
        return None

    tmb = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5

    # Objetivo
    if user.goal == "lose":
        calories = tmb - 500
    elif user.goal == "gain":
        calories = tmb + 300
    else:
        calories = tmb

    # Guardar en DB
    user.daily_calories_limit = int(calories)

    # Macros
    protein = user.weight * 2
    fat = user.weight * 0.8
    carbs = (calories - (protein * 4 + fat * 9)) / 4

    return {
        "calories": int(calories),
        "protein": int(protein),
        "fat": int(fat),
        "carbs": int(carbs)
    }


@api.route('/nutrition-plan', methods=['GET'])
@jwt_required()
def get_nutrition_plan():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    plan = generate_nutrition_plan(user)

    if not plan:
        return jsonify({"msg": "Faltan datos"}), 400

    user.daily_calories_limit = plan["calories"]
    db.session.commit()

    return jsonify(plan), 200


# RECOMENDACIONES

def generate_ai_recommendations(user, total_calories, total_water):
    recommendations = []

    # Calorías
    if user.daily_calories_limit:
        if total_calories < user.daily_calories_limit * 0.7:
            recommendations.append(
                "Estás comiendo muy poco hoy, considera aumentar tu ingesta 🍽️")
        elif total_calories > user.daily_calories_limit:
            recommendations.append(
                "Has superado tus calorías, intenta equilibrar tus próximas comidas ⚠️")
        else:
            recommendations.append("Vas muy bien con tus calorías 👌")

    # Agua
    if total_water < 1500:
        recommendations.append("Te falta hidratación 💧 intenta beber más agua")
    elif total_water >= 2000:
        recommendations.append("Excelente hidratación hoy 💦")

    # Objetivo
    if user.goal == "lose":
        recommendations.append(
            "Prioriza proteína y reduce azúcares para perder grasa 🔥")
    elif user.goal == "gain":
        recommendations.append(
            "Aumenta proteína y calorías para ganar músculo 💪")

    # Tipo de dieta
    if user.diet_type == "Keto":
        recommendations.append(
            "Evita carbohidratos y enfócate en grasas saludables 🥑")
    elif user.diet_type == "Vegana":
        recommendations.append(
            "Asegura proteína con legumbres, tofu y quinoa 🌱")

    return recommendations


@api.route('/ai-recommendations', methods=['GET'])
@jwt_required()
def get_ai_recommendations():
    user_id = get_jwt_identity()
    today = datetime.utcnow().date()

    user = User.query.get(user_id)
    logs = DailyLog.query.filter_by(user_id=user_id, dates=today).all()

    total_calories = sum(l.calories for l in logs)
    total_water = sum(l.water_ml for l in logs)

    recommendations = generate_ai_recommendations(
        user, total_calories, total_water)

    return jsonify({
        "recommendations": recommendations
    }), 200

# hitorialpage


@api.route('/user-history', methods=['GET'])
@jwt_required()
def get_user_history():
    user_id = get_jwt_identity()
    history = []

    # 1. Logs de Comida e Hidratación (DailyLog)
    daily_logs = DailyLog.query.filter_by(user_id=user_id).all()
    for log in daily_logs:
        # Usamos los nombres reales de tus columnas según el Admin Panel
        categoria = getattr(log, 'meal_category', 'Comida')
        alimento = getattr(log, 'food_name', 'Registro')
        ml = getattr(log, 'water_ml', 0) or 0
        cal = getattr(log, 'calories', 0) or 0

        # Mapeamos al español para el frontend
        category_name = "Hidratación" if categoria == "Hydration" else "Comida"

        history.append({
            "dates": log.dates.isoformat() if log.dates else datetime.utcnow().isoformat(),
            "category": category_name,
            "food": alimento,
            "water": ml,
            "calories": cal
        })

    # 2. Logs de Ayuno (FastingLog) - Ya funcionaba bien
    fasting_logs = FastingLog.query.filter_by(
        user_id=user_id).filter(FastingLog.end_time != None).all()
    for fast in fasting_logs:
        diff = fast.end_time - fast.start_time
        h, res = divmod(int(diff.total_seconds()), 3600)
        m, s = divmod(res, 60)

        history.append({
            "dates": fast.end_time.isoformat(),
            "category": "Ayuno",
            "food": "Sesión terminada",
            "duration": f"{h}h {m}m {s}s",
            "calories": 0
        })

    history.sort(key=lambda x: x['dates'], reverse=True)
    return jsonify(history), 200
