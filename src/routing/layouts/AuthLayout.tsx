import {NavLink, type NavLinkRenderProps, Outlet} from "react-router";
import s from './Layout.module.css'
import {useMeQuery} from "@/features-layer/auth-slice/model/useMeQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {storage} from "@/shared-layer/libs-segment/storage.ts";

export const AuthLayout = () => {

  const renderClassName = ({ isActive }: NavLinkRenderProps) =>
    isActive ? s.active : ""

  const {data, isLoading, isError, error} = useMeQuery()
  const queryClient = useQueryClient();

  const handleLogout = () => {
    storage.removeBasicCredentials()
    queryClient.resetQueries({
      queryKey: ['auth']
    })
  }

  return (
    <div>
      <h3>Добро пожаловать!</h3>
      <nav>
        {!data && !isLoading && (
          <NavLink to={"/auth/login"} className={renderClassName}>Login</NavLink>
        )}
        {isError && (
          <NavLink to={"/auth/register"} className={renderClassName}>Register</NavLink>
        )}
      </nav>
      {error && <span>{JSON.stringify(error)}</span>}
      {data && <NavLink to={"/profile/" + data.userId} className={renderClassName}>{data.login}</NavLink>}
      {data && <button onClick={handleLogout}>Logout</button>}
      <Outlet />
    </div>
  );
};