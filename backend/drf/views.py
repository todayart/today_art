from django.conf import settings
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import render
import xml.etree.ElementTree as ET


def show_external_data_form(request):
    return render(request, 'external_data_form.html')

@api_view(['GET'])
# jwt 토큰 검증을 하지 않기 위해 @permission_classes([AllowAny]) 데코레이터를 사용
@permission_classes([AllowAny]) 
def external_data(request):
    if request.method == 'GET':
        api_url = "http://www.culture.go.kr/openapi/rest/publicperformancedisplays/area"
        api_key = settings.CULTURE_API_KEY

        # HTML 폼으로부터 cPage와 rows 값을 가져오기
        cPage = request.query_params.get('cPage')  
        rows = request.query_params.get('rows')     

        # API 요청에 사용할 파라미터 설정
        params = {
            "ServiceKey": api_key,
            "cPage": cPage,
            "rows": rows
        }

        response = requests.get(api_url, params=params)
        
        # API 호출 결과 확인
        if response.status_code == 200:
            # XML 데이터 파싱
            root = ET.fromstring(response.content)
            data = []
            for perfor_list in root.findall('.//perforList'):
                event = {}
                for child in perfor_list:
                    event[child.tag] = child.text
                data.append(event)
            
            # JSON 형식으로 변환하여 반환
            return Response(data)
        else:
            # 에러가 발생한 경우 적절한 처리를 수행
            return Response({"error": "Failed to fetch data"}, status=response.status_code)