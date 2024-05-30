# 실행 커맨드

---

# virutal venv 환경 설정

## 1. 설치

pip install virtualenv

## 2. 가상환경 생성

```
#가상환경 생성
virtualenv {가상환경 디렉토리 이름}

# 가상환경 활성화
.\venv\Scripts\activate

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
