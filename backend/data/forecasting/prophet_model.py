import pandas as pd
import numpy as np
import logging
from typing import Optional
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)


def prepare_dataframe(records: list[dict], value_col: str = "rate") -> pd.DataFrame:
    df = pd.DataFrame(records)
    df = df.rename(columns={"date": "ds", value_col: "y"})
    df["ds"] = pd.to_datetime(df["ds"])
    df = df[["ds", "y"]].dropna().sort_values("ds").reset_index(drop=True)
    return df


def train_and_forecast(
    df: pd.DataFrame,
    periods: int = 90,
    freq: str = "D",
) -> dict:
    if len(df) < 30:
        raise ValueError(f"Need at least 30 data points, got {len(df)}")

    df = df.copy()
    df = df.set_index("ds")
    df.index.freq = pd.infer_freq(df.index)

    try:
        model = ARIMA(df["y"], order=(5, 1, 0))
        fitted = model.fit()
        forecast_result = fitted.get_forecast(steps=periods)
        forecast_mean = forecast_result.predicted_mean
        conf_int = forecast_result.conf_int(alpha=0.05)

        last_date = df.index.max()
        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(days=1),
            periods=periods,
            freq=freq
        )

        forecast = []
        for i, dt in enumerate(future_dates):
            forecast.append({
                "ds": dt.strftime("%Y-%m-%d"),
                "yhat": round(float(forecast_mean.iloc[i]), 2),
                "yhat_lower": round(float(conf_int.iloc[i, 0]), 2),
                "yhat_upper": round(float(conf_int.iloc[i, 1]), 2),
            })

        return {
            "forecast": forecast,
            "model_params": {
                "method": "ARIMA(5,1,0)",
                "periods": periods,
                "freq": freq,
                "training_points": len(df),
                "training_from": df.index.min().strftime("%Y-%m-%d"),
                "training_to": df.index.max().strftime("%Y-%m-%d"),
                "aic": round(float(fitted.aic), 2),
            }
        }

    except Exception as e:
        logger.warning(f"ARIMA failed: {e}, falling back to linear regression")
        from sklearn.linear_model import LinearRegression
        df = df.reset_index()
        df["t"] = (df["ds"] - df["ds"].min()).dt.days
        X = df[["t"]].values
        y = df["y"].values
        model = LinearRegression()
        model.fit(X, y)
        last_t = df["t"].max()
        last_date = df["ds"].max()
        future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods, freq=freq)
        future_t = np.array([[last_t + i + 1] for i in range(periods)])
        yhat = model.predict(future_t)
        residuals = y - model.predict(X)
        std = np.std(residuals)
        margin = 1.96 * std
        forecast = []
        for i, dt in enumerate(future_dates):
            forecast.append({
                "ds": dt.strftime("%Y-%m-%d"),
                "yhat": round(float(yhat[i]), 2),
                "yhat_lower": round(float(yhat[i] - margin), 2),
                "yhat_upper": round(float(yhat[i] + margin), 2),
            })
        return {
            "forecast": forecast,
            "model_params": {
                "method": "linear_regression_fallback",
                "periods": periods,
                "training_points": len(df),
            }
        }


def forecast_currency(
    records: list[dict],
    currency: str,
    periods: int = 90,
) -> Optional[dict]:
    currency_records = [r for r in records if r.get("currency") == currency]
    if not currency_records:
        logger.warning(f"No records found for currency {currency}")
        return None

    df = prepare_dataframe(currency_records, value_col="rate")
    logger.info(f"Training ARIMA for {currency} on {len(df)} points")

    result = train_and_forecast(df, periods=periods)
    result["currency"] = currency
    return result


def forecast_macro(
    records: list[dict],
    metric: str,
    periods: int = 5,
    freq: str = "A",
) -> Optional[dict]:
    metric_records = [r for r in records if r.get("metric") == metric]
    if not metric_records:
        logger.warning(f"No records found for metric {metric}")
        return None

    df = prepare_dataframe(metric_records, value_col="value")
    logger.info(f"Training ARIMA for {metric} on {len(df)} points")

    result = train_and_forecast(df, periods=periods, freq=freq)
    result["metric"] = metric
    return result
