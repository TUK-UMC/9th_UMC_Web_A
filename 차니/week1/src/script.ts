// HTML요소를 변수에 할당
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 할 일 객체 타입 정의
type Todo = {
  id: number;
  text: string;
};

// 할 일 목록
let todos: Todo[] = [];
// 완료된 일 목록
let doneTodos: Todo[] = [];

// 일정 목록 렌더링
const renderTasks = (): void => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo, false);
    todoList.appendChild(todoElement);
  });

  doneTodos.forEach((doneTodo) => {
    const doneElement = createTodoElement(doneTodo, true);
    doneList.appendChild(doneElement);
  });
};

// 할 일 입력
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 할 일 추가
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = "";
  renderTasks();
};

// 할 일 상태 변경
const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t) => t.id !== todo.id);
  doneTodos.push(todo);
  renderTasks();
};

// 완료된 일 삭제
const deleteTodo = (todo: Todo): void => {
  doneTodos = doneTodos.filter((t) => t.id !== todo.id);
  renderTasks();
};

// 할 일 목록 생성 및 삭제
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

// 할 일 이름이 입력되었을 경우에만 할 일 추가 진행
todoForm.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  const text = getTodoText();
  if (text) addTodo(text);
});
