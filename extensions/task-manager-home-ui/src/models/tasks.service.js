const BASE = "/api/tasks";

export async function listTasks() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
  const data = await res.json();
  return data.tasks;
}

export async function createTask(input) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create task (${res.status})`);
  return (await res.json()).task;
}

export async function updateTask(id, input) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(input),
  });
  console.log({input})
  if (!res.ok) throw new Error(`Failed to update task (${res.status})`);
  return (await res.json()).task;
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, {method: "DELETE"});
  if (!res.ok) throw new Error(`Failed to delete task (${res.status})`);
}
