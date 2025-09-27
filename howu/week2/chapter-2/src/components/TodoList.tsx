import { useTodo } from "../contexts/TodoContext";

function TodoList() {
  const { todos, completeTodo, deleteTodo } = useTodo();
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul className="render-container__list">
        {todos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <div>
              <button
                type="button"
                className="render-container__item-button"
                onClick={() => completeTodo(todo.id)}
                style={{ backgroundColor: '#28a745', marginRight: '5px' }}
              >
                완료
              </button>
              <button
                type="button"
                className="render-container__item-button"
                onClick={() => deleteTodo(todo.id)}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
