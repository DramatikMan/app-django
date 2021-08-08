from pathlib import Path

from aiohttp import web
import jinja2
import aiohttp_jinja2


routes = web.RouteTableDef()
template_path = Path().resolve() / 'app' / 'frontend' / 'templates'
loader = jinja2.FileSystemLoader(template_path.resolve())


@routes.get('/')
@aiohttp_jinja2.template('index.html')
async def hello(request: web.Request) -> dict[str, str]:
    name: str = request.match_info.get('name', 'Anonymous')
    text = 'Hello, ' + name
    return {'text': text}


def create_app() -> web.Application:
    app = web.Application()
    app.add_routes(routes)
    aiohttp_jinja2.setup(app, loader=loader)
    return app
