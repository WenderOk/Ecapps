FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости бэкенда
COPY backend/requirements.txt .

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код бэкенда
COPY backend/ ./backend/

# Копируем собранный фронтенд в ПРАВИЛЬНУЮ папку
COPY frontend/dist/ ./frontend/dist/

# Создаем переменные окружения
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production

# Открываем порт
EXPOSE 5000

# Запускаем приложение
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "backend.app:app"]