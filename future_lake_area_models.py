import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor

# Load pseudo-data
df = pd.read_csv("tsomgo_pseudo_data.csv")

print(df.head())

print("\nTotal rows:", len(df))

# INPUT
X = df[["year_decimal"]]

# OUTPUT
y = df["lake_area_sqkm"]

# ==========================================
# LINEAR REGRESSION FORECAST
# FUTURE LAKE AREA
# ==========================================

from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error

linear_model = LinearRegression()

linear_model.fit(X, y)

# Metrics on pseudo-data

linear_pred = linear_model.predict(X)

linear_r2 = r2_score(y, linear_pred)

linear_rmse = np.sqrt(
    mean_squared_error(y, linear_pred)
)

linear_mae = mean_absolute_error(
    y,
    linear_pred
)

print("\nLINEAR REGRESSION")

print(f"R² = {linear_r2:.4f}")

print(f"RMSE = {linear_rmse:.6f}")

print(f"MAE = {linear_mae:.6f}")

# Future years

future_years = pd.DataFrame({
    "year_decimal": list(range(2026, 2051))
})

linear_future_area = linear_model.predict(
    future_years
)

print("\nFuture Lake Area Prediction till 2050")

for year, area in zip(
    future_years["year_decimal"],
    linear_future_area
):

    print(
        f"{year}: {area:.6f} sq. km"
    )
    
    # ==========================================
# LINEAR FORECAST GRAPH
# ==========================================

all_years = pd.DataFrame({
    "year_decimal":
    list(range(2017, 2051))
})

all_predictions = linear_model.predict(
    all_years
)

plt.figure(figsize=(9,5))

plt.scatter(
    df["year_decimal"],
    df["lake_area_sqkm"],
    label="Pseudo-data"
)

plt.plot(
    all_years["year_decimal"],
    all_predictions,
    linewidth=2,
    label="Linear Forecast"
)

plt.xlabel("Year")

plt.ylabel("Lake Area (sq. km)")

plt.title(
    "Future Lake Area Prediction till 2050 (Linear Regression)"
)

plt.legend()

plt.grid(True)

plt.savefig(
    "future_lake_area_linear.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ==========================================
# POLYNOMIAL REGRESSION FORECAST
# FUTURE LAKE AREA
# ==========================================

poly = PolynomialFeatures(degree=2)

X_poly = poly.fit_transform(X)

poly_model = LinearRegression()

poly_model.fit(X_poly, y)

poly_pred = poly_model.predict(X_poly)

poly_r2 = r2_score(y, poly_pred)

poly_rmse = np.sqrt(
    mean_squared_error(y, poly_pred)
)

poly_mae = mean_absolute_error(
    y,
    poly_pred
)

print("\nPOLYNOMIAL REGRESSION")

print(f"R² = {poly_r2:.4f}")

print(f"RMSE = {poly_rmse:.6f}")

print(f"MAE = {poly_mae:.6f}")

future_years_poly = poly.transform(
    future_years
)

poly_future_area = poly_model.predict(
    future_years_poly
)

print("\nPolynomial Future Lake Area Prediction till 2050")

for year, area in zip(
    future_years["year_decimal"],
    poly_future_area
):
    print(f"{year}: {area:.6f} sq. km")
    
    # ==========================================
# POLYNOMIAL FORECAST GRAPH
# ==========================================

all_years_poly = poly.transform(
    all_years
)

all_poly_predictions = poly_model.predict(
    all_years_poly
)

plt.figure(figsize=(9,5))

plt.scatter(
    df["year_decimal"],
    df["lake_area_sqkm"],
    label="Pseudo-data"
)

plt.plot(
    all_years["year_decimal"],
    all_poly_predictions,
    linewidth=2,
    label="Polynomial Forecast"
)

plt.xlabel("Year")

plt.ylabel("Lake Area (sq. km)")

plt.title(
    "Future Lake Area Prediction till 2050 (Polynomial Regression)"
)

plt.legend()

plt.grid(True)

plt.savefig(
    "future_lake_area_polynomial.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ==========================================
# RANDOM FOREST FORECAST
# FUTURE LAKE AREA
# ==========================================

rf_model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

rf_model.fit(X, y)

rf_pred = rf_model.predict(X)

rf_r2 = r2_score(y, rf_pred)

rf_rmse = np.sqrt(
    mean_squared_error(y, rf_pred)
)

rf_mae = mean_absolute_error(
    y,
    rf_pred
)

print("\nRANDOM FOREST REGRESSION")

print(f"R² = {rf_r2:.4f}")

print(f"RMSE = {rf_rmse:.6f}")

print(f"MAE = {rf_mae:.6f}")

rf_future_area = rf_model.predict(
    future_years
)

print("\nRandom Forest Future Lake Area Prediction till 2050")

for year, area in zip(
    future_years["year_decimal"],
    rf_future_area
):
    print(f"{year}: {area:.6f} sq. km")
    
    # ==========================================
# RANDOM FOREST FORECAST GRAPH
# ==========================================

all_rf_predictions = rf_model.predict(
    all_years
)

plt.figure(figsize=(9,5))

plt.scatter(
    df["year_decimal"],
    df["lake_area_sqkm"],
    label="Pseudo-data"
)

plt.plot(
    all_years["year_decimal"],
    all_rf_predictions,
    linewidth=2,
    label="Random Forest Forecast"
)

plt.xlabel("Year")

plt.ylabel("Lake Area (sq. km)")

plt.title(
    "Future Lake Area Prediction till 2050 (Random Forest)"
)

plt.legend()

plt.grid(True)

plt.savefig(
    "future_lake_area_random_forest.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ==========================================
# SAVE CHART DATA FOR DSS
# ==========================================

chart_years = pd.DataFrame({
    "year_decimal": list(np.arange(2017, 2050 + 1, 1/12))
})

chart_linear = linear_model.predict(chart_years)

chart_poly = poly_model.predict(
    poly.transform(chart_years)
)

chart_rf = rf_model.predict(chart_years)

# observed/pseudo values only exist till 2025
pseudo_lookup = dict(
    zip(
        df["year_decimal"].round(6),
        df["lake_area_sqkm"]
    )
)

pseudo_area = []

for yr in chart_years["year_decimal"]:
    pseudo_area.append(
        pseudo_lookup.get(round(yr, 6), None)
    )

lake_area_chart_data = pd.DataFrame({
    "year_decimal": chart_years["year_decimal"],
    "pseudo_area": pseudo_area,
    "linear_area": chart_linear,
    "polynomial_area": chart_poly,
    "random_forest_area": chart_rf
})

lake_area_chart_data.to_csv(
    "lake_area_prediction_models_chart.csv",
    index=False
)

print("\nLake area prediction chart data saved as lake_area_prediction_models_chart.csv")