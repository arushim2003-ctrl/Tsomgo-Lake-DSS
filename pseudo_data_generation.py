import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import CubicSpline

# Load original yearly data
df = pd.read_csv("tsomgo_analysis.csv")

print(df)

# Add mean NDTI values
df["ndti"] = [
    -0.451,
    -0.368,
    -0.515,
    -0.529,
    -0.399,
    -0.415,
    -0.511,
    -0.461,
    -0.461
]

print("\nData with NDTI:")
print(df)

# Create monthly pseudo time points
monthly_years = np.arange(
    2017,
    2025 + 1/12,
    1/12
)

# Cubic spline interpolation
lake_area_spline = CubicSpline(
    df["year"],
    df["lake_area_sqkm"]
)

lst_spline = CubicSpline(
    df["year"],
    df["lst_celsius"]
)

ndti_spline = CubicSpline(
    df["year"],
    df["ndti"]
)

# Generate pseudo-data
pseudo_data = pd.DataFrame({

    "year_decimal": monthly_years,

    "lake_area_sqkm":
    lake_area_spline(monthly_years),

    "lst_celsius":
    lst_spline(monthly_years),

    "ndti":
    ndti_spline(monthly_years)

})

print("\nPseudo-data Preview:")
print(pseudo_data.head(15))

print("\nTotal pseudo-data points:")
print(len(pseudo_data))

# Save CSV
#pseudo_data.to_csv(
    #"tsomgo_pseudo_data.csv",
    #index=False
#)

print(
    "\nPseudo-data saved as tsomgo_pseudo_data.csv"
)

plt.figure(figsize=(10,5))

plt.scatter(
    df["year"],
    df["lake_area_sqkm"],
    color="red",
    label="Observed Data"
)

plt.plot(
    pseudo_data["year_decimal"],
    pseudo_data["lake_area_sqkm"],
    label="Cubic Spline Interpolation"
)

plt.xlabel("Year")
plt.ylabel("Lake Area (sq. km)")
plt.title("Lake Area Cubic Spline Interpolation")

plt.legend()
plt.grid(True)

plt.show()