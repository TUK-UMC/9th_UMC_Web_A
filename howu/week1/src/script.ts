// 1. element 선언
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 2. 할 일 type 정의
type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = [];
let doneTodos: Todo[] = [];

// 3. 할 일 목록 렌더링 하는 함수 정의
const renderTasks = (): void => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // 할 일 목록 렌더링
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo, false);
    todoList.appendChild(todoElement);
  });

  // 완료된 할 일 목록 렌더링
  doneTodos.forEach((todo) => {
    const doneElement = createTodoElement(todo, true);
    doneList.appendChild(doneElement);
  });
};

// 4. 할 일 텍스트 입력처리 함수.(공백 제거)
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 5. 할 일 추가 처리함수.
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = "";
  renderTasks();
};

// 6. 할 일 완료 처리함수.
const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t) => t.id !== todo.id);
  doneTodos.push(todo);
  renderTasks();
};

// 7. 할 일 삭제 처리함수.
const deleteTodo = (todo: Todo): void => {
  doneTodos = doneTodos.filter((t) => t.id !== todo.id);
  renderTasks();
};

// 8. 할 일 요소 생성 함수.
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
  const li = document.createElement("li");
  li.classList.add("todo-container__item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("todo-container__item-button");

  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }

  button.addEventListener("click", (): void => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

// 9. 폼 제출 리스너
todoForm.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  const text = getTodoText();
  if (text) addTodo(text);
});
