import {useEffect, useState} from "preact/hooks";
import {useLocation} from "preact-iso";
import {getTicket, updateTicket} from "./../models/tickets.service";

export default function TicketDetailPage({id}) {
  const {route} = useLocation();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let cleanup;
    setLoading(true);
    setLoadError(null);
    getTicket(id)
      .then((t) => {
        setTicket(t);
        setTitle(t.title);
        setDescription(t.description);
        setStatus(t.status);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => {
        cleanup = shopify.tools.register('edit_ticket', async (input) => {
          setTicket((prev) => ({...prev, ...input}));
          setTitle(input.title);
          setDescription(input.description);
          setStatus(input.status);
          return {
            ok: true,
            id,
            staged: input,
            note: 'Changes staged in the form. Awaiting merchant Save.',
          };
        });
        setLoading(false);
      });

    return () => {
      console.log("cleanup", cleanup, cleanup?.())
    }
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateTicket(id, {title, description, status});
      if (shopify.intents.request?.value) {
        await shopify.intents.response?.ok({
          id, action: 'edit', data: {
            result: "Successfully updated the ticket",
          }
        });
      }
      route("/tickets");
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (shopify.intents.request?.value) {
      await shopify.intents.response?.closed();
    }
    route("/tickets");
  }

  if (loading) {
    return (
      <s-page heading="Edit ticket">
        <s-stack alignItems="center" justifyContent="center" gap="base">
          <s-spinner accessibilityLabel="Loading ticket" size="large"/>
          <s-text tone="neutral">Loading ticket…</s-text>
        </s-stack>
      </s-page>
    );
  }

  if (loadError) {
    return (
      <s-page heading="Edit ticket">
        <s-banner tone="critical" heading="Failed to load ticket">
          <s-text>{loadError}</s-text>
        </s-banner>
      </s-page>
    );
  }

  return (
    <s-page heading={`Edit ticket: ${ticket?.title}`}>
      <s-section>
        {saveError && (
          <s-banner tone="critical">
            <s-text>{saveError}</s-text>
          </s-banner>
        )}
        <s-stack gap="base">
          <s-text-field
            label="Title"
            name="title"
            value={title}
            disabled={saving}
            onInput={(e) => setTitle(e.currentTarget.value)}
          />
          <s-text-area
            label="Description"
            name="description"
            value={description}
            disabled={saving}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
          <s-select
            label="Status"
            name="status"
            value={status}
            disabled={saving}
            onChange={(e) => setStatus(e.currentTarget.value)}
          >
            <s-option value="open">Open</s-option>
            <s-option value="in_progress">In progress</s-option>
            <s-option value="closed">Closed</s-option>
          </s-select>
          <s-stack direction="inline" gap="base" justifyContent="end">
            <s-button
              variant="primary"
              loading={saving}
              onClick={handleSave}
            >
              Update
            </s-button>
            <s-button
              variant="secondary"
              disabled={saving}
              onClick={handleCancel}
            >
              Cancel
            </s-button>
          </s-stack>
        </s-stack>
      </s-section>
    </s-page>
  );
}
