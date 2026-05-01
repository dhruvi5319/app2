# Tool Schema Requirements

## Bash Tool
Every Bash tool call MUST include both required fields:
- `command` (string): The shell command to execute
- `description` (string): A short description of what the command does

Example: `{"command": "ls -la", "description": "List files in current directory"}`

Omitting `description` will cause a schema validation error. This applies to ALL sessions including subagent tasks.

## Task Tool
When spawning subagent tasks, use the `agent` field (not `subagent_type`):
- `agent` (string): The agent name (e.g. "pivota_spec-planner", "pivota_spec-phase-researcher")
- `prompt` (string): The task prompt
- `description` (string): Short task description
