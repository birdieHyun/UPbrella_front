import { loginState, redirectUrl } from "@/recoil";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const PrivateRoutes: React.FC = () => {
  const authState = useRecoilValue(loginState);
  const { pathname, search } = useLocation();
  const path = pathname + search;

  const setRedirectUrl = useSetRecoilState(redirectUrl);

  useEffect(() => {
    setRedirectUrl(path);
  }, [path, setRedirectUrl]);

  return authState ? (
    <div className="min-h-[100vh] pb-20 flex flex-col">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
