import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# Load pseudo-data
df = pd.read_csv("tsomgo_pseudo_data.csv")

print(df.head())
print("\nTotal rows:", len(df))
print("\nColumns:", df.columns)

# Input and output
X = df[["lst_celsius"]]
y = df["lake_area_sqkm"]

# ===============================
# 1. LINEAR REGRESSION
# ===============================

linear_model = LinearRegression()
linear_model.fit(X, y)
linear_pred = linear_model.predict(X)

linear_r2 = r2_score(y, linear_pred)
linear_rmse = np.sqrt(mean_squared_error(y, linear_pred))
linear_mae = mean_absolute_error(y, linear_pred)

# ===============================
# 2. POLYNOMIAL REGRESSION
# ===============================

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

poly_model = LinearRegression()
poly_model.fit(X_poly, y)
poly_pred = poly_model.predict(X_poly)

poly_r2 = r2_score(y, poly_pred)
poly_rmse = np.sqrt(mean_squared_error(y, poly_pred))
poly_mae = mean_absolute_error(y, poly_pred)

# ===============================
# 3. RANDOM FOREST REGRESSION
# ===============================

rf_model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

rf_model.fit(X, y)
rf_pred = rf_model.predict(X)

rf_r2 = r2_score(y, rf_pred)
rf_rmse = np.sqrt(mean_squared_error(y, rf_pred))
rf_mae = mean_absolute_error(y, rf_pred)

# ===============================
# 4. MODEL COMPARISON TABLE
# ===============================

comparison_table = pd.DataFrame({
    "Model": [
        "Linear Regression",
        "Polynomial Regression",
        "Random Forest Regression"
    ],
    "R2": [
        linear_r2,
        poly_r2,
        rf_r2
    ],
    "RMSE": [
        linear_rmse,
        poly_rmse,
        rf_rmse
    ],
    "MAE": [
        linear_mae,
        poly_mae,
        rf_mae
    ]
})

print("\nMODEL COMPARISON TABLE")
print(comparison_table)

comparison_table.to_csv(
    "lake_area_lst_model_comparison.csv",
    index=False
)

print("\nModel comparison table saved as lake_area_lst_model_comparison.csv")

# ===============================
# 5. MODEL COMPARISON GRAPH
# ===============================

# Sort values by LST for smooth plotting
sorted_df = df.sort_values("lst_celsius")
X_sorted = sorted_df[["lst_celsius"]]
y_sorted = sorted_df["lake_area_sqkm"]

linear_sorted_pred = linear_model.predict(X_sorted)
poly_sorted_pred = poly_model.predict(poly.transform(X_sorted))
rf_sorted_pred = rf_model.predict(X_sorted)

chart_data = pd.DataFrame({
    "lst_celsius": X_sorted["lst_celsius"],
    "observed_area": y_sorted,
    "linear_pred": linear_sorted_pred,
    "polynomial_pred": poly_sorted_pred,
    "random_forest_pred": rf_sorted_pred
})

chart_data.to_csv(
    "lake_area_lst_model_comparison_chart.csv",
    index=False
)

print("\nInteractive chart data saved as lake_area_lst_model_comparison_chart.csv")

plt.figure(figsize=(9, 5))

plt.scatter(
    X_sorted["lst_celsius"],
    y_sorted,
    label="Observed Data",
    s=25
)

plt.plot(
    X_sorted["lst_celsius"],
    linear_sorted_pred,
    label="Linear Regression",
    linewidth=2
)

plt.plot(
    X_sorted["lst_celsius"],
    poly_sorted_pred,
    label="Polynomial Regression",
    linewidth=2
)

plt.plot(
    X_sorted["lst_celsius"],
    rf_sorted_pred,
    label="Random Forest Regression",
    linewidth=2
)

plt.xlabel("Mean Lake LST (°C)")
plt.ylabel("Lake Area (sq. km)")
plt.title("Lake Area vs LST: Model Comparison")

plt.legend()
plt.grid(True)

plt.savefig(
    "lake_area_lst_model_comparison.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()