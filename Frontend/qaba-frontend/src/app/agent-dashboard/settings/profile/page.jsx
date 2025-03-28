"use client"; // Ensure this is at the top

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null); // Holds the image URL for preview
  const [selectedImage, setSelectedImage] = useState(null);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    if (typeof window !== "undefined") {
      fetch("/api/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
    }
  };

  const uploadImage = () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("profileImage", selectedImage);

    fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Image Upload Success:", result);
        setSelectedImage(null);
      })
      .catch((error) => {
        console.error("Image Upload Error:", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Image Section */}
      <div className="mb-8 ">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-gray-500 text-sm flex items-center justify-center h-full">
                No Image
              </p>
            )}
          </div>
          <label
            htmlFor="uploadProfileImage"
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-600"
          >
            <FaCamera />
          </label>
          <input
            type="file"
            id="uploadProfileImage"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        {selectedImage && (
          <button
            onClick={uploadImage}
            className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
          >
            Upload Image
          </button>
        )}
      </div>

      {/* General Settings Section */}
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName", { required: "First Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName", { required: "Last Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              {...register("phone", { required: "Phone is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="ml-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-4 py-2 rounded-md transition-all duration-300 hover:from-[#3ab7b1] hover:to-[#014d98]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
