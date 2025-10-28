import {Outlet} from "react-router";

export const CommonLayout = () => {
  return (
    <div>
      <header>Layout from CommonLayout</header>
      <Outlet />
      <footer>
        <hr />
        footer CommonLayout
      </footer>
    </div>
  );
};