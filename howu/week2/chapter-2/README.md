# HOWU TODO - React Context API를 활용한 Props 드릴링 해결

React + TypeScript + Vite로 구현한 TODO 애플리케이션입니다. Context API를 사용하여 Props 드릴링 문제를 해결했습니다.

## 🎯 주요 기능

- ✅ 할 일 추가
- ✅ 할 일 완료 처리
- ✅ 할 일 삭제
- ✅ 완료된 할 일 삭제
- ✅ Context API를 통한 전역 상태 관리

## 🚀 Props 드릴링 해결 과정

### 1. 문제 상황 파악

**기존 구조 (Props 드릴링)**:
```tsx
// App.tsx - 모든 상태와 함수를 props로 전달해야 함
function App() {
  const [todos, setTodos] = useState([]);
  const [doneTodos, setDoneTodos] = useState([]);
  
  return (
    <div>
      <TodoForm addTodo={addTodo} />
      <TodoList 
        todos={todos} 
        completeTodo={completeTodo} 
        deleteTodo={deleteTodo} 
      />
      <DoneList 
        doneTodos={doneTodos} 
        deleteDoneTodo={deleteDoneTodo} 
      />
    </div>
  );
}
```

**문제점**:
- App 컴포넌트에서 모든 상태 관리
- 하위 컴포넌트로 props 전달 필요
- 컴포넌트가 많아질수록 전달 경로가 복잡해짐

### 2. Context API 도입

**해결책**: `TodoContext.tsx` 생성

```tsx
// TodoContext.tsx - 전역 상태 관리
const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);
  
  // 상태 변경 함수들
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
    };
    setTodos([...todos, newTodo]);
  };

  const completeTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTodos(todos.filter((t) => t.id !== id));
      setDoneTodos([...doneTodos, todo]);
    }
  };

  // ... 기타 함수들

  const value: TodoContextType = {
    todos,
    doneTodos,
    addTodo,
    completeTodo,
    deleteTodo,
    deleteDoneTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
```

### 3. 커스텀 훅으로 접근 단순화

```tsx
// useTodo 훅 - Context 접근을 더 쉽게
export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
```

**개선점**:
- Context 접근 로직을 캡슐화
- Provider 범위 밖에서 사용 시 에러 처리
- 타입 안전성 보장

### 4. App 컴포넌트 단순화

**Before**:
```tsx
function App() {
  const [todos, setTodos] = useState([]);
  const [doneTodos, setDoneTodos] = useState([]);
  
  const addTodo = (text) => { /* ... */ };
  const completeTodo = (id) => { /* ... */ };
  // ... 모든 상태와 함수들
  
  return (
    <div>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} completeTodo={completeTodo} deleteTodo={deleteTodo} />
      <DoneList doneTodos={doneTodos} deleteDoneTodo={deleteDoneTodo} />
    </div>
  );
}
```

**After**:
```tsx
function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">HOWU TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList />
          <DoneList />
        </div>
      </div>
    </TodoProvider>
  );
}
```

**개선점**:
- App 컴포넌트에서 상태 관리 로직 제거
- props 전달 불필요
- 컴포넌트 구조 단순화

### 5. 각 컴포넌트에서 직접 접근

**TodoForm.tsx**:
```tsx
function TodoForm() {
  const { addTodo } = useTodo(); // props 없이 직접 접근
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const todoText = formData.get('todo-input') as string;
    
    if (todoText.trim()) {
      addTodo(todoText.trim()); // 직접 호출
      e.currentTarget.reset();
    }
  };
  // ...
}
```

**TodoList.tsx**:
```tsx
function TodoList() {
  const { todos, completeTodo, deleteTodo } = useTodo(); // 필요한 것만 가져오기
  
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul className="render-container__list">
        {todos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <div>
              <button onClick={() => completeTodo(todo.id)}>완료</button>
              <button onClick={() => deleteTodo(todo.id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 6. 최종 개선 결과

**Before (Props 드릴링)**:
- App 컴포넌트에서 모든 상태 관리
- 하위 컴포넌트로 props 전달
- 컴포넌트 간 강한 결합

**After (Context 사용)**:
- 전역 상태 관리로 props 전달 제거
- 각 컴포넌트가 필요한 상태/함수에 직접 접근
- 컴포넌트 간 결합도 감소
- 코드 가독성과 유지보수성 향상

## 🛠️ 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Context API** - 전역 상태 관리
- **CSS Modules** - 스타일링

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── TodoForm.tsx      # 할 일 추가 폼
│   ├── TodoList.tsx      # 할 일 목록
│   └── DoneList.tsx      # 완료된 할 일 목록
├── contexts/
│   └── TodoContext.tsx   # 전역 상태 관리
├── App.tsx               # 메인 앱 컴포넌트
└── main.tsx              # 앱 진입점
```

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📚 학습 포인트

1. **Props 드릴링 문제**: 컴포넌트 계층이 깊어질수록 props 전달이 복잡해지는 문제
2. **Context API**: React의 전역 상태 관리 솔루션
3. **커스텀 훅**: Context 접근 로직을 캡슐화하여 재사용성 향상
4. **타입 안전성**: TypeScript를 활용한 컴파일 타임 에러 방지
5. **컴포넌트 분리**: 단일 책임 원칙에 따른 컴포넌트 설계

## 🔗 참고 자료

- [React Context API 공식 문서](https://react.dev/learn/passing-data-deeply-with-context)
- [React Hooks 공식 문서](https://react.dev/reference/react)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
