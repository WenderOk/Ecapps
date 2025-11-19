# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from database import db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend', 'dist')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app, origins = ["http://localhost:5000", "https://dom-molodezi-ycapps-wenwu.amvera.io" ]) 

# Маршрут для раздачи статических файлов
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    app.logger.debug(f'Serving path: {path}')
    app.logger.debug(f'Static folder: {app.static_folder}')
    
    # Проверяем существование статической папки
    if not os.path.exists(app.static_folder):
        app.logger.error(f'Static folder does not exist: {app.static_folder}')
        return "Static files not found", 500
    
    # Если путь существует - отдаем файл, иначе - index.html
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# API для получения пользователя по Telegram ID
@app.route('/api/user/<int:telegram_id>', methods=['GET'])
def get_user(telegram_id):
    try:
        user = db.get_user_by_telegram_id(telegram_id)
        if user:
            return jsonify({
                'success': True,
                'user': user
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# API для создания/получения пользователя
@app.route('/api/user/', methods=['POST'])
def create_or_get_user():
    try:
        telegram_data = request.json
        user_id = db.get_or_create_user_by_telegram(telegram_data)
        user = db.get_user_by_telegram_id(telegram_data['id'])
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'user': user
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# API для административных функций
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        # В реальном приложении здесь должна быть проверка авторизации
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users')
            users = [dict(row) for row in cursor.fetchall()]
            
        return jsonify({
            'success': True,
            'users': users
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/admin/users', methods=['POST'])
def add_user_admin():
    try:
        user_data = request.json
        user_id = db.add_user(user_data)
        
        return jsonify({
            'success': True,
            'user_id': user_id
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user_admin(user_id):
    try:
        success = db.delete_user(user_id)
        
        return jsonify({
            'success': success,
            'message': 'User deleted' if success else 'User not found'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/discounts', methods=['POST'])
def add_discount():
        try:
            discount_data = request.json
            discount_id = db.add_discount(discount_data)
            
            return jsonify({
                'success': True,
                'user_id': discount_id
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
        }), 500

@app.route('/api/discounts', methods=['GET'])
def get_all_discounts():
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM discounts')
            discounts = [dict(row) for row in cursor.fetchall()]
            
        return jsonify({
            'success': True,
            'discounts': discounts
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/discounts/<int:discount_id>', methods=['DELETE'])
def delete_discount(discount_id):
    try:
        success = db.delete_discount(discount_id)
        
        return jsonify({
            'success': success,
            'message': 'Discount deleted' if success else 'Discount not found'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# API для получения статистики
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        user_count = db.get_user_count()
        business_count = db.get_business_count()
        
        return jsonify({
            'success': True,
            'stats': {
                'users': user_count,
                'businesses': business_count
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)