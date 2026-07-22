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
    setLoading(true);
    setLoadError(null);
    getTicket(id)
      .then((t) => {
        setTicket(t);
        setTitle(t.title);
        setDescription(t.description);
        setStatus(t.status === true ? "closed" : t.status === false ? "open" : t.status ?? "open");
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateTicket(id, {title, description, status});
      route("/tickets");
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <s-page heading="Edit ticket">
        <s-stack alignItems="center" justifyContent="center" gap="base">
          <s-spinner accessibilityLabel="Loading ticket" size="large"/>
          <s-text tone="subdued">Loading ticket…</s-text>
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
      <s-button
        slot="primary-action"
        variant="primary"
        loading={saving}
        onClick={handleSave}
      >
        Save changes
      </s-button>
      <s-button
        slot="secondary-actions"
        variant="secondary"
        disabled={saving}
        onClick={() => route("/tickets")}
      >
        Cancel
      </s-button>

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
        </s-stack>
      </s-section>
    </s-page>
  );
}
