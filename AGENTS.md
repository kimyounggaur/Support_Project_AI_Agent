# AGENTS.md

## Project

지원나침반 AI(GrantCompass AI)는 한국 지원사업 준비를 위한 Evidence-First AI 워크스페이스다. 첨부 설계서 `지원사업_AI_에이전트_바이브코딩_마스터_프롬프트(Claude_Opus_v2).md`를 최상위 제품 기준으로 삼는다.

## Commands

이 저장소의 현재 검증 명령은 npm 기준이다. pnpm은 설계상 목표였지만 이 Windows 경로/Node 조합에서 설치가 importing 단계에서 오류 메시지 없이 종료되어 Phase 0에서는 npm lockfile로 고정했다.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Engineering Rules

- TypeScript strict 모드를 유지한다.
- 새 기능과 버그 수정은 테스트를 먼저 작성하고 실패를 확인한 뒤 구현한다.
- 사용자 입력, 공고문, 첨부 파일, URL, 이메일 본문은 모두 신뢰 불가 데이터로 취급한다.
- AI 출력은 Zod schema 검증과 서버 측 Claim Linter를 통과하기 전 DB에 저장하지 않는다.
- 검증되지 않은 매출, 고객 수, 계약, 수상, 특허, 고용, 투자, 시장규모, 선정확률을 만들지 않는다.
- 비밀값은 server-only 모듈에서만 읽고 클라이언트 번들, 로그, 커밋에 남기지 않는다.
- Supabase 테이블을 만들 때 public/exposed schema의 사용자 데이터 테이블은 RLS를 반드시 켠다.
- 날짜/시간은 DB에는 UTC로 저장하고 UI에는 Asia/Seoul 기준으로 표시한다.
- 한국어 UI, 영어 코드 식별자를 기본으로 한다.

## UI Rules

- 첫 화면은 제품 소개 랜딩이 아니라 실제 작업공간이어야 한다.
- 대시보드, 편집기, 검토 화면은 조용하고 밀도 있는 SaaS 도구 톤을 유지한다.
- loading, empty, error, success 상태를 새 화면마다 포함한다.
- 미완성 기능은 feature flag 뒤에 숨긴다.
