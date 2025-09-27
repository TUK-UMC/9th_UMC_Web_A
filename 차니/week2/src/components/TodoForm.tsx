import type { FormEvent } from "react";

type Props = {
  input: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function TodoForm({ input, onChange, onSubmit }: Props) {
  return (
    <form id="todo-form" className="todo-container__form" onSubmit={onSubmit}>
      <input
        type="text"
        id="todo-input"
        className="todo-container__input"
        placeholder="할 일 입력"
        required
        value={input}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
}
