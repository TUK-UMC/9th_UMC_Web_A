/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/Todo";

type TodoContextValue = {
  input: string;
  setInput: (v: string) => void;
  tasks: Task[];
  todoList: Task[];
  doneList: Task[];
  addTask: (text: string) => void;
  completeTask: (id: number) => void;
  undoTask: (id: number) => void;
  deleteTask: (id: number) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

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

  const value: TodoContextValue = {
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

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context)
    throw new Error(
      "useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다."
    );
  return context;
};
