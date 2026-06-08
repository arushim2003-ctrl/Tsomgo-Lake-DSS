import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.preprocessing import PolynomialFeatures

# Load data
df = pd.read_csv("tsomgo_analysis.csv")

# 1. Lake Area vs LST Regression
X = df[["lst_celsius"]]
y = df["lake_area_sqkm"]

model = LinearRegression()
model.fit(X, y)

predicted_area = model.predict(X)

r2 = r2_score(y, predicted_area)
correlation = df["lst_celsius"].corr(df["lake_area_sqkm"])

print("Lake Area vs LST Regression")
print("Regression Equation:")
print(f"Lake Area = {model.intercept_:.6f} + ({model.coef_[0]:.6f} × LST)")
print(f"R² Value: {r2:.4f}")
print(f"Correlation Coefficient: {correlation:.4f}")

plt.figure(figsize=(7, 5))
plt.scatter(df["lst_celsius"], df["lake_area_sqkm"], label="Observed Data")
plt.plot(df["lst_celsius"], predicted_area, label="Regression Line")
plt.xlabel("Mean Lake LST (°C)")
plt.ylabel("Lake Area (sq. km)")
plt.title("Lake Area vs Mean Lake LST Regression")
plt.legend()
plt.grid(True)
plt.savefig("lake_area_vs_lst_regression.png", dpi=300, bbox_inches="tight")
plt.show()

# 2. Future Lake Area Prediction till 2050
X_year = df[["year"]]
y_area = df["lake_area_sqkm"]

area_model = LinearRegression()
area_model.fit(X_year, y_area)

future_years = pd.DataFrame({
    "year": list(range(2026, 2051))
})

future_area = area_model.predict(future_years)

print("\nFuture Lake Area Prediction till 2050")
for year, area in zip(future_years["year"], future_area):
    print(f"{year}: {area:.6f} sq. km")

all_years = pd.DataFrame({
    "year": list(range(2017, 2051))
})

all_area_prediction = area_model.predict(all_years)

plt.figure(figsize=(9, 5))
plt.scatter(df["year"], df["lake_area_sqkm"], label="Observed Lake Area")
plt.plot(all_years["year"], all_area_prediction, label="Projected Lake Area Trend")
plt.xlabel("Year")
plt.ylabel("Lake Area (sq. km)")
plt.title("Observed and Projected Lake Area Trend till 2050")
plt.legend()
plt.grid(True)
plt.savefig("future_lake_area_prediction_2050.png", dpi=300, bbox_inches="tight")
plt.show()

# POLYNOMIAL REGRESSION (DEGREE 2, LAKE AREA)

poly = PolynomialFeatures(degree=2)

years_poly = poly.fit_transform(X_year)

future_years_poly = poly.transform(future_years)

poly_model = LinearRegression()

poly_model.fit(years_poly, y_area)

poly_pred_observed = poly_model.predict(years_poly)

poly_pred_future = poly_model.predict(future_years_poly)

poly_r2 = poly_model.score(years_poly, y_area)

print("\nLake Area Polynomial Regression")
print(f"Polynomial R² = {poly_r2:.4f}")

print("\nFuture Lake Area Polynomial Prediction till 2050")
for year, area in zip(future_years["year"], poly_pred_future):
    print(f"{year}: {area:.6f} sq. km")
    
    plt.figure(figsize=(9,5))

# Observed data
plt.scatter(
    df["year"],
    df["lake_area_sqkm"],
    label="Observed Lake Area"
)

# Linear prediction
plt.plot(
    all_years["year"],
    all_area_prediction,
    label="Linear Prediction",
    linewidth=2
)

# Polynomial prediction
all_years_poly = poly.transform(all_years)

poly_all_prediction = poly_model.predict(
    all_years_poly
)

plt.plot(
    all_years["year"],
    poly_all_prediction,
    label="Polynomial Prediction",
    linewidth=2
)

plt.xlabel("Year")
plt.ylabel("Lake Area (sq. km)")

plt.title(
    "Lake Area Prediction: Linear vs Polynomial"
)

plt.legend()
plt.grid(True)

plt.savefig(
    "lake_area_linear_vs_polynomial.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# 3. Future LST Prediction till 2050
y_lst = df["lst_celsius"]

lst_model = LinearRegression()
lst_model.fit(X_year, y_lst)

future_lst = lst_model.predict(future_years)

print("\nFuture LST Prediction till 2050")
for year, temp in zip(future_years["year"], future_lst):
    print(f"{year}: {temp:.3f} °C")

all_lst_prediction = lst_model.predict(all_years)

plt.figure(figsize=(9, 5))
plt.scatter(df["year"], df["lst_celsius"], label="Observed LST")
plt.plot(all_years["year"], all_lst_prediction, label="Projected LST Trend")
plt.xlabel("Year")
plt.ylabel("Mean Lake LST (°C)")
plt.title("Observed and Projected Mean Lake LST Trend till 2050")
plt.legend()
plt.grid(True)
plt.savefig("future_lst_prediction_2050.png", dpi=300, bbox_inches="tight")
plt.show()

# POLYNOMIAL REGRESSION (DEGREE 2, LST)

lst_poly = PolynomialFeatures(degree=2)

years_poly_lst = lst_poly.fit_transform(X_year)

future_years_poly_lst = lst_poly.transform(future_years)

lst_poly_model = LinearRegression()

lst_poly_model.fit(years_poly_lst, y_lst)

lst_poly_pred_observed = lst_poly_model.predict(years_poly_lst)

lst_poly_pred_future = lst_poly_model.predict(future_years_poly_lst)

lst_poly_r2 = lst_poly_model.score(years_poly_lst, y_lst)

print("\nLST Polynomial Regression")
print(f"Polynomial R² = {lst_poly_r2:.4f}")

print("\nFuture LST Polynomial Prediction till 2050")
for year, temp in zip(future_years["year"], lst_poly_pred_future):
    print(f"{year}: {temp:.3f} °C")

# 4. Save prediction table
prediction_table = pd.DataFrame({
    "year": future_years["year"],
    "predicted_lake_area_sqkm": future_area,
    "predicted_lst_celsius": future_lst
})

prediction_table.to_csv("tsomgo_predictions_2026_2050.csv", index=False)

print("\nPrediction table saved as tsomgo_predictions_2026_2050.csv")

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# YEARS
years = np.array([
    2017, 2018, 2019, 2020, 2021,
    2022, 2023, 2024, 2025
]).reshape(-1, 1)

# MEAN NDTI VALUES
ndti = np.array([
    -0.451,
    -0.368,
    -0.515,
    -0.529,
    -0.399,
    -0.415,
    -0.511,
    -0.461,
    -0.461
])

# LINEAR REGRESSION MODEL
model = LinearRegression()

model.fit(years, ndti)

# FUTURE YEARS
future_years = np.array([
    2026, 2027, 2028, 2029, 2030,
    2031, 2032, 2033, 2034, 2035,
    2036, 2037, 2038, 2039, 2040,
    2041, 2042, 2043, 2044, 2045,
    2046, 2047, 2048, 2049, 2050
]).reshape(-1, 1)

# PREDICTED VALUES
predicted_ndti = model.predict(future_years)

# REGRESSION STATISTICS
predicted_observed = model.predict(years)

ndti_r2 = r2_score(ndti, predicted_observed)

ndti_corr = np.corrcoef(
    years.flatten(),
    ndti
)[0, 1]

print("\nNDTI Trend Regression")
print("Regression Equation:")

print(
    f"NDTI = {model.intercept_:.6f} + "
    f"({model.coef_[0]:.6f} × Year)"
)

print(f"R² Value: {ndti_r2:.4f}")

print(
    f"Correlation Coefficient: "
    f"{ndti_corr:.4f}"
)

# PRINT RESULTS
print("Future NDTI Prediction till 2050\n")

for year, value in zip(future_years.flatten(), predicted_ndti):

    print(f"{year}: {value:.3f}")

# PLOT
plt.figure(figsize=(10,6))

# OBSERVED DATA
plt.plot(
    years.flatten(),
    ndti,
    marker='o',
    linewidth=2,
    label='Observed NDTI'
)

# PREDICTED DATA
plt.plot(
    future_years.flatten(),
    predicted_ndti,
    linestyle='--',
    marker='o',
    linewidth=2,
    label='Predicted NDTI'
)

plt.xlabel("Year")
plt.ylabel("Mean NDTI")
plt.title("NDTI Prediction till 2050")

plt.legend()

plt.grid(True)

plt.show()
