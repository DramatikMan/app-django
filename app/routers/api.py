from aiohttp import web


routes = web.RouteTableDef()


@routes.post('/room')
async def create_room(request: web.Request):
    return {'text': 'hi'}


app = web.Application()
app.add_routes(routes)
