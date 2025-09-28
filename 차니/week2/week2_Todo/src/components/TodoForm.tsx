import type React from "react";
import { useTodo } from "../hooks/useTodo";

export default function TodoForm() {
  const { input, setInput, addTask } = useTodo();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask(input);
  };

  return (
    <form
      id="todo-form"
      className="todo-container__form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        id="todo-input"
        className="todo-container__input"
        placeholder="할 일 입력"
        required
        value={input}
        onChange={(e): void => setInput(e.target.value)}
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
}
