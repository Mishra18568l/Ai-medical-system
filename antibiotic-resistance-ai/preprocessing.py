import pandas as pd # type: ignore

# Load dataset
df = pd.read_excel("data.xlsx")

# Convert wide format to long format
df_long = df.melt(
    id_vars=["Location"],
    var_name="Antibiotic",
    value_name="Zone"
)

# Convert zone values into resistance label
df_long["Result"] = df_long["Zone"].apply(
    lambda x: "Susceptible" if x >= 20 else "Resistant"
)

# Save processed dataset
df_long.to_csv("processed_data.csv", index=False)

print(df_long.head())
print("\nShape:", df_long.shape)
print("\nProcessed dataset saved as processed_data.csv")