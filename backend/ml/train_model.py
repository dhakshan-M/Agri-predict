import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_crop_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "..", "data", "crop_recommendation.csv")
    
    df = pd.read_csv(data_path)
    print(f"Loaded dataset with {len(df)} rows and columns: {list(df.columns)}")
    print(f"Unique crops ({len(df['label'].unique())}): {sorted(df['label'].unique())}")
    
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    y_pred = rf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy on Test Set: {acc * 100:.2f}%")
    
    model_output_path = os.path.join(current_dir, "crop_model.pkl")
    with open(model_output_path, "wb") as f:
        pickle.dump(rf, f)
    print(f"Model saved to {model_output_path}")

    # Generate reference agronomic requirements per crop for calculator & advice
    summary = df.groupby('label').agg({
        'N': ['mean', 'min', 'max'],
        'P': ['mean', 'min', 'max'],
        'K': ['mean', 'min', 'max'],
        'temperature': ['mean', 'min', 'max'],
        'humidity': ['mean', 'min', 'max'],
        'ph': ['mean', 'min', 'max'],
        'rainfall': ['mean', 'min', 'max']
    }).round(2)
    
    ref_dict = {}
    for crop in df['label'].unique():
        sub = df[df['label'] == crop]
        ref_dict[crop] = {
            'target_N': round(float(sub['N'].mean()), 1),
            'target_P': round(float(sub['P'].mean()), 1),
            'target_K': round(float(sub['K'].mean()), 1),
            'optimal_temp': round(float(sub['temperature'].mean()), 1),
            'optimal_humidity': round(float(sub['humidity'].mean()), 1),
            'optimal_ph': round(float(sub['ph'].mean()), 2),
            'optimal_rainfall': round(float(sub['rainfall'].mean()), 1),
            'moisture_range': [50.0, 75.0]  # default agronomic moisture % range
        }
    
    ref_output_path = os.path.join(current_dir, "crop_reference_data.pkl")
    with open(ref_output_path, "wb") as f:
        pickle.dump(ref_dict, f)
    print(f"Crop reference benchmarks saved to {ref_output_path}")

if __name__ == "__main__":
    train_crop_model()
