import {NavLink, type NavLinkRenderProps, Outlet} from "react-router";
import s from './Layout.module.css'

export const AuthLayout = () => {

  const renderClassName = ({ isActive }: NavLinkRenderProps) =>
    isActive ? s.active : ""

  return (
    <div>
      <h3>Добро пожаловать!</h3>
      <nav>
        <NavLink to={"/auth/login"} className={renderClassName} >Login</NavLink> |{" "}
        <NavLink to={"/auth/register"} className={renderClassName}>Register</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};