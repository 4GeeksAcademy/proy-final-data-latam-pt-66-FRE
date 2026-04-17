from api.utils import generate_sitemap, APIException
from api.models import db, User
from flask import Flask, request, jsonify, url_for, Blueprint
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, DailyLog
from flask_cors import CORS

api = Blueprint('api', __name__)
"""
    This module takes care of starting the API Server, Loading the DB and Adding the endpoints
    """

api = Blueprint('api', __name__)


CORS(api)


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get(
        "email"), password=body.get("password")).first()
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
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# foods = []
# current_id = 1

#  GET


# @app.route('/foods', methods=['GET'])
# def get_foods():
#     return jsonify(foods), 200

#  POST


# @app.route('/foods', methods=['POST'])
# def create_food():
#     global current_id
#     data = request.json

#     new_food = {
#         "id": current_id,
#         "name": data["name"],
#         "calories": data["calories"],
#         "category": data["category"]
#     }

#     foods.append(new_food)
#     current_id += 1

#     return jsonify(new_food), 201

#  PUT


# @app.route('/foods/<int:id>', methods=['PUT'])
# def update_food(id):
#     data = request.json

#     for food in foods:
#         if food["id"] == id:
#             food.update(data)
#             return jsonify(food), 200

#     return jsonify({"msg": "Not found"}), 404

#  DELETE


# @app.route('/foods/<int:id>', methods=['DELETE'])
# def delete_food(id):
#     global foods
#     foods = [f for f in foods if f["id"] != id]
#     return jsonify({"msg": "Deleted"}), 200

# @app.route('/foods', methods=['DELETE'])
# def delete_all_foods():
#     global foods
#     foods = []
#     return jsonify({"msg": "All foods deleted"}), 200


# if __name__ == "__main__":
#     app.run(debug=True, port=3001)
