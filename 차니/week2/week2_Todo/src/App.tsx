import "../style.css";
import TodoForm from "./components/TodoForm";
import { TodoProvider } from "./contexts/TodoContext";
import TodoList from "./components/TodoList";
import DoneList from "./components/DoneList";

export default function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">CHANI TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </TodoProvider>
  );
}
