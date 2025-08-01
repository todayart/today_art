import requests
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from datetime import date
from datetime import datetime

CACHE_KEY = "entries_all"
def _load_all_entries():
    """
    1) 캐시에서 'entries_all' 키를 찾습니다.
    2) 없으면 외부 공공 API를 호출해 데이터를 가져오고,
       필요한 필드만 뽑아서 리스트로 정리한 뒤 캐시에 1시간 동안 저장합니다.
    3) 최종적으로 파이썬 리스트를 반환합니다.
    """
    entries = cache.get(CACHE_KEY)
    if entries is None:
        print("캐시 미스: 외부 API에서 데이터를 가져오는 중입니다.")
        url = (
            f"https://openapi.gg.go.kr/GGCULTUREVENTSTUS"
            f"?Key={settings.API_KEY}"
            "&Type=json"
            "&pIndex=1"
            "&pSize=200"
        )
        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            raw = data.get("GGCULTUREVENTSTUS", [])
            if isinstance(raw, dict):
                rows = raw.get("row", [])
            elif isinstance(raw, list) and len(raw) > 1:
                rows = raw[1].get("row", [])
            else:
                rows = []
    
            entries = [row for row in rows]
            cache.set(CACHE_KEY, entries, timeout=3600)
            print(f"총 {len(entries)}개의 항목을 가져와 캐시했습니다.")
        except requests.RequestException as e:
            print(f"API 요청 오류: {e}")
            entries = []
    else:
        print("캐시 있음: 캐시된 항목을 사용합니다.")
        # print("캐시 있음: 캐시된 항목을 사용합니다.", entries)
    return entries

@require_GET
def entries_api(request):
    """
    GET /api/entries/?term=...&startDate=...&endDate=...&sort=...
    
    1) _load_all_entries로 전체 리스트 확보
    2) 쿼리 파라미터(term, startDate, endDate, sort) 읽어옴
    3) term: title에 포함된 항목으로 필터
    4) startDate/endDate: 날짜 비교로 필터
    5) sort: 'begin' 또는 '-begin' 형태로 오름/내림차순 정렬
    6) {[...filtered & sorted...] } 형태로 JSON 응답
    """
    qs = _load_all_entries()
    
    # 쿼리 파라미터 읽기
    limit = request.GET.get("limit", 50)
    term  = request.GET.get("term", "").strip().lower()
    start = request.GET.get("startDate")
    end   = request.GET.get("endDate")
    # TODO : 카테고리 기본값 추가
    sort  = request.GET.get("sort")  # ex) "begin" or "-begin"
    cate = request.GET.get("cate", "").strip().lower()

    
    # 1) 검색(term)
    if term:
        qs = [e for e in qs if term in e["TITLE"].lower()]

    # 2) 기간 필터
    # * 날짜 방식은 type이 string으로 되어있음
    # * YYYY-MM-dd 형태로 되어있음
    
    if start:
        qs = [e for e in qs if e["BEGIN_DE"] >= start]
    
    if end: 
        qs = [e for e in qs if e["END_DE"] <= end]

    if start and end:
        qs = [e for e in qs if start >= e["BEGIN_DE"] and e["END_DE"] <= end]

    # 4) 카테고리 필터
    if cate:
        qs = [e for e in qs if cate in e.get("CATEGORY_NM", "").lower()]
        
    # * 우선순위를 위해 나중에 작성
    # 정렬 처리:
    # 1) sort 파라미터가 있다면 정렬을 진행합니다.
    # 2) 파라미터 값에 "-"가 붙어 있으면 내림차순, 그렇지 않으면 오름차순으로 정렬합니다.
    # 3) '-'를 제거한 후 남은 값을 키로 사용하여 정렬하는데,
    #    - 키의 값이 날짜 형식(YYYY-MM-dd) 문자열이면 날짜 객체로 변환하여 날짜 순으로 정렬하고,
    #    - 그렇지 않으면 기본 값(문자열)으로 정렬합니다.
    # TODO : 날짜 형식 정렬 기능 검토
    if sort:
        reverse = sort.startswith("-")
        key = sort.lstrip("-")

        def sort_key(e):
            value = e.get(key, "")
            if isinstance(value, str) and len(value) == 10:
                try:
                    # 날짜 형식이면 날짜 객체로 변환
                    return datetime.strptime(value, "%Y-%m-%d")
                except ValueError:
                    pass
            return value

        qs.sort(key=sort_key, reverse=reverse)
        
    # limit 적용
    if limit:
        limit = int(limit)
        qs = qs[:limit]

    # 응답
    # * 리스트 형태로 보내기 위해 safe=False 설정
    # * ensure_ascii=False로 설정하여 한글이 깨지지 않도록 함
    return JsonResponse(qs, safe=False, json_dumps_params={"ensure_ascii": False})

