"""
AgentX Starter - Data Query Tool
Supports listing files, inspecting schemas/rows, and running SQL queries over CSVs via SQLite in-memory.
"""
import os
import sqlite3
import pandas as pd
from tools import registry
from config import DATA_DIR

@registry.register("list_files", "List all data files available in the data directory. No arguments required.")
def list_files() -> str:
    """Lists files in the data directory."""
    try:
        if not os.path.exists(DATA_DIR):
            return "No data directory found."
        files = os.listdir(DATA_DIR)
        return f"Files in data folder: {', '.join(files)}"
    except Exception as e:
        return f"Error listing files: {str(e)}"

@registry.register("read_file", "Read the first N rows or schema of a CSV or JSON file in data folder. Arguments: 'filename', optional 'n_rows' (default 5).")
def read_file(filename: str, n_rows: int = 5) -> str:
    """Reads head of a data file."""
    try:
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            return f"Error: File '{filename}' not found in data folder."
        
        if filename.endswith(".csv"):
            df = pd.read_csv(filepath)
            return f"Columns: {list(df.columns)}\nTotal Rows: {len(df)}\nSample Rows:\n{df.head(n_rows).to_string()}"
        elif filename.endswith(".json"):
            import json
            with open(filepath, "r") as f:
                data = json.load(f)
            count = len(data) if isinstance(data, list) else 1
            sample = data[:n_rows] if isinstance(data, list) else data
            return f"Total Records: {count}\nSample:\n{json.dumps(sample, indent=2)}"
        else:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                lines = [f.readline() for _ in range(n_rows)]
            return "".join(lines)
    except Exception as e:
        return f"Error reading file '{filename}': {str(e)}"

@registry.register("sql_query", "Run an ANSI SQL SELECT query across CSV files in the data directory. CSV files are loaded as tables named without extension (e.g. SELECT * FROM crop_recommendation WHERE label='rice' LIMIT 5). Argument: 'query'.")
def sql_query(query: str) -> str:
    """Executes a SQL query over CSV datasets using an in-memory SQLite database."""
    try:
        conn = sqlite3.connect(":memory:")
        # Load all CSVs into SQLite
        if os.path.exists(DATA_DIR):
            for fname in os.listdir(DATA_DIR):
                if fname.endswith(".csv"):
                    table_name = os.path.splitext(fname)[0]
                    # Sanitize table name for SQL
                    clean_table = table_name.replace("-", "_").replace(" ", "_")
                    df = pd.read_csv(os.path.join(DATA_DIR, fname))
                    # Clean column names
                    df.columns = [c.strip().replace(" ", "_").replace("[", "").replace("]", "").replace("/", "_") for c in df.columns]
                    df.to_sql(clean_table, conn, if_exists="replace", index=False)
        
        result_df = pd.read_sql_query(query, conn)
        conn.close()
        if len(result_df) == 0:
            return "Query executed successfully: 0 rows returned."
        return result_df.head(20).to_string(index=False)
    except Exception as e:
        return f"SQL Execution Error: {str(e)}"
