# 🎬 Movie List - FSD 아키텍처

TMDB API를 활용한 영화 목록 애플리케이션입니다. Feature-Sliced Design(FSD) 아키텍처를 적용하여 구현했습니다.

## 🏗️ 프로젝트 구조

```
src/
├── app/                                    # 애플리케이션 레이어
│   ├── providers/                          # 프로바이더 설정
│   ├── router/                            # 라우팅 설정
│   └── styles/                            # 전역 스타일
│
├── shared/                                 # 공유 레이어
│   ├── config/                            # 설정 파일
│   │   ├── api.ts                         # API 설정, 이미지 URL 헬퍼
│   │   └── index.ts
│   ├── api/                               # API 클라이언트
│   │   ├── movieApi.ts                    # 영화 API 클라이언트
│   │   └── index.ts
│   ├── ui/                                # 공통 UI 컴포넌트
│   └── lib/                               # 유틸리티 함수
│
├── entities/                              # 엔티티 레이어
│   └── movie/                             # 영화 엔티티
│       ├── model/                         # 모델, 타입 정의
│       │   ├── types.ts                   # Movie, MoviesResponse 타입
│       │   └── index.ts
│       ├── ui/                            # 엔티티 UI 컴포넌트
│       │   ├── MovieCard.tsx              # 영화 카드 컴포넌트
│       │   └── index.ts
│       └── index.ts
│
├── features/                              # 기능 레이어
│   ├── movie-search/                      # 영화 검색 기능
│   ├── movie-favorites/                   # 즐겨찾기 기능
│   └── movie-rating/                      # 평점 기능
│
├── widgets/                               # 위젯 레이어
│   ├── movie-list/                        # 영화 목록 위젯
│   │   ├── MovieListWidget.tsx
│   │   └── index.ts
│   └── movie-card/                        # 영화 카드 위젯
│
└── pages/                                 # 페이지 레이어
    ├── home/                              # 홈 페이지
    │   ├── HomePage.tsx
    │   └── index.ts
    └── movie-detail/                      # 영화 상세 페이지
```

## 🚀 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 TMDB API Bearer 토큰을 설정하세요:

```env
# TMDB API Bearer 토큰 (Access Token)
VITE_MOVIE_API_KEY=your_tmdb_bearer_token_here

# API 기본 URL (선택사항)
VITE_MOVIE_API_BASE_URL=https://api.themoviedb.org/3

# 이미지 기본 URL (선택사항)
VITE_MOVIE_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

> 💡 TMDB API Bearer 토큰은 [The Movie Database API Settings](https://www.themoviedb.org/settings/api)에서 발급받을 수 있습니다.
> 
> **인증 방식**: Bearer Token (Read Access Token 사용)

### 2. 패키지 설치 및 실행

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

## ✨ 구현된 기능

### 현재 구현 상태

- ✅ **영화 목록 표시**: 현재 상영중인 영화 목록을 그리드 형태로 표시
- ✅ **영화 카드**: 포스터 이미지와 함께 영화 정보 표시
- ✅ **호버 인터랙션**: 마우스 호버 시 영화 상세 정보 표시 (제목, 개봉일, 평점)
- ✅ **반응형 레이아웃**: 화면 크기에 따라 2~6열 그리드로 자동 조정
- ✅ **로딩 상태**: API 호출 중 로딩 메시지 표시
- ✅ **에러 핸들링**: API 에러 발생 시 에러 메시지 표시

### API 엔드포인트

`shared/api/movieApi.ts`에서 제공하는 API 메서드:

- `getNowPlaying()`: 현재 상영중인 영화
- `getPopular()`: 인기 영화
- `getTopRated()`: 평점 높은 영화
- `getUpcoming()`: 개봉 예정 영화

## 🎨 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **TMDB API** - 영화 데이터

## 📐 FSD 아키텍처 특징

### 레이어별 역할

1. **shared**: 재사용 가능한 공통 코드 (API 클라이언트, 설정, UI 컴포넌트)
2. **entities**: 비즈니스 엔티티 (영화 타입, 영화 카드)
3. **features**: 사용자 시나리오 기능 (검색, 즐겨찾기 등)
4. **widgets**: 독립적인 UI 블록 (영화 목록)
5. **pages**: 전체 페이지 조합
6. **app**: 앱 초기화 및 설정

### 의존성 규칙

```
app → pages → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어를 import할 수 있습니다
- 하위 레이어는 상위 레이어를 import할 수 없습니다
- 같은 레이어 내에서는 서로 독립적입니다

## 📝 컴포넌트 구조

### MovieCard (entities/movie/ui)

영화 카드 UI 컴포넌트로, 개별 영화 정보를 표시합니다.

```tsx
<MovieCard movie={movieData} />
```

**주요 기능:**
- 포스터 이미지 표시
- 이미지 없을 시 대체 UI
- 호버 시 상세 정보 표시 (제목, 개봉일, 평점)
- 스케일 애니메이션 효과

### MovieListWidget (widgets/movie-list)

영화 목록을 표시하는 위젯 컴포넌트입니다.

**주요 기능:**
- API를 통한 영화 데이터 fetch
- 로딩/에러 상태 관리
- 반응형 그리드 레이아웃

### HomePage (pages/home)

메인 페이지로 영화 목록 위젯을 조합합니다.

## 🔧 향후 개선 계획

- [ ] 영화 상세 페이지 구현
- [ ] 영화 검색 기능 (features/movie-search)
- [ ] 즐겨찾기 기능 (features/movie-favorites)
- [ ] 무한 스크롤 페이지네이션
- [ ] 카테고리별 필터링 (현재 상영, 인기, 개봉 예정 등)
- [ ] 라우팅 설정 (app/router)

## 📄 라이선스

This project is licensed under the MIT License.
