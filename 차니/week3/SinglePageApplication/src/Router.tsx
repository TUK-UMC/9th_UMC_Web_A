import {
  Children,
  cloneElement,
  isValidElement,
  type FC,
  type ReactElement,
  type ReactNode,
} from "react";
import { useMemo } from "react";
import { useCurrentPath } from "./hooks/useCurrentPath";

type PathProps = { path: string };

function isRouteElement(element: unknown): element is ReactElement<PathProps> {
  if (!isValidElement(element)) return false;
  const props: unknown = element.props;
  return typeof (props as { path?: unknown }).path === "string";
}

export type RoutesProps = {
  children: ReactNode;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath) ?? null;
  }, [children, currentPath]);

  if (!activeRoute) return null;

  return cloneElement(activeRoute);
};
