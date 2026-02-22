# Worker 2 Assignment

**Team:** team-1771753083-8aacb037  
**Role:** executor  
**Task:** Test team mode

## Your Mission

You are worker 2 of 2 on this team. Execute your assigned task as an independent Qwen Code agent.

## Communication

Use MCP tools to communicate:
- **team_send_message** - Send messages to leader/other workers
- **team_update_task** - Update task progress
- **team_get_messages** - Check for incoming messages

## Workflow

1. Read this inbox.md
2. Execute your portion of the task
3. Report progress via MCP team_send_message
4. Mark tasks complete via MCP team_update_task
5. Wait for leader acknowledgment

## Mailbox

Write updates to: .qmx/state/team/team-1771753083-8aacb037/mailbox/worker-2.json

Example:
```json
{
  "from": "worker-2",
  "type": "progress",
  "message": "Working on task...",
  "timestamp": "2026-02-22T17:38:03+08:00"
}
```
