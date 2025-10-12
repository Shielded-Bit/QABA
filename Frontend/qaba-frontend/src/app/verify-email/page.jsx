"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmailFailedModal from "../components/modal/EmailFailedModal";
import EmailSuccessModal from "../components/modal/EmailSuccessModal";
import axios from "axios";

const VerifyEmailContent = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (!token) return; // Ensure token exists before running

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email/?token=${token}`
        );

        if (response.status === 200) {
          setShowSuccessModal(true);
        } else {
          setShowFailedModal(true);
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setShowFailedModal(true);
      }
    };

    verifyEmail();
  }, [token]);

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowFailedModal(false);
    router.push("/");
  };

  return (
    <>
      {showSuccessModal && (
        <EmailSuccessModal
          showModal={showSuccessModal}
          setShowModal={setShowSuccessModal}
          onClose={closeModal}
        />
      )}
      {showFailedModal && (
        <EmailFailedModal
          showModal={showFailedModal}
          setShowModal={setShowFailedModal}
          onClose={closeModal}
        />
      )}
    </>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
