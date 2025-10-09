import {Route, Routes} from "react-router";
import {AuthLayout} from "@/routing/layouts/AuthLayout.tsx";
import {CommonLayout} from "@/routing/layouts/CommonLayout.tsx";
import {MainPage} from "@/MainPage.tsx";
import {TrackDetail} from "@/TrackDetail.tsx";
import {PageNotFound} from "@/components/pageNotFound/PageNotFound.tsx";
import {Login} from "@/features-layer/auth-slice/ui/Login.tsx";
import {Register} from "@/features-layer/auth-slice/ui/Register.tsx";

export const PATH = {
  MAIN: "/",
  AUTH: 'auth',
  LOGIN: "login",
  REGISTER: "register",
  TRACK_DETAIL: "tracks/:trackId",
  NOTFOUND: '*',
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path={PATH.MAIN} element={<MainPage/>}/>
        <Route path={PATH.TRACK_DETAIL} element={<TrackDetail/>}/>
      </Route>

      <Route path={PATH.AUTH} element={<AuthLayout/>}>
        {/*<Route path={PATH.AUTH}>*/}
        <Route path={PATH.LOGIN} element={<Login />} />
        {/*<Route index element={<Login />} />*/}
        <Route path={PATH.REGISTER} element={<Register />} />
      </Route>

      <Route path={PATH.NOTFOUND} element={<PageNotFound />} />
    </Routes>
  );
};