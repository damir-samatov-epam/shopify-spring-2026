import "@shopify/ui-extensions/preact";
import {render} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

const BASE = "/api/tickets";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const {intents} = shopify;
  const request = intents.request.value || {};
  const action = request.action; // 'create' | 'edit'
  const ticketId = request.value; // present for edit
  const data = request.data || {};
  const isEdit = action === 'edit';

  const [title, setTitle] = useState(typeof data.title === 'string' ? data.title : '');
  const [description, setDescription] = useState(
    typeof data.description === 'string' ? data.description : '',
  );
  const [status, setStatus] = useState(
    typeof data.status === 'string' ? data.status : 'open',
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Keep the latest field values available to tool handlers without
  // re-registering the tools on every keystroke.
  const latest = useRef({title, description, status});
  latest.current = {title, description, status};

  async function persistTicket({title, description, status}) {
    if (isEdit) {
      const res = await fetch(`${BASE}/${ticketId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description, status}),
      });
      if (!res.ok) throw new Error(`Failed to update ticket (${res.status})`);
      return (await res.json()).ticket;
    }
    const res = await fetch(BASE, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title, description}),
    });
    if (!res.ok) throw new Error(`Failed to create ticket (${res.status})`);
    return (await res.json()).ticket;
  }

  async function deleteTicket() {
    const res = await fetch(`${BASE}/${ticketId}`, {method: 'DELETE'});
    if (!res.ok) throw new Error(`Failed to delete ticket (${res.status})`);
  }

  // Register tools Sidekick can invoke while this UI is open.
  useEffect(() => {
    const unregisterSave = shopify.tools.register('save_ticket', async (input) => {
      const next = {
        title: typeof input?.title === 'string' ? input.title : latest.current.title,
        description:
          typeof input?.description === 'string'
            ? input.description
            : latest.current.description,
        status:
          typeof input?.status === 'string' ? input.status : latest.current.status,
      };
      setTitle(next.title);
      setDescription(next.description);
      setStatus(next.status);
      const ticket = await persistTicket(next);
      return {success: true, ticket};
    });

    // delete_ticket only makes sense when a ticket is already loaded (edit).
    const unregisterDelete = isEdit
      ? shopify.tools.register('delete_ticket', async () => {
          await deleteTicket();
          return {success: true, id: ticketId};
        })
      : () => {};

    return () => {
      unregisterSave();
      unregisterDelete();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSave = async () => {
    setBusy(true);
    setError('');
    try {
      const ticket = await persistTicket(latest.current);
      await intents.response?.ok({
        id: ticket?.id ?? ticketId,
        action,
      });
    } catch (err) {
      console.error(err);
      setBusy(false);
      setError(err?.message || 'Could not save the ticket.');
    }
  };

  const runDelete = async () => {
    setBusy(true);
    setError('');
    try {
      await deleteTicket();
      await intents.response?.ok({id: ticketId, action: 'delete'});
    } catch (err) {
      console.error(err);
      setBusy(false);
      setError(err?.message || 'Could not delete the ticket.');
    }
  };

  // Host callbacks don't await returned promises — hand the async work to
  // event.waitUntil so Sidekick keeps the extension alive until it resolves.
  const onSubmit = (event) => {
    const work = runSave();
    if (event && typeof event.waitUntil === 'function') event.waitUntil(work);
  };

  const onDelete = (event) => {
    const work = runDelete();
    if (event && typeof event.waitUntil === 'function') event.waitUntil(work);
  };

  const cancel = async () => {
    await intents.response?.closed();
  };

  const heading = isEdit ? 'Edit ticket' : 'Create ticket';
  const submitLabel = isEdit ? 'Save changes' : 'Create ticket';

  return (
    <s-form onSubmit={onSubmit}>
      <s-stack direction="block" gap="base">
        <s-heading>{heading}</s-heading>

        <s-text-field
          label="Title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />

        <s-text-area
          label="Description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />

        {isEdit ? (
          <s-select
            label="Status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.currentTarget.value)}
          >
            <s-option value="open">Open</s-option>
            <s-option value="in_progress">In progress</s-option>
            <s-option value="closed">Closed</s-option>
          </s-select>
        ) : null}

        {error ? <s-banner tone="critical">{error}</s-banner> : null}

        <s-stack direction="inline" gap="small">
          <s-button type="submit" variant="primary" disabled={busy}>
            {busy ? 'Working…' : submitLabel}
          </s-button>
          <s-button onClick={cancel} disabled={busy}>
            Cancel
          </s-button>
          {isEdit ? (
            <s-button tone="critical" onClick={onDelete} disabled={busy}>
              Delete
            </s-button>
          ) : null}
        </s-stack>
      </s-stack>
    </s-form>
  );
}
