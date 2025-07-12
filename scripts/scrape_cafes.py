#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import urllib.parse
import json
import time
import os
import warnings
from typing import List, Dict, Any

# ——————————————————————————————————————————————
# 1) 설정
# ——————————————————————————————————————————————

SEARCH_QUERY = "광진구 필터커피"
OUTPUT_PATH  = os.path.join("..", "prisma", "cafes.json")

# → 잘못된 /p/api 가 아니라 “v5/api/search” 로 호출해야 404 에러가 발생하지 않습니다.
API_URL = "https://map.naver.com/v5/api/search"

# urllib3 의 버전 불일치 경고 무시 (필수는 아닙니다)
warnings.filterwarnings("ignore", category=requests.packages.urllib3.exceptions.DependencyWarning)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://map.naver.com"
}


# ——————————————————————————————————————————————
# 2) API 호출 함수
# ——————————————————————————————————————————————
def fetch_places(query: str, page: int = 1, display_count: int = 20) -> List[Dict[str, Any]]:
    """
    네이버 지도 V5 내부 JSON API를 호출해서 장소 리스트를 반환합니다.
    - 반드시 'type=place' 파라미터가 필요합니다.
    """
    params = {
        "caller":       "pcweb",
        "query":        query,
        "type":         "place",      # ← 필수
        "page":         page,         # 페이지 번호
        "displayCount": display_count # 한 페이지당 결과 개수
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()

    data = resp.json()
    # JSON 구조가 바뀔 수 있으니 안전하게 접근
    places = data.get("result", {}) \
                 .get("place", {}) \
                 .get("list", [])
    return places


# ——————————————————————————————————————————————
# 3) 데이터 가공 함수
# ——————————————————————————————————————————————
def normalize_place(p: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id":           p.get("id"),
        "name":         p.get("name"),
        "category":     p.get("category"),
        "telephone":    p.get("telephone") or "정보 없음",
        "roadAddress":  p.get("roadAddress") or "",
        "address":      p.get("address")     or "",
        "x":            p.get("x"),
        "y":            p.get("y"),
        "description":  p.get("description") or "",
        "fetched_at":   time.strftime("%Y-%m-%d %H:%M:%S"),
    }


# ——————————————————————————————————————————————
# 4) 메인 로직
# ——————————————————————————————————————————————
def main():
    print(f"[1] '{SEARCH_QUERY}' 검색 시작...")
    try:
        raw_places = fetch_places(SEARCH_QUERY)
        print(f"[2] {len(raw_places)}개 장소 수신 완료")
    except requests.HTTPError as e:
        print(f"[!] HTTP 에러 발생: {e} → 호출 URL 혹은 파라미터를 확인하세요.")
        return
    except Exception as e:
        print(f"[!] 예기치 못한 오류: {e}")
        return

    cafes = [normalize_place(p) for p in raw_places]

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    result = {
        "search_query": SEARCH_QUERY,
        "search_date":  time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_count":  len(cafes),
        "cafes":        cafes
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[3] 결과를 '{OUTPUT_PATH}'에 저장했습니다.")


if __name__ == "__main__":
    main()