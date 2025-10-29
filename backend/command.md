# 실행 커맨드

- backend 서버 포트 : 8000

```
.\{가상환경 디렉토리 이름}\Scripts\activate
python manage.py runserver
```

---

# virutal venv 환경 설정

## 1. 설치

pip install virtualenv

## 2. 가상환경 생성

```
#가상환경 생성
virtualenv {가상환경 디렉토리 이름}

# 가상환경 활성화
.\dj_vv\Scripts\activate.ps1
.\{가상환경 디렉토리 이름}\Scripts\activate

# 필요한 패키지 설치
pip install -r requirements.txt

# 가상환경 비활성화
deactivate
```

# django 관련 명령어

```
// django 종속성 설치
pip install django
// django 삭제
pip uninstall django
// django 종속성 버전 설치
pip install django==설치하려는 버전
// django 앱 설치
django-admin startproject myproject
cd myproject
python manage.py startapp myapp

```

# DI 관리 커멘드

```
// 핍 얼려꺽 : 의존 정보을 추출하여 저장한다.
pip freeze > requirements.txt
// 설치하는 방법
pip install -r requirements.txt
```

---

## Azure Cli 커맨드

```
# 로그인
az login

# 공급자 등록 커맨드
az provider register --namespace Microsoft.Web

# 리소스 그룹 생성
az group create --name todayart-rg --location koreacentral

# App Service 플랜 생성 (무료 F1 티어)
az appservice plan create --name todayart-plan --resource-group todayart-rg --sku F1 --is-linux

# 웹앱 생성 (Django 실행 환경)
az webapp create --resource-group todayart-rg --plan todayart-plan \
  --name todayart-backend \
  --runtime "PYTHON|3.13"
```

```
# 플랜 정보
az appservice plan show --name <플랜 이름> --resource-group <리소스 그룹 이름>
```
