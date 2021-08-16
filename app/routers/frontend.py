import os
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.templating import _TemplateResponse


router = APIRouter()

path_templates = Path(os.environ['PWD']) / 'app/frontend/templates'
templates = Jinja2Templates(directory=str(path_templates))


@router.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse(
        'index.html',
        {'request': request}
    )


@router.get('/about', response_class=HTMLResponse)
async def about(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse(
        'index.html',
        {'request': request}
    )


@router.get('/create', response_class=HTMLResponse)
async def create(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse(
        'index.html',
        {'request': request}
    )


@router.get('/room/{room_code}', response_class=HTMLResponse)
async def room(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse(
        'index.html',
        {'request': request}
    )
