import logging
from typing import Optional
import xml.etree.ElementTree as ET

import httpx

logger = logging.getLogger(__name__)

STAT_UZ_SDMX_URL = "https://stat.uz/img/uploads/download_xml/nag_uzbekistan_mcd.xml"

INDICATOR_MAP = {
    "NGDP_PA_XDC": "gdp_nominal_uzs",
    "NGDPD": "gdp_usd",
    "PCPI_PC_CP_A_PT": "inflation_cpi",
    "LUR": "unemployment_rate",
}


def parse_sdmx_xml(xml_content: str) -> list[dict]:
    records = []
    try:
        root = ET.fromstring(xml_content)
        for series in root.iter():
            if "Series" not in series.tag:
                continue
            attribs = series.attrib
            indicator = attribs.get("INDICATOR", "")
            if indicator not in INDICATOR_MAP:
                continue
            metric_name = INDICATOR_MAP[indicator]
            freq = attribs.get("FREQ", "A")
            for obs in series:
                if "Obs" not in obs.tag:
                    continue
                period = obs.attrib.get("TIME_PERIOD", "")
                value = obs.attrib.get("OBS_VALUE", "")
                if period and value:
                    try:
                        records.append({
                            "period": period,
                            "metric": metric_name,
                            "value": float(value),
                            "frequency": freq,
                            "source": "stat.uz/IMF",
                        })
                    except ValueError:
                        pass
    except ET.ParseError as e:
        logger.error(f"XML parse error: {e}")
    return records


async def fetch_stat_uz_data() -> list[dict]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(STAT_UZ_SDMX_URL)
            response.raise_for_status()
            records = parse_sdmx_xml(response.text)
            logger.info(f"Fetched {len(records)} macro records from stat.uz")
            return records
        except Exception as e:
            logger.error(f"Failed to fetch stat.uz data: {e}")
            return []


if __name__ == "__main__":
    import asyncio

    records = asyncio.run(fetch_stat_uz_data())
    for r in records[:10]:
        print(r)
