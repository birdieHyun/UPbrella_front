import React, { useEffect } from "react";
import webMarker from "@/assets/web-marker.svg"; // SVG 파일을 import

const NaverMap = () => {
  useEffect(() => {
    const initMap = () => {
      const map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.56085742773332, 126.93548935431897),
        zoom: 17,
      });

      const markerPosition = new naver.maps.LatLng(37.56085742773332, 126.93548935431897);

      const marker = new naver.maps.Marker({
        position: markerPosition,
        map: map,
        icon: {
          content: `<img alt="webMarker" src="${webMarker}" />`,
        },
      });

      // 마커 아래에 라벨을 표시할 DOM 요소 생성
      const labelDiv = document.createElement("div");
      labelDiv.innerHTML = "연세대학교 신촌캠퍼스 공학원"; // 라벨 텍스트 설정
      labelDiv.style.color = "#333333"; // 글자 색상 설정
      labelDiv.style.fontSize = "14px";
      labelDiv.style.fontWeight = "600";

      // 라벨의 크기를 구한 뒤 중심점을 계산하여 anchor 값으로 설정
      const labelSize = new naver.maps.Size(labelDiv.offsetWidth, labelDiv.offsetHeight);
      const labelMarker = new naver.maps.Marker({
        position: markerPosition,
        map: map,
        icon: {
          content: labelDiv,
          anchor: new naver.maps.Point(labelSize.width + 50, labelSize.height - 42), // 라벨의 중심점을 마커의 위치에 맞게 조정
        },
      });
    };

    // 네이버 지도 API 로드 후 initMap 함수 호출
    const script = document.createElement("script");
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=o6zrrodz08";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      initMap();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const mapStyle = {
    width: "896px",
    height: "896px",
    borderRadius: "20px",
  };

  return (
    <>
      {/* tailwind test */}
      <div className="flex">
        <header className="text-xl font-bold">지도 페이지</header>
        <div id="map" style={mapStyle}></div>
      </div>
    </>
  );
};

export default NaverMap;
