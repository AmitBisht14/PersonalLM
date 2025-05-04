# PersonalLM Backend

This is the FastAPI backend for the PersonalLM application.

## Development Setup

### Starting the Development Server

To start the development server with auto-reload enabled, run:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000` by default.

### API Documentation

Once the server is running, you can access:
- Swagger UI documentation at `http://localhost:8000/docs`
- ReDoc documentation at `http://localhost:8000/redoc`
