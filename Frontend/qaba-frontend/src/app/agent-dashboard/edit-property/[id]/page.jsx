"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditProperty from "../../components/editProperty";

// This is the main page component for editing properties
export default function EditPropertyPage() {
  const params = useParams();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // You can add additional authorization checks here if needed
    // For example, check if the user has permission to edit this specific property
    
    setAuthorized(true);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!authorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">You don&apos;t have permission to edit this property.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <EditProperty />
    </div>
  );
}