import { ReactNode, ComponentType } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
}

export interface RouteProps {
  path: string;
  component: ComponentType;
}

export interface RoutesProps {
  children: ReactNode;
}
