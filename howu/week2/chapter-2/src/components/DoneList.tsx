import { useTodo } from "../contexts/TodoContext";

function DoneList() {
  const { doneTodos, deleteDoneTodo } = useTodo();
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul className="render-container__list">
        {doneTodos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text" style={{ textDecoration: 'line-through', color: '#6c757d' }}>
              {todo.text}
            </span>
            <button
              type="button"
              className="render-container__item-button"
              onClick={() => deleteDoneTodo(todo.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoneList;
