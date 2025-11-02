# 🚀 useCustomFetch - 커스텀 데이터 Fetching 훅

React에서 캐싱, 재시도 로직, 요청 취소 기능이 포함된 강력한 데이터 fetching 커스텀 훅입니다.

## ✨ 주요 기능

### 📦 **캐싱 (Caching)**

- localStorage를 활용한 데이터 캐싱
- STALE_TIME (5분) 동안 캐시된 데이터 사용
- 오래된 캐시는 백그라운드에서 업데이트
- 손상된 캐시 자동 제거

### 🔄 **자동 재시도**

- 네트워크 오류 시 최대 3번 자동 재시도
- 지수 백오프 (Exponential Backoff) 전략
  - 1차 시도: 1초 후
  - 2차 시도: 2초 후
  - 3차 시도: 4초 후

### ❌ **요청 취소**

- 컴포넌트 언마운트 시 진행 중인 요청 자동 취소
- 불필요한 재시도 방지
- 메모리 누수 방지

### ⚡ **빠른 로딩**

- 캐시된 데이터로 즉시 UI 표시
- 백그라운드에서 새 데이터 가져오기
- 부드러운 사용자 경험

## 🏗️ 프로젝트 구조

```
src/
├── hooks/
│   └── useCustomFetch.ts    # 커스텀 fetching 훅
├── components/
│   └── UserCard.tsx         # 사용자 카드 컴포넌트
├── types/
│   └── index.ts             # TypeScript 타입 정의
├── App.tsx                  # 메인 앱 컴포넌트
├── App.css                  # 스타일
└── main.tsx                 # 진입점
```

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 💻 사용 예제

```typescript
import { useCustomFetch } from "./hooks/useCustomFetch";

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

function UserCard({ userId }: { userId: number }) {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생</div>;
  }

  return <div>{data?.name}</div>;
}
```

## 🧪 테스트 방법

### 1. 캐시 동작 테스트

1. 사용자를 선택하여 데이터 로드
2. 같은 사용자를 다시 선택
3. 개발자 도구 Network 탭에서 요청이 없음을 확인
4. 캐시된 데이터가 즉시 표시됨

### 2. 재시도 로직 테스트

1. 네트워크를 끊음 (오프라인 모드)
2. 사용자를 선택
3. 콘솔에서 재시도 로그 확인
4. 최대 3번 재시도 후 에러 표시

### 3. 캐시 초기화 테스트

1. 캐시 초기화 버튼 클릭
2. localStorage가 비워짐
3. 다시 사용자를 선택하면 네트워크 요청 발생

### 4. 요청 취소 테스트

1. 사용자를 선택 (로딩 중)
2. 다른 사용자로 빠르게 변경
3. 이전 요청이 취소되고 새 요청만 실행

## 📚 핵심 개념

### 1. 지수 백오프 (Exponential Backoff)

일시적인 네트워크 오류에 대응하기 위한 전략으로, 재시도 간격을 점진적으로 증가시킵니다.

```typescript
const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
// 1초 → 2초 → 4초 → 8초...
```

### 2. AbortController를 통한 요청 취소

fetch API의 AbortSignal을 사용하여 요청을 취소할 수 있습니다.

```typescript
const abortController = new AbortController();
await fetch(url, { signal: abortController.signal });
abortController.abort(); // 요청 취소
```

### 3. 캐시 무효화 전략

- **신선한 캐시**: STALE_TIME 이내면 네트워크 요청 생략
- **오래된 캐시**: 캐시를 먼저 보여주고 백그라운드에서 업데이트
- **손상된 캐시**: 자동으로 제거하고 새로 가져오기

## 🎯 학습 목표

1. **커스텀 훅 설계**: 재사용 가능한 데이터 fetching 로직 캡슐화
2. **캐싱 전략**: localStorage를 활용한 클라이언트 사이드 캐싱
3. **에러 처리**: 재시도 로직과 graceful degradation
4. **성능 최적화**: 불필요한 요청 방지 및 빠른 UI 반응
5. **메모리 관리**: cleanup 함수로 리소스 정리

## 🔗 참고 자료

- [React Hooks 공식 문서](https://react.dev/reference/react/hooks)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

## 💭 실습 후기

### 🎯 가장 중요한 학습 포인트

#### 1. **성능 최적화의 중요성**

캐싱을 통해 불필요한 네트워크 요청을 줄이는 것이 얼마나 중요한지 깨달았습니다.
실제로 동일한 사용자 데이터를 반복해서 불러올 때 캐시를 사용하면:

- 네트워크 트래픽 절감
- 서버 부하 감소
- 사용자 경험 개선 (즉시 로딩)
- 모바일 환경에서 데이터 사용량 절약

#### 2. **에러 처리의 다양한 전략**

단순히 에러를 표시하는 것이 아니라, 재시도 메커니즘을 통해 일시적인 네트워크 오류를 극복할 수 있다는 것을 배웠습니다.

- **지수 백오프**: 무작정 빠르게 재시도하면 서버에 부담을 주기 때문에, 점진적으로 대기 시간을 늘려가는 것이 효율적
- **최대 재시도 제한**: 무한 재시도는 위험할 수 있으므로 적절한 제한 필요
- **사용자 경험**: 재시도 중에도 로딩 상태를 표시하여 사용자가 현재 상황을 이해할 수 있도록 함

#### 3. **메모리 관리의 중요성**

React에서 cleanup 함수를 통해 리소스를 정리하는 것이 얼마나 중요한지 직접 체험했습니다.

```typescript
return () => {
  abortControllerRef.current?.abort();
  if (retryTimeoutRef.current !== null) {
    clearTimeout(retryTimeoutRef.current);
  }
};
```

이런 cleanup 로직이 없으면:

- 메모리 누수 발생 가능
- 불필요한 네트워크 요청 계속 실행
- 성능 저하 및 예상치 못한 동작

#### 4. **사용자 경험 디자인**

백그라운드 업데이트 패턴을 구현하면서 즉각적인 피드백의 중요성을 배웠습니다:

- 오래된 캐시를 먼저 보여줘서 사용자가 기다리지 않게 함
- 백그라운드에서 새 데이터를 가져와서 점진적으로 업데이트
- 사용자는 항상 뭔가를 볼 수 있어서 체감 성능이 훨씬 좋아짐

### 🤔 아쉬웠던 점과 개선 가능성

#### 1. **캐시 무효화 전략의 한계**

현재는 시간 기반 캐시 무효화만 구현했는데, 실제 프로덕션에서는:

- 태그 기반 캐시 무효화 (특정 이벤트 발생 시 캐시 삭제)
- 폴링 간격 조정
- 서버에서 보내는 Cache-Control 헤더 활용
  등이 필요할 것 같습니다.

#### 2. **로그 관리**

재시도 로그를 콘솔에 찍는 것은 개발 중에는 좋지만, 실제 서비스에서는:

- 구조화된 로깅 시스템
- 에러 트래킹 도구 (Sentry 등)
- 메트릭 수집
  이 필요할 것입니다.

#### 3. **오프라인 지원 강화**

현재는 캐시만 활용하지만, 더 나은 오프라인 경험을 위해서는:

- Service Worker 통합
- 네트워크 상태 감지
- 오프라인 모드 UI 표시
  등을 고려해볼 수 있습니다.

### 🚀 다음 도전 과제

1. **React Query와 비교**: `@tanstack/react-query`와 성능/기능 비교
2. **서버 캐싱**: SWR, stale-while-revalidate 패턴 심화
3. **옵티미스틱 업데이트**: 낙관적 UI 업데이트 구현
4. **무한 스크롤**: 페이지네이션과 캐싱 결합

### 📚 배운 기술

✅ `useEffect` cleanup 함수 활용  
✅ `AbortController`를 통한 요청 취소  
✅ `localStorage`를 활용한 데이터 캐싱  
✅ 지수 백오프를 통한 재시도 전략  
✅ TypeScript로 타입 안전한 훅 설계  
✅ 커스텀 훅 패턴을 통한 로직 캡슐화

### 💡 결론

이 실습을 통해 단순한 데이터 fetching이 아니라,
**안정적이고 사용자 친화적인 데이터 관리 시스템**을 만드는 것이 얼마나 복잡하고 중요한지 배울 수 있었습니다.

특히 실제 서비스에서는 네트워크가 항상 안정적이지 않고,
사용자는 빠른 응답을 원한다는 것을 감안하면,
이런 고급 캐싱 및 에러 처리 전략이 필수불가결하다는 것을 체감했습니다!

## 📝 라이선스

이 프로젝트는 학습 목적으로 만들어졌습니다.
