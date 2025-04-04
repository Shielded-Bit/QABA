'use client'; // Ensure this is at the top

import { useForm } from 'react-hook-form';

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    if (typeof window !== 'undefined') {
      fetch('/api/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('Success:', result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First Name is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last Name is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              {...register('phone', { required: 'Phone is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
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
