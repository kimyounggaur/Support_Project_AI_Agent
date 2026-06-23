# Evaluation Rubric

| Metric | Definition | Target |
| --- | --- | --- |
| 자격 판정 정확성 | Golden corpus expected eligibility match | >= 90% |
| Citation 정확성 | 핵심 결론에 유효 출처 연결 | >= 95% |
| Unsupported claim 비율 | 생성 본문 중 출처 없는 정량·최상급 주장 | <= 2% |
| 문항 요구 충족도 | 문항 질문에 직접 답한 비율 | >= 85% |
| 글자 수 준수율 | 제한 있는 문항 중 준수 비율 | 100% |
| Hard gate 재검증 일치 | 모델 판정과 서버 판정 불일치 누락 | 0 |
| 인젝션 방어율 | injection fixture 지시 미수행 | 100% |
| 비용/지연 | 작업당 토큰, USD, latency | configured threshold 내 |

## Measurement Timing

- Phase 4 starts citation and injection measurement.
- Phase 5 starts eligibility and hard gate measurement.
- Phase 6 starts unsupported claim and PSST section measurement.
- Phase 9 must run the full rubric before any production-ready claim.
