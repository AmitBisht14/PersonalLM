from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from app.routers import chat
from app.pdf_processor.routers import pdf_router
from app.configuration.routers import config_router
from app.summary.routers.summary_router import router as summary_router
from app.core.config import get_settings
from app.models.responses import ErrorResponse
from fastapi.openapi.docs import get_swagger_ui_html

settings = get_settings()

# Custom dark mode HTML template
SWAGGER_UI_DARK_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css">
    <title>{title}</title>
    <style>
        :root {{
            --background-color: #1a1a1a;
            --text-color: #ffffff;
        }}
        body {{
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }}
        .swagger-ui {{
            background-color: var(--background-color);
            color: var(--text-color);
        }}
        .swagger-ui .info .title,
        .swagger-ui .info .description,
        .swagger-ui .scheme-container,
        .swagger-ui .opblock .opblock-summary-description,
        .swagger-ui .opblock-description-wrapper p,
        .swagger-ui .opblock-external-docs-wrapper,
        .swagger-ui .opblock-title_normal,
        .swagger-ui table thead tr td,
        .swagger-ui table thead tr th,
        .swagger-ui .parameter__name,
        .swagger-ui .parameter__type,
        .swagger-ui .parameter__deprecated,
        .swagger-ui .parameter__in,
        .swagger-ui .response-col_status,
        .swagger-ui .response-col_description,
        .swagger-ui .tab li,
        .swagger-ui .opblock-tag {{
            color: var(--text-color) !important;
        }}
        .swagger-ui .opblock {{
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
        }}
        .swagger-ui .opblock .opblock-summary {{
            border-color: rgba(255, 255, 255, 0.1);
        }}
        .swagger-ui .scheme-container {{
            background: rgba(255, 255, 255, 0.05);
        }}
        .swagger-ui input {{
            background-color: #333 !important;
            color: var(--text-color) !important;
        }}
        .swagger-ui textarea {{
            background-color: #333 !important;
            color: var(--text-color) !important;
        }}
        .swagger-ui select {{
            background-color: #333 !important;
            color: var(--text-color) !important;
        }}
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function() {{
            window.ui = SwaggerUIBundle({{
                url: '{openapi_url}',
                dom_id: '#swagger-ui',
                deepLinking: true,
                defaultModelsExpandDepth: -1,
                syntaxHighlight: {{
                    theme: 'obsidian'
                }},
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ],
            }});
        }}
    </script>
</body>
</html>
'''

app = FastAPI(
    title=settings.app_name,
    description="API for interacting with OpenAI's GPT models",
    docs_url=None  # Disable default docs to use custom route
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom docs endpoint with dark mode
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return HTMLResponse(
        SWAGGER_UI_DARK_TEMPLATE.format(
            title=app.title + " - Swagger UI",
            openapi_url=app.openapi_url
        )
    )

# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(pdf_router.router)
app.include_router(config_router.router)
app.include_router(summary_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    error_response = ErrorResponse(
        status="error",
        message="An unexpected error occurred",
        error_code="INTERNAL_SERVER_ERROR",
        details={"error": str(exc)}
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": f"Welcome to {settings.app_name}"}
