"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Store tokens securely in production
    const userType = localStorage.getItem("user_type"); // Expected: "AGENT" or "CLIENT"

    if (!token || !allowedRoles.includes(userType)) {
      router.push("/signin"); // Redirect unauthorized users
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!isAuthorized) return null; // Prevent rendering before checking auth
  return children;
};

export default ProtectedRoute;
