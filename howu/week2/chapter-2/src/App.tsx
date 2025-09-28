import "./App.css";
import { TodoProvider } from "./contexts/TodoContext";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import DoneList from "./components/DoneList";

function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">HOWU TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
