# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ef0b3e86-5156-442a-9c12-81471c8bfc42

# Sri Sai Kitchen — Local Development

This repository contains a Vite + React frontend and a FastAPI backend (in `srisaikitchen_api`).

Quick start (backend)

1. Copy env example and update values:

```bash
cp .env.example .env
# edit .env and set MYSQL_* values to match your local DB
```

2. Create the MySQL database (if using MySQL):

```sql
CREATE DATABASE srisaikitchen;
```

3. Install Python deps and run the API:

```bash
python3 -m pip install -r requirements.txt
python3 -m uvicorn backend.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Endpoints:
- `GET /` - health check
- `GET /products` - list products with variants
- `GET /products/{id}` - product by id
- `GET /products/slug/{slug}` - product by slug (generated from name)
- `POST /orders` - create order


Frontend

1. Set frontend env:

```bash
# in zsh or bash
export VITE_API_BASE_URL=http://localhost:8000
```

or add to `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

2. Install and run frontend:

```bash
npm install
npm run dev
```

Search and product pages will use the backend when `VITE_API_BASE_URL` is set.


Troubleshooting

- If the backend fails to start, check `.env` and database credentials. The backend tries to connect to the DB on startup to create tables.
- To avoid DB dependency during development, you can temporarily mock the API or run a simple SQLite replacement (I can help add that).

If you'd like, I can attempt to run the backend here to smoke-test the endpoints (I will install requirements and start uvicorn). 
