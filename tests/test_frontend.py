def test_root(client):
    response = client.get('/')
    assert response.status_code == 200


def test_webpack_bundle(client):
    response = client.get('/static/frontend/main.js')
    assert response.status_code == 200