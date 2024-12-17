import React from 'react';

const Hero: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-black py-16 text-white w-full h-full">
      <div className="container mx-auto px-4 flex flex-col items-center h-full">
        <h1 className="text-4xl font-bold mb-8">Weekend Plans</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="activities" className="block text-sm font-medium mb-2">Activities</label>
            <textarea
              id="activities"
              name="activities"
              rows={4}
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <i className='bx bx-calendar-check mr-2'></i>
            Submit Plans
          </button>
        </form>
      </div>
    </div>
  );
};

export { Hero as component }