from datetime import date, timedelta
from unittest.mock import Mock, patch

from django.core.cache import cache
from django.test import SimpleTestCase

from .views import CACHE_KEY, _normalize_date, _normalize_entry


def _compact(d):
    """공공 API가 내려주는 'YYYYMMDD' 형식"""
    return d.strftime("%Y%m%d")


class NormalizeDateTests(SimpleTestCase):
    def test_compact_format_becomes_dashed(self):
        self.assertEqual(_normalize_date("20251220"), "2025-12-20")

    def test_dashed_format_is_kept(self):
        self.assertEqual(_normalize_date("2025-12-20"), "2025-12-20")

    def test_other_separators(self):
        self.assertEqual(_normalize_date("2025.12.20"), "2025-12-20")
        self.assertEqual(_normalize_date("2025/12/20"), "2025-12-20")

    def test_unparseable_values_are_returned_as_is(self):
        self.assertEqual(_normalize_date(""), "")
        self.assertEqual(_normalize_date("상시"), "상시")
        self.assertEqual(_normalize_date("20251340"), "20251340")
        self.assertIsNone(_normalize_date(None))

    def test_entry_is_copied_not_mutated(self):
        row = {"TITLE": "a", "BEGIN_DE": "20250101", "END_DE": "20250131"}
        entry = _normalize_entry(row)
        self.assertEqual(entry["BEGIN_DE"], "2025-01-01")
        self.assertEqual(entry["END_DE"], "2025-01-31")
        self.assertEqual(row["BEGIN_DE"], "20250101")


class EntriesApiWithCompactDatesTests(SimpleTestCase):
    """외부 API가 'YYYYMMDD'로 응답해도 진행 중 필터와 달력이 동작해야 한다."""

    def setUp(self):
        cache.delete(CACHE_KEY)
        today = date.today()
        self.rows = [
            {
                "TITLE": "진행중",
                "CATEGORY_NM": "전시",
                "BEGIN_DE": _compact(today - timedelta(days=3)),
                "END_DE": _compact(today + timedelta(days=3)),
            },
            {
                "TITLE": "종료됨",
                "CATEGORY_NM": "전시",
                "BEGIN_DE": _compact(today - timedelta(days=300)),
                "END_DE": _compact(today - timedelta(days=200)),
            },
            {
                "TITLE": "예정",
                "CATEGORY_NM": "공연",
                "BEGIN_DE": _compact(today + timedelta(days=10)),
                "END_DE": _compact(today + timedelta(days=20)),
            },
        ]
        response = Mock()
        response.json.return_value = {
            "GGCULTUREVENTSTUS": [{"head": []}, {"row": self.rows}]
        }
        response.raise_for_status.return_value = None
        patcher = patch("apiapp.views.requests.get", return_value=response)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.addCleanup(cache.delete, CACHE_KEY)

    def test_active_filter_returns_only_ongoing(self):
        data = self.client.get("/api/entries/").json()
        self.assertEqual([e["TITLE"] for e in data["results"]], ["진행중"])
        self.assertRegex(data["results"][0]["BEGIN_DE"], r"^\d{4}-\d{2}-\d{2}$")

    def test_active_false_returns_all(self):
        data = self.client.get("/api/entries/", {"active": "false"}).json()
        self.assertEqual(data["total"], 3)

    def test_category_filter_on_ongoing(self):
        data = self.client.get("/api/entries/", {"cate": "전시"}).json()
        self.assertEqual(data["total"], 1)

    def test_calendar_groups_by_month(self):
        data = self.client.get("/api/calendar/").json()
        titles = [t for names in data.values() for t in names]
        self.assertEqual(len(titles), 6)  # 3개 항목 × (시작, 종료)
        self.assertTrue(all(k.endswith(("m-start", "m-end")) for k in data))
