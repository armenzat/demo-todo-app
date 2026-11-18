import { useEffect, useState } from "react";

export type Todo = { id: string; title: string; done: boolean };
export type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "demo-todos";

function load(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Todo[];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const add = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((list) => [...list, { id: crypto.randomUUID(), title: trimmed, done: false }]);
  };
  const toggle = (id: string) =>
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((list) => list.filter((t) => t.id !== id));
  const clearCompleted = () => setTodos((list) => list.filter((t) => !t.done));

  return { todos, add, toggle, remove, clearCompleted };
}
