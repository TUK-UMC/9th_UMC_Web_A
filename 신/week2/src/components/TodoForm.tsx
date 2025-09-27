import { useState } from "react";
import { useTodo } from "../context/TodoContext";
import { useTheme, THEME } from "../context/ThemeProvider";
import clsx from "clsx";

const TodoForm = () => {
  const [input, setInput] = useState<string>("");
  const { addTodo } = useTodo();
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      addTodo(text);
      setInput("");
    }
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        className={clsx(
          "todo-container__input transition-all",
          isLightMode ? "bg-white text-black" : "bg-gray-700 text-white"
        )}
        placeholder="할 일 입력"
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;
