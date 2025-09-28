import { createContext } from "react";
import type { Task } from "../types/Todo";

export type TodoContextValue = {
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

export const TodoContext = createContext<TodoContextValue | null>(null);
