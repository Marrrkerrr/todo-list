import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "todo_list_vite_tailwind_v4";

const seed = [
  { id: crypto.randomUUID(), text: "im tired", highlighted: false },
  { id: crypto.randomUUID(), text: "but i did it", highlighted: false },
  { id: crypto.randomUUID(), text: "its my win che tam", highlighted: false },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
    
      if (!parsed || parsed.length < 3 || parsed[0].text !== seed[0].text) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return parsed;
    } catch {
      return seed;
    }
  });

  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const t = text.trim();
    if (!t) return;
    setTasks(prev => [{ id: crypto.randomUUID(), text: t, highlighted: false }, ...prev]);
    setText("");
  };

  const del = id => setTasks(prev => prev.filter(x => x.id !== id));
  const toggle = id =>
    setTasks(prev => prev.map(x => (x.id === id ? { ...x, highlighted: !x.highlighted } : x)));

  const filtered = useMemo(() => {
    if (filter === "active") return tasks.filter(t => !t.highlighted);
    if (filter === "highlighted") return tasks.filter(t => t.highlighted);
    return tasks;
  }, [tasks, filter]);

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
        <header className="mb-8">
          <h1 className="font-bold text-5xl md:text-6xl tracking-tight">Simple To-Do List</h1>
          <p className="text-zinc-300 mt-3">Click a task to highlight it in lavender</p>
        </header>

        {/* Add input */}
        <div className="flex gap-3 items-center mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task and press Enter"
            className="flex-1 rounded-2xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-zinc-500 placeholder:text-zinc-400"
          />
          <button onClick={addTask} className="btn">Add</button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {["all", "active", "highlighted"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-outline capitalize ${filter === f ? "bg-zinc-800/70 border-zinc-600" : ""}`}
            >
              {f}
            </button>
          ))}

          {/* Reset demo data */}
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
            className="btn-outline ml-auto text-sm"
          >
            Reset
          </button>
        </div>

        {/* List */}
        <ul className="mt-6 space-y-4">
          {filtered.map(task => (
            <li
              key={task.id}
              className={`group flex items-center gap-4 p-3 rounded-2xl border border-zinc-800/60 ${
                task.highlighted ? "bg-[#E6E6FA] text-zinc-900" : "bg-zinc-800 hover:bg-zinc-700/80"
              }`}
            >
              <span
                onClick={() => toggle(task.id)}
                className={`flex-1 cursor-pointer select-none ${task.highlighted ? "font-semibold" : ""}`}
              >
                • {task.text}
              </span>
              <button
                onClick={() => del(task.id)}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  task.highlighted
                    ? "bg-zinc-900 text-[#E6E6FA] hover:bg-zinc-800"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                Delete
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="text-zinc-400 italic">Nothing here… add a task!</li>}
        </ul>
      </div>
    </main>
  );
}
