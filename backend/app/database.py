"""
OMNIQ Platform - Neo4j access through the official async Python driver.
"""
from typing import Any, List, Optional

from neo4j import AsyncDriver, AsyncGraphDatabase

from app.config import settings


class DatabaseManager:
    def __init__(self) -> None:
        self._driver: Optional[AsyncDriver] = None
        self._is_connected = False

    def _has_credentials(self) -> bool:
        return bool(settings.neo4j_uri and settings.neo4j_user and settings.neo4j_password)

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    async def connect(self) -> None:
        if not self._has_credentials():
            self._is_connected = False
            print("[OMNIQ] Neo4j env vars missing")
            return

        await self.disconnect()

        self._driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )

        try:
            await self._driver.verify_connectivity()
            self._is_connected = True
            print(f"[OMNIQ] Neo4j driver ready: {settings.neo4j_uri}")
        except Exception:
            self._is_connected = False
            await self.disconnect()
            raise

    async def run_query(self, cypher: str, params: dict[str, Any] | None = None) -> List[dict[str, Any]]:
        if not self._driver:
            raise Exception("Neo4j driver not initialized")

        try:
            async with self._driver.session() as session:
                result = await session.run(cypher, params or {})
                records = await result.data()
        except Exception as exc:
            self._is_connected = False
            raise Exception(f"Neo4j query failed: {exc}") from exc

        self._is_connected = True
        return list(records)

    async def disconnect(self) -> None:
        if self._driver is not None:
            await self._driver.close()
            self._driver = None
        self._is_connected = False
        print("[OMNIQ] Neo4j disconnected")


db_manager = DatabaseManager()


async def get_db() -> DatabaseManager:
    return db_manager
