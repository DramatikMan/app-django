from aiohttp import web
from aiohttp.web_response import Response


routes = web.RouteTableDef()


@routes.get('/room')
async def get_rooms(request: web.Request) -> Response:
    return web.json_response({'status': 'OK'})


@routes.post('/room')
async def create_room(request: web.Request) -> Response:
    return web.json_response({'status': 'OK'})


app = web.Application()
app.add_routes(routes)
