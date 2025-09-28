import type { TTodo } from "../types/todo";
import { useTheme, THEME } from "../context/ThemeProvider";
import clsx from "clsx";

interface TodoListProps {
  title: string;
  todos: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick: (todo: TTodo) => void;
}

const TodoList = ({
  title,
  todos,
  buttonLabel,
  buttonColor,
  onClick,
}: TodoListProps) => {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id="todo-list" className="render-container__list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={clsx(
              "render-container__item transition-all",
              isLightMode ? "bg-gray-50" : "bg-gray-700"
            )}
          >
            <span className="render-container__item-text">{todo.text}</span>
            <button
              onClick={() => onClick(todo)}
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
            >
              {buttonLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
