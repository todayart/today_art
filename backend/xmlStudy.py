from xml.etree.ElementTree import parse

# xml.etree.ElementTree는 XML 문서를 파싱(parsing)하고 검색할 때 사용하는 모듈이다.
# XML 문서를 만들 때도 사용

tree = parse("note.xml")
note = tree.getroot()
print(note)
# 결과값 <Element 'note' at 0x000002790162DBC0>

print(note.get("date", "19991231")) # date 속성값을 가져옴
# 20120104
print(note.keys()) # 속성값을 가져옴
# ['date']
print(note.items())
# [('date', '20120104')]

# ! 하위 엘리먼트를 가져오기
from_tag = note.find("from")
from_tags = note.findall("from")
from_text = note.findtext("from")

childs = note.iter()
from_childs = note.iter("from")