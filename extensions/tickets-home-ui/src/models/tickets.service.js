const BASE = "/api/tickets";

export async function getTicket(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`Failed to load ticket (${res.status})`);
  return (await res.json()).ticket;
}

export async function listTickets() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to load tickets (${res.status})`);
  const data = await res.json();
  return data.tickets;
}

export async function createTicket(input) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create ticket (${res.status})`);
  return (await res.json()).ticket;
}

export async function updateTicket(id, input) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(input),
  });
  console.log({input})
  if (!res.ok) throw new Error(`Failed to update ticket (${res.status})`);
  return (await res.json()).ticket;
}

export async function deleteTicket(id) {
  const res = await fetch(`${BASE}/${id}`, {method: "DELETE"});
  if (!res.ok) throw new Error(`Failed to delete ticket (${res.status})`);
}
