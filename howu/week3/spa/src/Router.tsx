import { useMemo, Children, cloneElement } from "react";
import type { FC, ReactElement } from "react";
import type { RoutesProps } from "./types";
import { useCurrentPath } from "./hooks/useCurrentPath";

const isRouteElement = (element: any): boolean => {
  return element?.type?.name === "Route";
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route: any) => route.props.path === currentPath) as ReactElement | undefined;
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};
