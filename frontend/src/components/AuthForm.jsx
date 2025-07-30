import React, { useState } from 'react';

const AuthForm = ({ onSubmit, submitLabel = 'Submit', initialData = {} }) => {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch (error) {
      console.error('Error while logging in: ', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      alert(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      {form.name !== undefined && (
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="font-semibold mb-1">Name</label>
          <input
            id="name"
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
      )}

      <div className="flex flex-col w-full">
        <label htmlFor="email" className="font-semibold mb-1">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email || ''}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="password" className="font-semibold mb-1">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password || ''}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-teal-600 text-white text-base py-2 px-6 rounded
                   cursor-pointer transition-colors duration-200 hover:bg-teal-700 active:scale-95"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
