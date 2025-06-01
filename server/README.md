# 인하대학교 자유전공융합학부 학과 추천 백엔드

## 실행 방법

1. `server` 폴더에서 `.env` 파일을 생성하고 아래와 같이 입력하세요:

```
OPENAI_API_KEY=여기에_본인의_API_KEY_입력
```

2. 의존성 설치 (이미 설치했다면 생략)
```
npm install
```

3. 서버 실행
```
npm start
```

## API 엔드포인트

- `POST /api/ask`
  - body: `{ messages: [{ role: 'user'|'assistant', content: '...'}] }`
  - 응답: `{ reply: 'GPT의 답변' }` 