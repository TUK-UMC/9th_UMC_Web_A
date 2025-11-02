# 🎵 LP Collection - React Query 실습 프로젝트

React Query와 Infinite Scroll을 활용한 LP 수집 애플리케이션입니다.

## 📚 실습 내용

### **무한 스크롤 구현 (Infinite Scroll)**

- **이해한 점**: Intersection Observer API를 활용하여 **스크롤이 화면 하단에 도달하면 자동으로 다음 데이터를 불러오는** 무한 스크롤 기능을 구현했습니다.
  `useInfiniteQuery`와 결합하여 페이지네이션을 자동으로 처리하며, 사용자가 더 보기 버튼을 클릭할 필요 없이 자연스럽게 콘텐츠를 탐색할 수 있습니다.
- 예시:
  ```typescript
  // Intersection Observer를 통한 무한 스크롤
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = observerRef.current;
    const option = { threshold: 0 };

    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.disconnect(); // cleanup
  }, [handleObserver]);
  ```
  ```tsx
  // 옵저버를 위한 DOM 요소
  {
    hasNextPage && <div ref={observerRef} className="h-10" />;
  }
  ```
- **어려운 점 (개선 방법)**: 처음에는 `useEffect`의 의존성 배열 설정과 cleanup 함수 처리가 헷갈렸으며, `useCallback`을 사용하지 않아 무한 루프가 발생하는 문제가 있었습니다.
  - 개선 방법: `useCallback`으로 콜백 함수를 메모이제이션하여 의존성이 변경될 때만 재생성되도록 했고, `observer.disconnect()`를 통해 컴포넌트 언마운트 시 옵저버를 정리하여 메모리 누수를 방지했습니다.
  - 예시:
    ```typescript
    // useCallback으로 함수 메모이제이션
    const handleObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        // ... 로직
      },
      [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    // cleanup 함수로 정리
    useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, option);
      observer.observe(element);
      return () => observer.disconnect(); // ✅ cleanup 필수!
    }, [handleObserver]);
    ```
- **회고**: 무한 스크롤을 구현하면서 **사용자 경험(UX)의 중요성**을 깨달았습니다.
  단순히 '더 보기' 버튼을 클릭하는 것보다 스크롤만으로 콘텐츠를 탐색할 수 있게 만드는 것이 훨씬 더 **직관적이고 편리하다**는 것을 체감했습니다.
  특히 SNS, 쇼핑몰, 뉴스피드 등 실제 프로덕션 환경에서 무한 스크롤은 사용자 참여도를 높이는 핵심 기능이라는 것을 알 수 있었습니다. 앞으로 프로젝트에 **자연스러운 무한 스크롤을 적용**하여 사용자가 불편함 없이 콘텐츠를 탐색할 수 있도록 노력하겠습니다!

---

## 🛠️ 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Query** - 서버 상태 관리 및 캐싱
- **Axios** - HTTP 클라이언트
- **React Router** - 라우팅
- **Tailwind CSS** - 스타일링

## 🚀 주요 기능

### 1. **React Query 통합**

- `useInfiniteQuery`로 무한 스크롤 구현
- `useQuery`로 상세 데이터 조회
- 캐싱 및 자동 재시도 전략

### 2. **무한 스크롤**

- Intersection Observer API 활용
- LP 목록 무한 스크롤
- 댓글 목록 무한 스크롤
- Skeleton UI 로딩 상태

### 3. **인증 시스템**

- JWT 기반 로그인/회원가입
- Google OAuth 소셜 로그인
- AuthGuard 컴포넌트로 페이지 보호
- 자동 토큰 갱신 (Axios Interceptor)

### 4. **반응형 UI**

- 헤더/사이드바/메인 레이아웃
- 모바일 햄버거 메뉴
- 호버 효과 및 애니메이션
- 다크 테마 디자인

## 📁 프로젝트 구조

```
src/
├── api/
│   ├── authApi.ts          # 인증 API
│   ├── axiosInstance.ts    # Axios 설정 (토큰 갱신)
│   ├── commentApi.ts       # 댓글 API
│   ├── lpApi.ts            # LP API
│   └── userApi.ts          # 사용자 API
├── components/
│   ├── AuthGuard.tsx       # 인증 보호 컴포넌트
│   ├── EmailStep.tsx       # 이메일 입력 단계
│   ├── GoogleLoginButton.tsx # Google 로그인 버튼
│   ├── Layout.tsx          # 레이아웃 (헤더/사이드바)
│   ├── LpCardSkeleton.tsx  # 스켈레톤 UI
│   ├── NicknameStep.tsx    # 닉네임 입력 단계
│   └── PasswordStep.tsx    # 비밀번호 입력 단계
├── hooks/
│   ├── useAuth.ts          # 인증 훅
│   └── useLocalStorage.ts  # 로컬 스토리지 훅
├── schemas/
│   └── authSchemas.ts      # Zod 스키마
├── types/
│   └── auth.ts             # TypeScript 타입
├── App.tsx                 # 라우팅 설정
├── Login.tsx               # 로그인 페이지
├── MainPage.tsx            # LP 목록 페이지
├── LpDetailPage.tsx        # LP 상세 페이지
├── MyPage.tsx              # 마이페이지
├── GoogleCallback.tsx      # Google OAuth 콜백
└── main.tsx                # 진입점
```

## 🔗 참고 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Hooks 공식 문서](https://react.dev/reference/react/hooks)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
