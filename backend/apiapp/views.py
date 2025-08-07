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
    
    return의 형태는 배열 객체입니다.
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
    GET /api/entries/?term=...&startDate=...&endDate=...&sort=...&active=...
    
    1) _load_all_entries로 전체 리스트 확보
    2) 쿼리 파라미터(term, startDate, endDate, sort, active) 읽어옴
    3) term: title에 포함된 항목으로 필터
    4) startDate/endDate: 날짜 비교로 필터
    5) active=true: 오늘을 기준으로 현재 운영 중인 데이터만 필터 (BEGIN_DE <= today <= END_DE)
    6) sort: 'begin' 또는 '-begin' 형태로 오름/내림차순 정렬
    7) {[...filtered & sorted...] } 형태로 JSON 응답
    """
    qs = _load_all_entries()
    
    # 쿼리 파라미터 읽기
    limit = request.GET.get("limit", 50)
    term  = request.GET.get("term", "").strip().lower()
    start = request.GET.get("startDate")
    end   = request.GET.get("endDate")
    sort  = request.GET.get("sort")  # ex) "begin" or "-begin"
    cate  = request.GET.get("cate", "").strip().lower()
    active = request.GET.get("active", "").strip().lower()  # ex) "true" or "false"
    
    # 1) 검색(term)
    if term:
        qs = [e for e in qs if term in e["TITLE"].lower()]
        
    # 2) 운영중(active) : 오늘 날짜를 기준으로 운영 중인 항목 (BEGIN_DE <= today <= END_DE)
    if active in ("true", "1"):
        today = date.today().strftime("%Y-%m-%d")
        qs = [e for e in qs if e.get("BEGIN_DE", "") <= today <= e.get("END_DE", "")]  

    # 3) 기간 필터
    # * 날짜 방식은 type이 string으로 되어있음
    # * YYYY-MM-dd 형태로 되어있음
    
    if start:
        qs = [e for e in qs if e["BEGIN_DE"] >= start]
    
    if end: 
        qs = [e for e in qs if e["END_DE"] <= end]

    if start and end:
        qs = [e for e in qs if start >= e["BEGIN_DE"] and e["END_DE"] <= end]

    # 4) 카테고리 필터
    # 공연, 행사, 교육, 전시
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
        # 정렬 옵션이 설정된 경우
        # 사용 예시:
        # sort="begin"    => 'begin' 키를 기준으로 오름차순 정렬 (예: BEGIN_DE 필드의 날짜가 빠른 순서)
        # sort="-begin"   => 'begin' 키를 기준으로 내림차순 정렬 (예: BEGIN_DE 필드의 날짜가 느린 순서)
        # sort="TITLE"    => 'TITLE' 키를 기준으로 오름차순 정렬 (예: 제목 알파벳 순)
        
        reverse = sort.startswith("-")  # 정렬 기준이 '-'로 시작하면 내림차순 정렬
        key = sort.lstrip("-")  # '-' 문자를 제거하여 정렬에 사용할 키를 결정

        def sort_key(e):
            # 각 항목에서 지정한 키에 해당하는 값을 가져옴. 없으면 빈 문자열 반환
            # 변환: 쿼리 파라미터가 소문자인 경우 대문자로 변환하여 조회합니다.
            value = e.get(key.upper(), "")
            # 값이 문자열이고 길이가 10이면 날짜 형식일 가능성이 있으므로 시도
            if isinstance(value, str) and len(value) == 10:
                try:
                    # 날짜 형식("YYYY-MM-DD")이면 datetime 객체로 변환하여 반환
                    return datetime.strptime(value, "%Y-%m-%d")
                except ValueError:
                    # 날짜 형식이 아니면 예외 발생하므로 그냥 넘어감
                    pass
            # 위 조건에 해당하지 않으면 원래 값을 그대로 반환
            return value

        # 리스트 qs를 sort_key 함수를 기준으로 정렬하며, 정렬 순서는 reverse 값에 따라 결정됨
        qs.sort(key=sort_key, reverse=reverse)
        
    # 5) limit 적용
    if limit:
        limit = int(limit)
        qs = qs[:limit]

    # 응답
    # * 리스트 형태로 보내기 위해 safe=False 설정
    # * ensure_ascii=False로 설정하여 한글이 깨지지 않도록 함
    return JsonResponse(qs, safe=False, json_dumps_params={"ensure_ascii": False})

@require_GET
def calendar_api(request):
    qs = _load_all_entries()  # 리턴은 배열객체
    result = {}
    
    for entry in qs:
        title = entry.get("TITLE", "")
        
        # 처리: 시작일자 (BEGIN_DE)
        begin_str = entry.get("BEGIN_DE", "")
        if begin_str:
            try:
                begin_date = datetime.strptime(begin_str, "%Y-%m-%d")
                key = f"{begin_date.month}m-start"
                if key not in result:
                    result[key] = []
                result[key].append(title)
            except ValueError:
                pass  # 날짜 형식이 아니면 무시
        
        # 처리: 종료일자 (END_DE)
        end_str = entry.get("END_DE", "")
        if end_str:
            try:
                end_date = datetime.strptime(end_str, "%Y-%m-%d")
                key = f"{end_date.month}m-end"
                if key not in result:
                    result[key] = []
                result[key].append(title)
            except ValueError:
                pass  # 날짜 형식이 아니면 무시
                    
    return JsonResponse(result, safe=False, json_dumps_params={"ensure_ascii": False})
