import { useForm } from 'react-hook-form';

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Submit data to the backend using fetch
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
  };

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email address';
    return true;
  };

  const validatePhone = (value) => {
    if (!value) return 'Phone is required';
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(value)) return 'Invalid phone number';
    return true;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const response = await fetch('/api/upload-profile-image', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        console.log('Image Upload Response:', result);
        // Update the profile image in the state or context
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await fetch('/api/delete-profile-image', {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log('Image Delete Response:', result);
      // Update the profile image in the state or context
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>

      {/* Profile Picture Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <div className="mt-2 flex items-center">
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="profileImage"
              className="bg-blue-600 text-white px-2 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Upload
            </label>
            <button
              onClick={handleImageDelete}
              className="ml-2 bg-red-600 text-white px-2 py-2 text-sm rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* General Settings Form */}
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
              {...register('email', { validate: validateEmail })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              {...register('phone', { validate: validatePhone })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Personal Address Section */}
        <h2 className="text-xl font-bold mt-8 mb-4">Personal Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register('country', { required: 'Country is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register('state', { required: 'State is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
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