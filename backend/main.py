from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title='AstroQuery API',
    description='API para consulta de objetos astronômicos em múltiplos catálogos.',
    version='0.2.0',
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cosmic-axolotl.github.io",
        "http://localhost:5173",  # dev local
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=['GET','POST','OPTIONS'],
    allow_headers=["*"],
)
from routers import search
app.include_router(search.router)


@app.get('/', tags=['Health'])
async def root():
    '''Verifica se o servidor está online.'''
    return {
        'status':  'online',
        'name':    'AstroQuery API',
        'version': '0.2.0',
        'docs':    '/docs',
    }