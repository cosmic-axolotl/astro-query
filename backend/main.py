from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title='AstroQuery API',
    description='API para consulta de objetos astronômicos em múltiplos catálogos.',
    version='0.2.0',
)


app = FastAPI()
origins = [
    "https://cosmic-axolotl.github.io",
    "http://localhost:5173",  
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
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