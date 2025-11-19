# database.py
import sqlite3
from datetime import datetime
import random
import string
import logging
from contextlib import contextmanager

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self, db_path='youth_card.db'):
        self.db_path = db_path
        self.init_db()
    
    @contextmanager
    def get_connection(self):
        """Контекстный менеджер для соединений с автоматическим закрытием"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Возвращаем словари вместо кортежей
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            conn.close()
    
    def init_db(self):
        """Инициализация базы данных"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Включаем внешние ключи
            cursor.execute('PRAGMA foreign_keys = ON')
            
            # Таблица пользователей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    telegram_id INTEGER PRIMARY KEY UNIQUE NOT NULL,
                    telegram_username TEXT,
                    card_number TEXT UNIQUE NOT NULL,
                    card_active BOOLEAN DEFAULT TRUE,
                    UNIQUE(telegram_id, card_number)
                )
            ''')
            
            # Таблица скидок(бизнесов)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS discounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_name TEXT NOT NULL,
                    discount_percentage INTEGER CHECK(discount_percentage >= 0 AND discount_percentage <= 100)
                )
            ''')
            
            logger.info("Database initialized successfully")

    def generate_card_number(self):
        """Генерация уникального номера карты с проверкой уникальности"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            attempts = 0
            while attempts < 10:  # Защита от бесконечного цикла
                card_number = 'YM' + ''.join(random.choices(string.digits, k=8))
                cursor.execute('SELECT telegram_id FROM users WHERE card_number = ?', (card_number,))
                if not cursor.fetchone():
                    return card_number
                attempts += 1
            raise Exception("Could not generate unique card number")

    def get_or_create_user_by_telegram(self, telegram_data):
        """Получить или создать пользователя по данным Telegram"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Проверяем существующего пользователя
            cursor.execute(
                'SELECT telegram_username FROM users WHERE telegram_username = ?', 
                (telegram_data['username'],)
            )
            user = cursor.fetchone()
            
            if user:
                username = user['username']
                # Обновляем последний вход и данные
                cursor.execute('''
                    UPDATE users 
                    SET telegram_id = ?
                    WHERE username = ?
                ''', (
                    telegram_data['telegram_id'],
                    username
                ))
            else:
                # Создаем нового пользователя
                card_number = self.generate_card_number()
                cursor.execute('''
                    INSERT INTO users 
                    (telegram_id, telegram_username, card_number)
                    VALUES (?, ?, ?)
                ''', (
                    telegram_data['telegram_id'],
                    telegram_data['username'],
                    card_number
                ))
                username = cursor.lastrowid
                logger.info(f"Created new user: {username} with card: {card_number}")
            
            return username

    def get_user_by_telegram_id(self, telegram_id):
        """Получить пользователя по Telegram ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,))
            user = cursor.fetchone()
            return dict(user) if user else None

    def get_user_count(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT COUNT(*) as count FROM users')
            return cursor.fetchone()['count']

    def get_discount_count(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT COUNT(*) as count FROM businesses')
            return cursor.fetchone()['count']
        
    def add_user(self, user_data):
        """Добавить пользователя (для админки)"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            card_number = self.generate_card_number()
            # Генерируем уникальный telegram_id для пользователей созданных через админку
            # fake_telegram_id = int(hash(user_data['telegram_id']) % 1000000000)
            
            cursor.execute('''
                INSERT INTO users (telegram_id, telegram_username, card_number)
                VALUES (?, ?, ?)
            ''', (
                user_data['telegram_id'],  # Убеждаемся что положительное число
                user_data['username'],
                card_number
                
            ))
            user_id = cursor.lastrowid
            logger.info(f"Admin created user: {user_id} with card: {card_number}")
            return user_id

    def delete_user(self, user_id):
        """Удалить пользователя"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM users WHERE telegram_id = ?', (user_id,))
            affected = cursor.rowcount
            if affected > 0:
                logger.info(f"Deleted user: {user_id}")
            return affected > 0

    def add_discount(self, business_data):
        """Добавить бизнес"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # coordinates = business_data['coordinates']
            # if not isinstance(coordinates, (list, tuple)) or len(coordinates) != 2:
            #     raise ValueError("Coordinates must be a list/tuple of [lat, lon]")
            
            cursor.execute('''
                INSERT INTO discounts
                (company_name, discount_percentage)
                VALUES (?, ?)
            ''', (
                business_data['company_name'],
                business_data['discount_percentage'],
            ))
            business_id = cursor.lastrowid
            logger.info(f"Added discount: {business_id} - {business_data['company_name']}")
            return business_id

    def delete_discount(self, business_id):
        """Удалить бизнес"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM discounts WHERE id = ?', (business_id,))
            affected = cursor.rowcount
            if affected > 0:
                logger.info(f"Deleted discount: {business_id}")
            return affected > 0

# Создаем экземпляр базы данных
db = Database()