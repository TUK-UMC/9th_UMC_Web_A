import { useContext } from "react";
import { TodoContext } from "../contexts/todoContext";

export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo must be used within TodoProvider");
  return ctx;
}
