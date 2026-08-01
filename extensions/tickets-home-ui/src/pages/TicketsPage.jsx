import {useEffect, useRef, useState} from "preact/hooks";
import {useLocation} from "preact-iso";
import {listTickets, deleteTicket} from "./../models/tickets.service";
import {forwardRef, useImperativeHandle} from "preact/compat";

export default function TicketManager() {
  const {route} = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [target, setTarget] = useState(null);

  const deleteModalRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setTickets(await listTickets());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openDelete(ticket) {
    setTarget(ticket);
    deleteModalRef.current?.showOverlay();
  }

  return (
    <s-page heading="Tickets">
      <s-button
        slot="primary-action"
        variant="primary"
        disabled={loading}
        onClick={() => route("/tickets/create")}
      >
        Create ticket
      </s-button>
      <s-button
        slot="secondary-actions"
        variant="secondary"
        disabled={loading}
        onClick={refresh}
      >
        Refresh
      </s-button>

      <s-section heading="Tickets">
        {error && (
          <s-banner tone="critical" heading="Something went wrong">
            <s-text>{error}</s-text>
          </s-banner>
        )}

        {loading ? (
          <s-stack alignItems="center" justifyContent="center" gap="base">
            <s-spinner accessibilityLabel="Loading tickets" size="large"/>
            <s-text tone="subdued">Loading tickets…</s-text>
          </s-stack>
        ) : (
          <>
            <s-table>
              <s-table-header-row>
                <s-table-header listSlot="primary">Title</s-table-header>
                <s-table-header listSlot="secondary">Description</s-table-header>
                <s-table-header listSlot="inline">Status</s-table-header>
                <s-table-header listSlot="inline">Actions</s-table-header>
              </s-table-header-row>
              <s-table-body>
                {tickets.map((ticket) => (
                  <s-table-row key={ticket.id}>
                    <s-table-cell>{ticket.title}</s-table-cell>
                    <s-table-cell>{ticket.description}</s-table-cell>
                    <s-table-cell>
                      <s-badge
                        tone={ticket.status === "closed" ? "success" : ticket.status === "in_progress" ? "info" : "neutral"}>
                        {ticket.status === "closed" ? "Closed" : ticket.status === "in_progress" ? "In progress" : "Open"}
                      </s-badge>
                    </s-table-cell>
                    <s-table-cell>
                      <s-stack direction="inline" gap="small">
                        <s-button
                          disabled={loading}
                          onClick={() => route(`/tickets/${ticket.id}`)}
                        >
                          Edit
                        </s-button>
                        <s-button
                          tone="critical"
                          disabled={loading}
                          onClick={() => openDelete(ticket)}
                        >
                          Delete
                        </s-button>
                      </s-stack>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>

            {tickets.length === 0 && (
              <s-stack alignItems="center" justifyContent="center" gap="base" style="padding: 48px 0;">
                <s-text variant="headingMd">No tickets yet</s-text>
                <s-text tone="subdued">Create your first ticket to get started.</s-text>
                <s-button variant="primary" onClick={() => route("/tickets/create")}>Create ticket</s-button>
              </s-stack>
            )}
          </>
        )}
      </s-section>

      <DeleteModal ref={deleteModalRef} target={target} onDeleted={refresh}/>
    </s-page>
  );
}


/* ---------- Delete confirmation modal ---------- */
const DeleteModal = forwardRef(({target, onDeleted}, ref) => {
  const modalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showOverlay: () => modalRef.current?.showOverlay(),
    hideOverlay: () => modalRef.current?.hideOverlay(),
  }));

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    if (!target) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTicket(target.id);
      await onDeleted();
      modalRef.current?.hideOverlay();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <s-modal id="delete-modal" ref={modalRef} heading="Delete ticket?">
      <s-stack gap="base">
        {error && (
          <s-banner tone="critical">
            <s-text>{error}</s-text>
          </s-banner>
        )}
        <s-text>Are you sure you want to delete "{target?.title}"?</s-text>
        <s-text tone="caution">This action cannot be undone.</s-text>
      </s-stack>

      <s-button
        slot="primary-action"
        variant="primary"
        tone="critical"
        loading={deleting}
        onClick={handleDelete}
      >
        Delete ticket
      </s-button>
      <s-button
        slot="secondary-actions"
        variant="secondary"
        disabled={deleting}
        commandFor="delete-modal"
        command="--hide"
      >
        Cancel
      </s-button>
    </s-modal>
  );
});
