import {Route, Routes} from "react-router";
import {AuthLayout} from "@/routing/layouts/AuthLayout.tsx";
import {CommonLayout} from "@/routing/layouts/CommonLayout.tsx";
import {PageNotFound} from "@/pages-layer/pageNotFound/PageNotFound.tsx";
import {LoginPage} from "@/pages-layer/loginPage/LoginPage.tsx";
import {RegisterPage} from "@/pages-layer/registerPage/RegisterPage.tsx";
import {ProfilePage} from "@/pages-layer/profilePage/ProfilePage.tsx";
import {
  TrackDetailPage
} from "@/pages-layer/trackDetailPage/TrackDetailPage.tsx";
import {TracksListPage} from "@/pages-layer/tracksListPage/TracksListPage.tsx";

export const PATH = {
  MAIN: "/",
  AUTH: 'auth',
  LOGIN: "login",
  REGISTER: "register",
  TRACK_DETAIL: "tracks/:trackId",
  PROFILE: "profile/:userId",
  NOTFOUND: '*',
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path={PATH.MAIN} element={<TracksListPage/>}/>
        <Route path={PATH.TRACK_DETAIL} element={<TrackDetailPage/>}/>
        <Route path={PATH.PROFILE} element={<ProfilePage/>}/>
      </Route>

      <Route path={PATH.AUTH} element={<AuthLayout/>}>
        {/*<Route path={PATH.AUTH}>*/}
        <Route path={PATH.LOGIN} element={<LoginPage />} />
        {/*<Route index element={<Login />} />*/}
        <Route path={PATH.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route path={PATH.NOTFOUND} element={<PageNotFound />} />
    </Routes>
  );
};