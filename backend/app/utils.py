from contextlib import asynccontextmanager, AsyncExitStack
from typing import Any, AsyncGenerator, Callable, TypeVar

from fastapi import FastAPI


T = TypeVar('T')
C = Callable[[], AsyncGenerator[T, None]]


def lifetime(app: FastAPI) -> Callable[[C[T]], Callable[[], T]]:
    def wrapper(func: C[T]) -> Callable[[], T]:
        cm_factory = asynccontextmanager(func)
        stack = AsyncExitStack()
        start, shutdown = 'App not started yet.', 'App already shut down.'
        value: Any = start

        @app.on_event('startup')
        async def _startup() -> None:
            nonlocal value
            value = await stack.enter_async_context(cm_factory())

        @app.on_event('shutdown')
        async def _shutdown() -> None:
            await stack.pop_all().aclose()
            nonlocal value
            value = shutdown

        def get_value() -> Any:
            if value is start:
                raise RuntimeError(start)

            if value is shutdown:
                raise RuntimeError(shutdown)

            return value

        return get_value

    return wrapper
