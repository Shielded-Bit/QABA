"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");

    if (!token || !allowedRoles.includes(userType)) {
      router.push("/signin");
    } else {
      setAuthorized(true);
    }
    setIsLoading(false);
  }, [allowedRoles, router]);

  if (isLoading) return null;
  if (!isAuthorized) return null;
  return children;
};

export default ProtectedRoute;
