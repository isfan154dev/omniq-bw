import logging
from typing import Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def detect_anomalies_prophet(
    actual_records: list[dict],
    forecast: list[dict],
    value_col: str = "rate",
    date_col: str = "date",
) -> list[dict]:
    actual_df = pd.DataFrame(actual_records)
    actual_df = actual_df.rename(columns={date_col: "ds", value_col: "y"})
    actual_df["ds"] = pd.to_datetime(actual_df["ds"])

    forecast_df = pd.DataFrame(forecast)
    forecast_df["ds"] = pd.to_datetime(forecast_df["ds"])

    merged = actual_df.merge(forecast_df, on="ds", how="inner")

    anomalies = []
    for _, row in merged.iterrows():
        is_anomaly = (row["y"] < row["yhat_lower"]) or (row["y"] > row["yhat_upper"])
        if is_anomaly:
            anomalies.append({
                "date": row["ds"].strftime("%Y-%m-%d"),
                "actual": row["y"],
                "expected": row["yhat"],
                "lower_bound": row["yhat_lower"],
                "upper_bound": row["yhat_upper"],
                "deviation_pct": round(
                    abs(row["y"] - row["yhat"]) / abs(row["yhat"]) * 100, 2
                ) if row["yhat"] != 0 else None,
                "direction": "above" if row["y"] > row["yhat_upper"] else "below",
                "method": "prophet",
            })

    logger.info(f"Prophet anomaly detection: {len(anomalies)} anomalies found")
    return anomalies


def detect_anomalies_zscore(
    records: list[dict],
    value_col: str = "rate",
    date_col: str = "date",
    threshold: float = 3.0,
    window: int = 30,
) -> list[dict]:
    df = pd.DataFrame(records)
    df = df.rename(columns={date_col: "ds", value_col: "y"})
    df["ds"] = pd.to_datetime(df["ds"])
    df = df.sort_values("ds").reset_index(drop=True)

    df["rolling_mean"] = df["y"].rolling(window=window, min_periods=7).mean()
    df["rolling_std"] = df["y"].rolling(window=window, min_periods=7).std()
    df["zscore"] = (df["y"] - df["rolling_mean"]) / df["rolling_std"].replace(0, np.nan)

    anomalies = []
    for _, row in df.iterrows():
        if pd.isna(row["zscore"]):
            continue
        if abs(row["zscore"]) > threshold:
            anomalies.append({
                "date": row["ds"].strftime("%Y-%m-%d"),
                "actual": row["y"],
                "expected": row["rolling_mean"],
                "zscore": round(row["zscore"], 3),
                "deviation_pct": round(
                    abs(row["y"] - row["rolling_mean"]) / abs(row["rolling_mean"]) * 100, 2
                ) if row["rolling_mean"] != 0 else None,
                "direction": "above" if row["zscore"] > 0 else "below",
                "method": "zscore",
            })

    logger.info(f"Z-score anomaly detection: {len(anomalies)} anomalies found")
    return anomalies


def detect_anomalies(
    records: list[dict],
    forecast: Optional[list[dict]] = None,
    value_col: str = "rate",
    date_col: str = "date",
    zscore_threshold: float = 3.0,
) -> dict:
    results = {
        "prophet": [],
        "zscore": [],
        "summary": {},
    }

    if forecast:
        results["prophet"] = detect_anomalies_prophet(
            records, forecast, value_col=value_col, date_col=date_col
        )

    results["zscore"] = detect_anomalies_zscore(
        records, value_col=value_col, date_col=date_col, threshold=zscore_threshold
    )

    results["summary"] = {
        "total_records": len(records),
        "prophet_anomalies": len(results["prophet"]),
        "zscore_anomalies": len(results["zscore"]),
        "method_used": "prophet+zscore" if forecast else "zscore_only",
    }

    return results
