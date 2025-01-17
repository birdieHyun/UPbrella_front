import webMarker from "@/assets/webMarker.svg";
import webMarker_inactive from "@/assets/webMarker_inactive.svg";
import Map from "../admin/store/UI/Map";
import { useEffect, useRef, useState } from "react";
import MapBtn from "@/components/molecules/MapBtn";
import "@/styles/markerLabel.css";
import {
  useGetClassifications,
  useGetClassificationsStore,
  useGetStoreDetail,
} from "@/hooks/queries/storeQueries";
import BottomSheet from "@/components/atoms/BottomSheet";
import MobileCard from "@/components/molecules/MobileCard";
import Card from "@/components/organisms/Card";
import { getUserPosition, getDistanceFromLatLonInKm } from "@/utils/locationUtils";
import { TClassification } from "@/types/admin/StoreTypes";
import ClassificationsButtons from "@/components/pages/RentalLocation/ClassificationsButtons";
import { CircularProgress } from "@mui/material";

// 대여소 위치 페이지
const RentalLocationPage = () => {
  const { naver } = window;
  const mapElement = useRef<HTMLDivElement | null>(null);
  // Ref를 사용하여 맵의 너비 동적으로 가져오기
  const mapWidth = mapElement.current?.offsetWidth ?? null;

  // client
  // 선택 대분류
  const [selectedClassification, setSelectedClassification] = useState<TClassification>();
  // 선택 지점
  const [selectedStoreId, setSelectedStoreId] = useState<number>();
  const [map, setMap] = useState<naver.maps.Map>();
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [showInitialCard, setShowInitialCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // server
  const { data: classificationsRes } = useGetClassifications();
  const { data: storeDetail } = useGetStoreDetail(selectedStoreId ?? 0);
  const { data: storeListRes, isFetching } = useGetClassificationsStore(
    selectedClassification?.id ?? 0
  );

  // 대분류 초깃값 설정
  useEffect(() => {
    if (classificationsRes && !!classificationsRes.length) {
      setSelectedClassification(classificationsRes[0]);
    }
  }, [classificationsRes]);

  // map 처음 한번 생성
  useEffect(() => {
    if (!mapElement.current || !naver || map) return;
    if (!selectedClassification) return;
    const { latitude, longitude } = selectedClassification;
    if (!latitude || !longitude) return;

    const _location = new naver.maps.LatLng(latitude, longitude);
    const mapOptions: naver.maps.MapOptions = {
      center: _location,
      zoom: 15,
    };

    const _map = new naver.maps.Map(mapElement.current, mapOptions);
    setMap(_map);
  }, [classificationsRes, map, naver, selectedClassification]);

  // 대분류 변경시 지도 position 움직임
  useEffect(() => {
    if (map && selectedClassification) {
      const { latitude, longitude } = selectedClassification;
      if (!latitude || !longitude) return;

      const _location = new naver.maps.LatLng(latitude, longitude);
      map.setCenter(_location);
    }
  }, [map, naver.maps.LatLng, selectedClassification]);

  // 마커 생성
  useEffect(() => {
    if (!storeListRes) return;

    // 기존 마커 삭제
    markers.map((e) => e.setMap(null));

    // 새로 생성 후 setState (여기에서 선택한 지점과 비교 후 아이콘 변경)
    const _markers = storeListRes.map(
      ({ id, latitude, longitude, name, rentableUmbrellasCount, openStatus }) => {
        const isSelected = id === selectedStoreId;
        const iconContent = isSelected
          ? `<div class="marker-wrapper-focus"><img class="marker-focus" alt="webMarkerFocus" src="${
              openStatus ? webMarker : webMarker_inactive
            }" /><div class="umbrella-count-focus">${rentableUmbrellasCount}</div><div class="custom-label-focus">${name}</div></div>`
          : `<div class="marker-wrapper"><img class="marker" alt="webMarker" src="${
              openStatus ? webMarker : webMarker_inactive
            }" /><div class="umbrella-count">${rentableUmbrellasCount}</div><div class="custom-label">${name}</div></div>`;

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(latitude, longitude),
          map: map,
          icon: {
            content: iconContent,
            size: new naver.maps.Size(32, 40),
            anchor: new naver.maps.Point(12, 35),
          },
        });

        naver.maps.Event.addListener(marker, "click", () => {
          setSelectedStoreId(id);
          setIsBottomOpen(true);
        });
        return marker;
      }
    );

    setMarkers(_markers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map,
    naver.maps.Event,
    naver.maps.LatLng,
    naver.maps.Marker,
    naver.maps.Point,
    naver.maps.Size,
    selectedStoreId,
    storeListRes,
  ]);

  useEffect(() => {
    if (storeListRes && storeListRes.length > 0 && showInitialCard) {
      const randomIndex = Math.floor(Math.random() * storeListRes.length);
      const randomStore = storeListRes[randomIndex].id;
      setSelectedStoreId(randomStore);
      setShowInitialCard(false);
    }
  }, [storeListRes, showInitialCard]);

  useEffect(() => {
    if (userPosition && storeListRes && storeListRes.length > 0) {
      const distances = storeListRes.map((store) =>
        getDistanceFromLatLonInKm(
          userPosition.lat,
          userPosition.lng,
          store.latitude,
          store.longitude
        )
      );

      const minDistanceIndex = distances.indexOf(Math.min(...distances));

      if (!showInitialCard) {
        setSelectedStoreId(storeListRes[minDistanceIndex].id);
      }
    }
  }, [userPosition, storeListRes, showInitialCard]);

  useEffect(() => {
    getUserPosition().then(
      (position) =>
        position &&
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude })
    );
  }, []);

  useEffect(() => {
    if (storeListRes && storeListRes.length > 0) {
      let selectedStore;

      if (userPosition) {
        const distances = storeListRes.map((store) =>
          getDistanceFromLatLonInKm(
            userPosition.lat,
            userPosition.lng,
            store.latitude,
            store.longitude
          )
        );

        const minDistanceIndex = distances.indexOf(Math.min(...distances));

        selectedStore = storeListRes[minDistanceIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * storeListRes.length);
        selectedStore = storeListRes[randomIndex];
      }

      setSelectedStoreId(selectedStore.id);
    }
  }, [storeListRes, userPosition]);

  return (
    <div className="flex flex-col flex-1 pb-20">
      <div className="flex justify-center gap-[24px] flex-1">
        <div className="min-w-[400px] max-w-[400px] hidden xl:block">
          {storeDetail && <Card storeDetail={storeDetail} />}
        </div>

        <div className="relative flex justify-center flex-1 rounded-20 max-w-640 xl:max-w-full">
          {(isFetching || isLoading) && (
            <div className="absolute w-full h-full z-[101] bg-gray-50 bg-opacity-40 flex justify-center items-center">
              <CircularProgress
                size={70}
                sx={{
                  color: "#E86F52",
                }}
              />
            </div>
          )}

          <Map ref={mapElement} width="100%" height="100%" borderRadius="20px" />
          <div className="absolute top-0 left-0 w-full p-24 z-9 pr-60">
            {classificationsRes && (
              <ClassificationsButtons
                classificationsRes={classificationsRes}
                selectedClassification={selectedClassification}
                setSelectedClassification={setSelectedClassification}
              />
            )}
          </div>
          <div className="absolute top-0 z-10 right-7 pt-86">
            <MapBtn map={map} setIsLoading={setIsLoading} />
          </div>
          {isBottomOpen && mapWidth && storeDetail && (
            <BottomSheet
              isBottomSheetOpen={isBottomOpen}
              setIsBottomSheetOpen={setIsBottomOpen}
              snapPoints={[295, 295, 0]}
              _className="hidden lg:block"
            >
              <MobileCard storeDetail={storeDetail} />
            </BottomSheet>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalLocationPage;
