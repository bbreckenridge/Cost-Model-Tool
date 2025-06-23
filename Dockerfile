FROM python:3.11-slim AS backend

WORKDIR /app
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ .

FROM node:20 AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/vite.config.js ./
RUN npm install
COPY frontend/src ./src
RUN npm run build

FROM backend AS final
WORKDIR /app
COPY --from=frontend /frontend/dist ./frontend_dist
EXPOSE 8000
CMD [""uvicorn"", ""main:app"", ""--host"", ""0.0.0.0"", ""--port"", ""8000""]
