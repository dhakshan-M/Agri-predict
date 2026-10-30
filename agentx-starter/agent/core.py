"""
AgentX Starter - ReAct Agent Core Engine
Implements ReAct loop, step caps, repeat guards, and error recovery.
"""
import json
import re
from typing import Dict, Any, List
from config import MAX_ITERATIONS, MAX_REPEATS
from agent.prompt_builder import build_system_prompt
from agent.llm import LLMClient
from tools import registry
# Import tools to ensure registration
import tools.calculator
import tools.data_query
import tools.web_search

class ReActAgent:
    def __init__(self):
        self.llm = LLMClient()
        self.system_prompt = build_system_prompt()

    def run(self, query: str) -> Dict[str, Any]:
        """Runs the ReAct loop until 'Final Answer' is reached or step cap hit."""
        trajectory: List[Dict[str, Any]] = []
        conversation_history = f"User Request: {query}\n"
        
        recent_actions: List[str] = []
        step = 0

        while step < MAX_ITERATIONS:
            step += 1

            # 1. Generate next step from LLM
            response = self.llm.generate(self.system_prompt, conversation_history)
            
            # Check for Final Answer
            if "Final Answer:" in response:
                final_text = response.split("Final Answer:", 1)[1].strip()
                trajectory.append({
                    "step": step,
                    "type": "final_answer",
                    "content": final_text
                })
                return {
                    "success": True,
                    "final_answer": final_text,
                    "steps_taken": step,
                    "trajectory": trajectory
                }

            # Parse Thought and Action
            thought_match = re.search(r"Thought:\s*(.*?)(?=\nAction:|$)", response, re.DOTALL)
            action_match = re.search(r"Action:\s*(\w+)", response)
            input_match = re.search(r"Action Input:\s*(\{.*?\}|\[.*?\]|\".*?\"|.*)", response, re.DOTALL)

            thought = thought_match.group(1).strip() if thought_match else ""
            action = action_match.group(1).strip() if action_match else None
            action_input_raw = input_match.group(1).strip() if input_match else "{}"

            if not action:
                # If no formal action detected, treat as direct answer
                trajectory.append({"step": step, "type": "direct_answer", "content": response})
                return {
                    "success": True,
                    "final_answer": response.strip(),
                    "steps_taken": step,
                    "trajectory": trajectory
                }

            # Repeat Guard: prevent calling the same action repeatedly
            action_sig = f"{action}:{action_input_raw}"
            if recent_actions.count(action_sig) >= MAX_REPEATS:
                observation = f"Error: Repeat guard triggered. You have already executed '{action}' with this input {MAX_REPEATS} times. Change your strategy or output Final Answer."
            else:
                recent_actions.append(action_sig)

                # Parse JSON arguments safely
                try:
                    kwargs = json.loads(action_input_raw)
                    if not isinstance(kwargs, dict):
                        kwargs = {"arg": kwargs}
                except Exception:
                    kwargs = {"expression": action_input_raw.strip('"\''), "query": action_input_raw.strip('"\'')}

                # Error Recovery: Safe tool execution
                try:
                    observation = str(registry.execute(action, **kwargs))
                except Exception as e:
                    observation = f"Tool execution failed: {str(e)}. Please correct your parameters."

            # Record step in trajectory
            trajectory.append({
                "step": step,
                "thought": thought,
                "action": action,
                "action_input": action_input_raw,
                "observation": observation
            })

            # Append to ongoing prompt history
            conversation_history += f"\nThought: {thought}\nAction: {action}\nAction Input: {action_input_raw}\nObservation: {observation}\n"

        return {
            "success": False,
            "final_answer": "Max iterations reached without achieving final answer. Please refine the query.",
            "steps_taken": step,
            "trajectory": trajectory
        }
