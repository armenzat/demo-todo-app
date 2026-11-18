import { useState, type FormEvent } from "react";
import { useTodos, type Filter } from "./useTodos";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function App() {
  const { todos, add, toggle, remove, clearCompleted } = useTodos();
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = todos.filter((t) => (filter === "all" ? true : filter === "active" ? !t.done : t.done));
  const remaining = todos.filter((t) => !t.done).length;
  const hasCompleted = todos.some((t) => t.done);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    add(draft);
    setDraft("");
  };

  return (
    <main className="app">
      <h1>Todo list</h1>

      <form onSubmit={onSubmit} className="new-todo">
        <input
          aria-label="New todo"
          placeholder="What needs to be done?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty">Nothing to do yet. Add your first todo above.</p>
      ) : (
        <>
          <ul className="todos" aria-label="Todos">
            {visible.map((todo) => (
              <li key={todo.id} className={todo.done ? "done" : undefined}>
                <label>
                  <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} />
                  <span>{todo.title}</span>
                </label>
                <button type="button" aria-label={`Delete ${todo.title}`} onClick={() => remove(todo.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>

          <footer className="toolbar">
            <span data-testid="remaining">
              {remaining} {remaining === 1 ? "item" : "items"} left
            </span>
            <nav aria-label="Filter">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </nav>
            <button type="button" onClick={clearCompleted} disabled={!hasCompleted}>
              Clear completed
            </button>
          </footer>
        </>
      )}
    </main>
  );
}
