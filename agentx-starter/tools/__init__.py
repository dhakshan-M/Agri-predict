"""
AgentX Starter - Tools Registry and Base Class
"""
from typing import Dict, Any, Callable, List

class Tool:
    def __init__(self, name: str, description: str, func: Callable):
        self.name = name
        self.description = description
        self.func = func

    def execute(self, **kwargs) -> Any:
        try:
            return self.func(**kwargs)
        except Exception as e:
            return f"Error executing tool '{self.name}': {str(e)}"

class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Tool] = {}

    def register(self, name: str, description: str):
        def decorator(func: Callable):
            self.tools[name] = Tool(name=name, description=description, func=func)
            return func
        return decorator

    def get_tool(self, name: str) -> Tool:
        return self.tools.get(name)

    def list_tools(self) -> List[Dict[str, str]]:
        return [{"name": t.name, "description": t.description} for t in self.tools.values()]

    def execute(self, name: str, **kwargs) -> Any:
        tool = self.get_tool(name)
        if not tool:
            return f"Error: Tool '{name}' not found."
        return tool.execute(**kwargs)

registry = ToolRegistry()
