"""
AgentX Starter - Safe Calculator Tool
Evaluates mathematical expressions safely using Python's ast parser.
"""
import ast
import operator
import math
from tools import registry

# Allowed safe operators
SAFE_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos
}

SAFE_FUNCTIONS = {
    "sqrt": math.sqrt,
    "round": round,
    "abs": abs,
    "ceil": math.ceil,
    "floor": math.floor,
    "log": math.log,
    "exp": math.exp
}

def _eval_node(node):
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant type: {type(node.value)}")
    elif isinstance(node, ast.BinOp):
        left = _eval_node(node.left)
        right = _eval_node(node.right)
        op_type = type(node.op)
        if op_type in SAFE_OPERATORS:
            return SAFE_OPERATORS[op_type](left, right)
        raise ValueError(f"Unsupported binary operator: {op_type}")
    elif isinstance(node, ast.UnaryOp):
        operand = _eval_node(node.operand)
        op_type = type(node.op)
        if op_type in SAFE_OPERATORS:
            return SAFE_OPERATORS[op_type](operand)
        raise ValueError(f"Unsupported unary operator: {op_type}")
    elif isinstance(node, ast.Call):
        func_name = node.func.id if isinstance(node.func, ast.Name) else None
        if func_name in SAFE_FUNCTIONS:
            args = [_eval_node(arg) for arg in node.args]
            return SAFE_FUNCTIONS[func_name](*args)
        raise ValueError(f"Unsupported function call: {func_name}")
    else:
        raise ValueError(f"Unsupported AST node expression: {type(node)}")

@registry.register("calculate", "Perform safe arithmetic calculations. Argument: 'expression' (e.g. '120 * 0.4046 / 0.46').")
def calculate(expression: str) -> str:
    """Safely calculates the result of a math expression."""
    try:
        clean_expr = expression.strip().replace("^", "**")
        parsed = ast.parse(clean_expr, mode='eval')
        result = _eval_node(parsed.body)
        return str(round(result, 4) if isinstance(result, float) else result)
    except Exception as e:
        return f"Calculation Error: {str(e)}"
