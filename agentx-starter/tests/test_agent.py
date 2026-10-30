"""
AgentX Starter - Offline Unit Tests
Verifies tools, safety guards, and ReAct agent loop without external API keys.
"""
import os
import sys
import unittest

# Add project root to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.calculator import calculate
from tools.data_query import list_files, read_file, sql_query
from agent.core import ReActAgent
from tools import registry

class TestAgentXStarter(unittest.TestCase):
    
    def test_calculator_arithmetic(self):
        """Verify safe calculator execution."""
        res1 = calculate("120 * 0.4046 / 0.46")
        self.assertNotIn("Error", res1)
        val = float(res1)
        self.assertAlmostEqual(val, 105.5478, places=2)

        res2 = calculate("sqrt(144) + 10")
        self.assertEqual(float(res2), 22.0)

    def test_calculator_safety(self):
        """Ensure dangerous calls are blocked by AST evaluator."""
        res = calculate("__import__('os').system('dir')")
        self.assertIn("Calculation Error", res)

    def test_list_files(self):
        """Verify data folder scanning."""
        files_str = list_files()
        self.assertIn("crop_recommendation.csv", files_str)

    def test_sql_query_crop_dataset(self):
        """Verify SQL query execution over crop recommendation CSV."""
        query = "SELECT label, N, P, K FROM crop_recommendation WHERE label='rice' LIMIT 2"
        res = sql_query(query)
        self.assertNotIn("SQL Execution Error", res)
        self.assertIn("rice", res)

    def test_agent_offline_run(self):
        """Verify ReAct agent runs and succeeds offline."""
        agent = ReActAgent()
        result = agent.run("What are the nutrient benchmarks for Rice?")
        self.assertTrue(result["success"])
        self.assertIn("final_answer", result)
        self.assertTrue(len(result["final_answer"]) > 0)
        self.assertTrue(len(result["trajectory"]) >= 1)


if __name__ == "__main__":
    unittest.main()
