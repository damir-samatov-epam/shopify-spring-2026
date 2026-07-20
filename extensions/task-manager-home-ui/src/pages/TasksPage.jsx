import {useEffect, useRef, useState} from "preact/hooks";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./../models/tasks.service";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(null);
  const [target, setTarget] = useState(null);

  // Ref to the form modal so we can open it imperatively
  const formModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setTasks(await listTasks());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditing(null);
    formModalRef.current?.showOverlay();
  }

  function openEdit(task) {
    setEditing(task);
    formModalRef.current?.showOverlay();
  }

  function openDelete(task) {
    setTarget(task);
    deleteModalRef.current?.showOverlay();
  }

  return (
    <s-page heading="Task Manager">
      {/* Imperative open — no commandFor (won't resolve from the title bar) */}
      <s-button
        slot="primary-action"
        variant="primary"
        disabled={loading}
        onClick={openCreate}
      >
        Create task
      </s-button>

      <s-section heading="Tasks">
        {error && (
          <s-banner tone="critical" heading="Something went wrong">
            <s-text>{error}</s-text>
          </s-banner>
        )}

        {loading ? (
          <s-stack alignItems="center" justifyContent="center" gap="base">
            <s-spinner accessibilityLabel="Loading tasks" size="large"/>
            <s-text tone="subdued">Loading tasks…</s-text>
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
                {tasks.map((task) => (
                  <s-table-row key={task.id}>
                    <s-table-cell>{task.title}</s-table-cell>
                    <s-table-cell>{task.description}</s-table-cell>
                    <s-table-cell>
                      <s-badge tone={task.status ? "success" : "neutral"}>
                        {task.status ? "Done" : "Pending"}
                      </s-badge>
                    </s-table-cell>
                    <s-table-cell>
                      <s-stack direction="inline" gap="small">
                        <s-button
                          disabled={loading}
                          onClick={() => openEdit(task)}
                        >
                          Edit
                        </s-button>
                        <s-button
                          tone="critical"
                          disabled={loading}
                          onClick={() => openDelete(task)}
                        >
                          Delete
                        </s-button>
                      </s-stack>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>

            {tasks.length === 0 && (
              <s-text>No tasks yet. Create your first one!</s-text>
            )}
          </>
        )}
      </s-section>

      <TaskFormModal ref={formModalRef} editing={editing} onSaved={refresh}/>
      <DeleteModal ref={deleteModalRef} target={target} onDeleted={refresh}/>
    </s-page>
  );
}

import {forwardRef, useImperativeHandle} from "preact/compat";

/* ---------- Create / Edit modal ---------- */
const TaskFormModal = forwardRef(({editing, onSaved}, ref) => {
  const modalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showOverlay: () => modalRef.current?.showOverlay(),
    hideOverlay: () => modalRef.current?.hideOverlay(),
  }));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(editing?.title ?? "");
    setDescription(editing?.description ?? "");
    setStatus(editing?.status ?? false);
    setError(null);
  }, [editing]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const input = {title, description, status};
    try {
      if (editing) {
        await updateTask(editing.id, input);
      } else {
        await createTask(input);
      }
      await onSaved();
      modalRef.current?.hideOverlay();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <s-modal
      id="task-modal"
      ref={modalRef}
      heading={editing ? "Edit task" : "Create task"}
    >
      <s-stack gap="base">
        {error && (
          <s-banner tone="critical">
            <s-text>{error}</s-text>
          </s-banner>
        )}
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
        <s-checkbox
          label="Completed"
          name="status"
          details="Mark this task as done"
          checked={status}
          disabled={saving}
          onChange={(e) => setStatus(e.currentTarget.checked)}
        />
      </s-stack>

      <s-button
        slot="primary-action"
        variant="primary"
        loading={saving}
        onClick={handleSave}
      >
        {editing ? "Save changes" : "Create task"}
      </s-button>
      {/* Cancel is INSIDE the modal, so commandFor resolves fine here */}
      <s-button
        slot="secondary-actions"
        variant="secondary"
        disabled={saving}
        commandFor="task-modal"
        command="--hide"
      >
        Cancel
      </s-button>
    </s-modal>
  );
});

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
      await deleteTask(target.id);
      await onDeleted();
      modalRef.current?.hideOverlay();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <s-modal id="delete-modal" ref={modalRef} heading="Delete task?">
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
        Delete task
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
