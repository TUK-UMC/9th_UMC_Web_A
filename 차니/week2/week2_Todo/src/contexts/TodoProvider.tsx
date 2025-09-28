import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/Todo";
import { TodoContext } from "./todoContext";

export function TodoProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: t, done: false }]);
    setInput("");
  }, []);

  const completeTask = useCallback(
    (id: number) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: true } : t))
      ),
    []
  );

  const undoTask = useCallback(
    (id: number) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: false } : t))
      ),
    []
  );

  const deleteTask = useCallback(
    (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const { todoList, doneList } = useMemo(() => {
    const todo = tasks.filter((t) => !t.done);
    const done = tasks.filter((t) => t.done);
    return { todoList: todo, doneList: done };
  }, [tasks]);

  const value = {
    input,
    setInput,
    tasks,
    todoList,
    doneList,
    addTask,
    completeTask,
    undoTask,
    deleteTask,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
