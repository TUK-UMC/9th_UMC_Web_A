import { useTodo } from "../contexts/TodoContext";

function TodoForm() {
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const todoText = formData.get('todo-input') as string;
    
    if (todoText.trim()) {
      addTodo(todoText.trim());
      e.currentTarget.reset();
    }
  };

  return (
    <form id="todo-form" className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="todo-input"
        className="todo-container__input"
        placeholder="할 일 입력"
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
}

export default TodoForm;
