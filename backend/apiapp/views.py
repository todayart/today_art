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
    
    # 0) 파라미터
    term  = (request.GET.get("term") or "").strip().lower()
    start = request.GET.get("startDate")
    end   = request.GET.get("endDate")
    sort  = request.GET.get("sort")         # 예: "BEGIN_DE" or "-BEGIN_DE" or "TITLE"
    cate  = (request.GET.get("cate") or "").strip().lower()
    active = (request.GET.get("active") or "true").strip().lower()
    p_index = int(request.GET.get("pIndex", 1))   # 1-base
    p_size  = int(request.GET.get("pSize", 8))    # 기본 8

    # 1) 검색
    if term:
        qs = [e for e in qs if term in e.get("TITLE", "").lower()]

    # 2) 운영중 필터
    if active in ("true", "1"):
        today = date.today().strftime("%Y-%m-%d")
        qs = [e for e in qs if e.get("BEGIN_DE", "") <= today <= e.get("END_DE", "")]

    # 3) 기간 필터
    if start:
        qs = [e for e in qs if e.get("BEGIN_DE","") >= start]
    if end:
        qs = [e for e in qs if e.get("END_DE","") <= end]
    if start and end:
        qs = [e for e in qs if start >= e.get("BEGIN_DE","") and e.get("END_DE","") <= end]

    # 4) 카테고리
    if cate:
        qs = [e for e in qs if cate in e.get("CATEGORY_NM", "").lower()]

    # 5) 정렬(반드시 결정적이여야 오류가 없음)
    if sort:
        reverse = sort.startswith("-")
        key = sort.lstrip("-").upper()
        from datetime import datetime
        def sort_key(e):
            v = e.get(key, "")
            if isinstance(v, str) and len(v) == 10:
                try:
                    return datetime.strptime(v, "%Y-%m-%d")
                except ValueError:
                    pass
            return v
        qs.sort(key=sort_key, reverse=reverse)
    else:
        # 기본 정렬(예: 시작일 내림차순)
        qs.sort(key=lambda e: e.get("BEGIN_DE",""), reverse=True)

    # 6) 페이징
    total = len(qs)
    start_idx = max((p_index - 1) * p_size, 0)
    end_idx   = start_idx + p_size
    page_items = qs[start_idx:end_idx]

    has_more = end_idx < total
    next_page = p_index + 1 if has_more else None

    return JsonResponse({
        "results": page_items,
        "total": total,
        "page": p_index,
        "pageSize": p_size,
        "hasMore": has_more,
        "nextPage": next_page
    }, safe=False, json_dumps_params={"ensure_ascii": False})

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
