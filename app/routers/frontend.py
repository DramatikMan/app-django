import aiohttp_jinja2
from aiohttp import web


routes = web.RouteTableDef()


@routes.get('/')
@aiohttp_jinja2.template('index.html')
async def root(request: web.Request) -> dict[str, str]:
    return {'status': 'OK'}


@routes.get('/about')
@aiohttp_jinja2.template('index.html')
async def about(request: web.Request) -> dict[str, str]:
    return {'status': 'OK'}
