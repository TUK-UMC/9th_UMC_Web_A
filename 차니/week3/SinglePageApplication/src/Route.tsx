import type { RouteProps } from "./types/props.types";

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};
