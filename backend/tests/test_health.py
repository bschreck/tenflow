from httpx import AsyncClient


async def test_root(async_client: AsyncClient):
    r = await async_client.get('/')
    assert r.status_code == 200
    assert 'message' in r.json()


async def test_health(async_client: AsyncClient):
    r = await async_client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'healthy'
