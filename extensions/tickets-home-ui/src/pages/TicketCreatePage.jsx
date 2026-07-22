import {useState} from "preact/hooks";
import {useLocation} from "preact-iso";
import {createTicket} from "./../models/tickets.service";

export default function TicketCreatePage() {
  const {route} = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await createTicket({title, description, status});
      route("/tickets");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <s-page heading="Create ticket">
      <s-button
        slot="primary-action"
        variant="primary"
        loading={saving}
        onClick={handleSave}
      >
        Create ticket
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
        {error && (
          <s-banner tone="critical">
            <s-text>{error}</s-text>
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
