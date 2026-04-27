from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import search
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

load_dotenv()

app = FastAPI(
    title='AstroQuery API',
    description='API para consulta de objetos astronômicos em múltiplos catálogos.',
    version='0.2.0',
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cosmic-axolotl.github.io",
        "http://localhost:5173",  
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=["*"],
)
app.include_router(search.router)


@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str, request: Request):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "https://cosmic-axolotl.github.io",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get('/', tags=['Health'])
async def root():
    '''Verifica se o servidor está online.'''
    return {
        'status':  'online',
        'name':    'AstroQuery API',
        'version': '0.2.0',
        'docs':    '/docs',
    }