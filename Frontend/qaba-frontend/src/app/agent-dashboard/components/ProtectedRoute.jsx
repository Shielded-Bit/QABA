"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");

    if (!token || !allowedRoles.includes(userType)) {
      router.push("/signin");
    } else {
      setAuthorized(true);
    }
  }, [allowedRoles, router]); // ✅ Added dependencies

  if (!isAuthorized) return null;
  return children;
};

export default ProtectedRoute;
