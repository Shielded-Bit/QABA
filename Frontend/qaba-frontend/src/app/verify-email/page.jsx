"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmailFailedModal from "../components/modal/EmailFailedModal";
import EmailSuccessModal from "../components/modal/EmailSuccessModal";
import axios from "axios";

const VerifyEmail = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = String(params.get("token"));

  console.log("Token:", token); // Log the token

  useEffect(() => {

    // console.log("Verifying emails")

    const verifyEmail = async () => {
      if (token) {
        try {
          const response = await axios.get(`https://qaba.onrender.com/api/v1/auth/verify-email/?token=${token}`);
          console.log("Verify Email Response:", response); // Log the response

          if (response.status === 200) {
            setShowSuccessModal(true);
          } else {
            setShowFailedModal(true);
          }
        } catch (error) {
          console.error("Verification Error:", error); // Log the error
          setShowFailedModal(true);
        }
      }
    }

    verifyEmail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default VerifyEmail;
