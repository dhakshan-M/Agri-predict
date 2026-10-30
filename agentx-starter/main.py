"""
AgentX Starter - Main CLI Entry Point & Judging Contract
Compliant with Hackathon Automated Evaluation (--json flag).
"""
import sys
import json
import argparse
from agent.core import ReActAgent

def main():
    parser = argparse.ArgumentParser(description="AgentX Starter - Crop Stress Telemetry & Advisory Agent")
    parser.add_argument("query", nargs="?", default="What are the optimal soil and rainfall conditions for Rice?", help="Task query for the agricultural agent")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format for judging contract evaluation")
    parser.add_argument("--iterations", type=int, default=None, help="Override MAX_ITERATIONS")
    
    args = parser.parse_args()

    agent = ReActAgent()
    result = agent.run(args.query)

    if args.json:
        output_payload = {
            "query": args.query,
            "success": result["success"],
            "steps_taken": result["steps_taken"],
            "final_answer": result["final_answer"],
            "trajectory": result["trajectory"]
        }
        print(json.dumps(output_payload, indent=2))
    else:
        print("\n" + "=" * 60)
        print(" AGRI-INTELLIGENCE: Crop Stress Telemetry & Advisory Agent")
        print("=" * 60)
        print(f"Query: {args.query}\n")
        for step in result["trajectory"]:
            if step.get("type") == "final_answer":
                print(f"[Step {step['step']}] Final Answer:")
                print(f"  {step['content']}\n")
            elif "action" in step:
                print(f"[Step {step['step']}] Thought: {step.get('thought', '')}")
                print(f"  Action: {step['action']}({step.get('action_input', '')})")
                print(f"  Observation: {step.get('observation', '')[:200]}...\n")
        print("-" * 60)
        print("Final Answer:")
        print(result["final_answer"])
        print("=" * 60)

if __name__ == "__main__":
    main()
