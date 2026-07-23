import {useEffect, useState} from "preact/hooks";
import {useLocation} from "preact-iso";
import {createTicket} from "./../models/tickets.service";

export default function TicketCreatePage() {
  const {route} = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanup = shopify.tools.register('create_ticket', async (input) => {
      setTitle(input.title);
      setDescription(input.description);
      setStatus(input.status);
      return {
        ok: true,
        staged: input,
        note: 'Changes staged in the form. Awaiting merchant Save.',
      };
    });
    setLoading(false);

    return () => {
      console.log("cleanup", cleanup, cleanup?.())
    }
  }, []);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      await createTicket({title, description, status});
      if (shopify.intents.request?.value) {
        await shopify.intents.response?.ok({action: 'create', data: "Successfully created the ticket"});
      }
      route("/tickets");
    } catch (e) {
      setError(e.message);
      if (shopify.intents.request?.value) {
        await shopify.intents.response?.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (shopify.intents.request?.value) {
      await shopify.intents.response?.closed();
    }
    route("/tickets");
  }

  return (
    <s-page heading="Create ticket">


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
            disabled={loading}
            onInput={(e) => setTitle(e.currentTarget.value)}
          />
          <s-text-area
            label="Description"
            name="description"
            value={description}
            disabled={loading}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
          <s-select
            label="Status"
            name="status"
            value={status}
            disabled={loading}
            onChange={(e) => setStatus(e.currentTarget.value)}
          >
            <s-option value="open">Open</s-option>
            <s-option value="in_progress">In progress</s-option>
            <s-option value="closed">Closed</s-option>
          </s-select>
          <s-stack direction="inline" gap="base" justifyContent="end">
            <s-button
              variant="primary"
              loading={loading}
              onClick={handleSave}
            >
              Create
            </s-button>
            <s-button
              variant="secondary"
              disabled={loading}
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
