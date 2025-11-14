# Deploy Production CI/CD (GitHub Actions → Azure + Vercel)

## 1️⃣ 개요

이 워크플로는 **main 브랜치에 변경 사항이 push되면** 자동으로

- **Django 백엔드**를 Azure Web App으로 배포하고,
- **React 프런트엔드**를 Vercel로 재배포하도록 구성되어 있습니다.

CI/CD 파이프라인은 **GitHub Actions + Azure OIDC + Vercel Hook** 기반으로 작동하며,  
Publish Profile을 사용하지 않는 **보안 강화형(OIDC 인증)** 구조로 변경되었습니다.

---

## 2️⃣ 리포 구조 및 관련 경로

```
today_art/
├── backend/                # Django 프로젝트
├── frontend/               # React 프로젝트
└── .github/
    └── workflows/
        └── deploy-production.yml   # 배포 자동화 워크플로
```

## 3️⃣ OIDC 기반 인증 구축 과정

기존 Publish Profile 방식에서 OIDC(OpenID Connect) 인증으로 전환했습니다.

###Azure 설정 절차

1. App 등록(App Registration)
   Azure CLI 또는 포털에서 앱을 등록합니다.

```
az ad app create --display-name "todayart-github-oidc"
```

2. Service Principal 생성

```
az ad sp create --id <client-id>
```

3. Role Assignment (권한 부여)

```
az role assignment create \
 --assignee <client-id> \
 --role contributor \
 --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group>
```

4. GitHub Secrets 등록
   | Secret 이름 | 설명 |
   | ----------------------- | ------------------- |
   | `AZURE_CLIENT_ID` | 등록된 App의 Client ID|
   | `AZURE_TENANT_ID` | Entra ID(Tenant) ID |
   | `AZURE_SUBSCRIPTION_ID` | Azure 구독 ID |

이후 GitHub Actions에서 azure/login@v2를 통해 OIDC로 로그인합니다.

---

## 4️⃣ Deploy Production 워크플로 구조

### 파일: .github/workflows/deploy-production.yml

트리거:

- push (main 브랜치)

- workflow_dispatch (수동 실행)

권한 설정:

```
permissions:
id-token: write
contents: read
```

공통 환경 변수:

```
PYTHON_VERSION: "3.13"
AZURE_WEBAPP_NAME: todayart-backend
AZURE_WEBAPP_PACKAGE_PATH: backend
```

## 5️⃣ Backend Job (Django → Azure)

### 주요 단계

1. Checkout

```
- uses: actions/checkout@v4
```

2. Azure Login (OIDC)

```
- uses: azure/login@v2
  with:
  client-id: ${{ secrets.AZURE_CLIENT_ID }}
  tenant-id: ${{ secrets.AZURE_TENANT_ID }}
  subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

3. Python 환경 세팅

```
- uses: actions/setup-python@v5
  with:
  python-version: ${{ env.PYTHON_VERSION }}
```

4. Dependencies 설치 및 Django 검사

```
- working-directory: backend
  run: |
  pip install -r requirements.txt
  python manage.py check
```

5. Azure Web App 배포

```
- uses: azure/webapps-deploy@v3
  with:
  app-name: ${{ env.AZURE_WEBAPP_NAME }}
  package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
```

### Azure App Service 설정

- 런타임: Python 3.13

- Startup Command:

```
cd backend && gunicorn --bind 0.0.0.0:$PORT config.wsgi:application
```

## 6️⃣ Frontend Job (React → Vercel)

### 단계 구성

1. 의존 설정

```
needs: backend
environment: production
```

2. Vercel Hook 시크릿 확인

```
- name: Ensure deploy hook secret exists
  run: |
  if [ -z "$VERCEL_DEPLOY_HOOK" ]; then
  echo "VERCEL_DEPLOY_HOOK secret is missing." >&2
  exit 1
  fi
```

3. Vercel 재배포 트리거

```
- name: Trigger Vercel redeploy
  run: curl -s -X POST "$VERCEL_DEPLOY_HOOK"
```

### 해결한 주요 이슈

- VERCEL_DEPLOY_HOOK secret is missing 오류 발생

→ 원인: environment: production 누락

→ 해결: job-level 환경 추가로 정상 동작 확인.

## 7️⃣ Troubleshooting 기록

| 문제                      | 원인                       | 해결                           |
| ------------------------- | -------------------------- | ------------------------------ |
| `azure/login` 실패        | client-id / tenant-id 누락 | OIDC Secrets 정확히 등록       |
| `--scope` 오류            | PowerShell 줄바꿈 미인식   | 한 줄 입력 + 따옴표로 감싸기   |
| `VERCEL_DEPLOY_HOOK` 누락 | environment 미지정         | `environment: production` 추가 |

## 8️⃣ 현재 배포 흐름 요약

1. main 브랜치에 커밋 푸시

2. GitHub Actions 실행

3. Backend job: Django → Azure App Service 자동 배포

4. Frontend job: React → Vercel Hook 호출로 자동 빌드

5. 전체 워크플로 성공 시, 최신 코드가 프로덕션 환경에 반영됨

9️⃣ 향후 개선 방향

- develop 브랜치용 개발 워크플로 추가

- 자동 테스트 및 린트 단계 도입

- Slack/Webhook 배포 알림 연동

✅ 작성자 메모

이 문서는 2025년 11월 기준 실제 배포 환경 구성을 기준으로 작성되었습니다.
현재 프로덕션 파이프라인은 OIDC 인증 + Vercel Hook + GitHub Actions 조합으로 완전히 동작 중입니다.

---

이 버전은

- **실제 작업 흐름**에만 집중
- **명령·코드·시크릿·오류 해결까지 기록**
- 나중에 다른 개발자가 워크플로를 재현할 수 있을 정도로 구체
