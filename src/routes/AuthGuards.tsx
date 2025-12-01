import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

type Props = { children: ReactNode };

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export const AuthRoute = ({ children }: Props) => {
  const { user } = useAppContext();
  if (user) {
    return <Navigate to="/freelancer/dashboard" replace />;
  }
  return <>{children}</>;
};