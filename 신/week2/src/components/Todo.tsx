import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodo } from "../context/TodoContext";
import { THEME, useTheme } from "../context/ThemeProvider";
import clsx from "clsx";

const Todo = () => {
  const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "todo-container p-4 mx-auto mt-8 transition-all",
        isLightMode ? "bg-white text-black" : "bg-gray-800 text-white"
      )}
    >
      <h1 className="todo-container__header">SHIN TODO</h1>
      <TodoForm />
      <div className="render-container">
        <TodoList
          title="할 일"
          todos={todos}
          buttonLabel="완료"
          buttonColor="#28a745"
          onClick={completeTodo}
        />
        <TodoList
          title="완료"
          todos={doneTodos}
          buttonLabel="삭제"
          buttonColor="#dc3545"
          onClick={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;
