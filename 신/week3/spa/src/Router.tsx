import { useMemo, Children, cloneElement, isValidElement } from "react";
import type { FC, ReactElement, ReactNode } from "react";
import type { RoutesProps, RouteProps } from "../types";
import { useCurrentPath } from "../hooks/useCurrentPath";

const isRouteElement = (
  child: ReactNode
): child is ReactElement<RouteProps> => {
  return isValidElement(child);
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};
