from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from data.collectors.cbu_collector import fetch_rates_range
from data.forecasting.prophet_model import forecast_currency
from data.anomaly.detector import detect_anomalies

router = APIRouter(prefix="/api/v1", tags=["analytics"])


@router.get("/forecast/{currency}")
async def get_forecast(
    currency: str,
    periods: int = Query(default=90, ge=7, le=365),
    history_days: int = Query(default=730, ge=90, le=1825),
):
    currency = currency.upper()
    if currency not in ["USD", "EUR", "RUB", "CNY"]:
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {currency}")

    end_date = date.today()
    start_date = end_date - timedelta(days=history_days)

    records = await fetch_rates_range(currency, start_date, end_date)
    if not records:
        raise HTTPException(status_code=503, detail="Failed to fetch data from CBU")

    result = forecast_currency(records, currency=currency, periods=periods)
    if not result:
        raise HTTPException(status_code=500, detail="Forecasting failed")

    return result


@router.get("/anomalies/{currency}")
async def get_anomalies(
    currency: str,
    history_days: int = Query(default=365, ge=90, le=1825),
    zscore_threshold: float = Query(default=3.0, ge=1.0, le=5.0),
    with_forecast: bool = Query(default=True),
):
    currency = currency.upper()
    if currency not in ["USD", "EUR", "RUB", "CNY"]:
        raise HTTPException(status_code=400, detail=f"Unsupported currency: {currency}")

    end_date = date.today()
    start_date = end_date - timedelta(days=history_days)

    records = await fetch_rates_range(currency, start_date, end_date)
    if not records:
        raise HTTPException(status_code=503, detail="Failed to fetch data from CBU")

    forecast = None
    if with_forecast:
        forecast_result = forecast_currency(records, currency=currency, periods=30)
        if forecast_result:
            forecast = forecast_result["forecast"]

    result = detect_anomalies(
        records,
        forecast=forecast,
        zscore_threshold=zscore_threshold,
    )
    result["currency"] = currency
    return result


@router.get("/macro/{metric}")
async def get_macro(
    metric: str,
):
    valid_metrics = ["gdp_nominal_uzs", "gdp_usd", "inflation_cpi", "unemployment_rate"]
    if metric not in valid_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metric. Choose from: {valid_metrics}"
        )

    from data.collectors.stat_collector import fetch_stat_uz_data
    records = await fetch_stat_uz_data()
    if not records:
        raise HTTPException(status_code=503, detail="Failed to fetch data from stat.uz")

    filtered = [r for r in records if r.get("metric") == metric]
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No data found for metric: {metric}")

    return {
        "metric": metric,
        "count": len(filtered),
        "data": sorted(filtered, key=lambda x: x["period"]),
    }
