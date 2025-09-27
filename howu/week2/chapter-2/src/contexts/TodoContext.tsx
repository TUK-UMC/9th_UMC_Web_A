import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Todo {
  id: string;
  text: string;
}

interface TodoContextType {
  todos: Todo[];
  doneTodos: Todo[];
  addTodo: (text: string) => void;
  completeTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  deleteDoneTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
    };
    setTodos([...todos, newTodo]);
  };

  const completeTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTodos(todos.filter((t) => t.id !== id));
      setDoneTodos([...doneTodos, todo]);
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const deleteDoneTodo = (id: string) => {
    setDoneTodos(doneTodos.filter((t) => t.id !== id));
  };

  const value: TodoContextType = {
    todos,
    doneTodos,
    addTodo,
    completeTodo,
    deleteTodo,
    deleteDoneTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
