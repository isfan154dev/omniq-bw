import asyncio
from datetime import date, timedelta
import logging
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

CBU_JSON_URL = "https://cbu.uz/uz/arkhiv-kursov-valyut/json/{currency}/{date}/"
CURRENCIES = ["USD", "EUR", "RUB", "CNY"]


async def fetch_rate_for_date(
    client: httpx.AsyncClient,
    currency: str,
    target_date: date,
) -> Optional[dict]:
    url = CBU_JSON_URL.format(
        currency=currency,
        date=target_date.strftime("%Y-%m-%d"),
    )
    try:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        if not data:
            return None
        item = data[0]
        return {
            "date": target_date.isoformat(),
            "currency": currency,
            "rate": float(item.get("Rate", 0)),
            "diff": float(item.get("Diff", 0)),
        }
    except Exception as e:
        logger.warning(f"Failed to fetch {currency} for {target_date}: {e}")
        return None


async def fetch_rates_range(
    currency: str,
    start_date: date,
    end_date: date,
    delay_seconds: float = 0.1,
) -> list[dict]:
    results = []
    async with httpx.AsyncClient() as client:
        current = start_date
        while current <= end_date:
            if current.weekday() < 5:
                record = await fetch_rate_for_date(client, currency, current)
                if record:
                    results.append(record)
                await asyncio.sleep(delay_seconds)
            current += timedelta(days=1)
    return results


async def fetch_all_currencies(
    start_date: date,
    end_date: date,
) -> list[dict]:
    all_records = []
    for currency in CURRENCIES:
        logger.info(f"Fetching {currency} from {start_date} to {end_date}")
        records = await fetch_rates_range(currency, start_date, end_date)
        all_records.extend(records)
        logger.info(f"Got {len(records)} records for {currency}")
    return all_records


if __name__ == "__main__":
    records = asyncio.run(fetch_rates_range(
        "USD",
        date(2024, 1, 1),
        date(2024, 1, 10),
    ))
    for r in records:
        print(r)
