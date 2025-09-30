import {Outlet} from "react-router";

export const CommonLayout = () => {
  return (
    <div>
      <header>Layout from CommonLayout</header>
        <Outlet/>
      <footer>footer CommonLayout</footer>
    </div>
  );
};