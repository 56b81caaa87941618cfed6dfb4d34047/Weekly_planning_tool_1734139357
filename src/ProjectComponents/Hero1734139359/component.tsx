import React from 'react';

const Hero: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-green-500 py-16 text-white w-full h-full">
      <div className="container mx-auto px-4 flex flex-col items-center h-full">
        <h1 className="text-4xl font-bold mb-8">Weekend Plans</h1>
        <div 
          className="w-full max-w-md bg-cover bg-center rounded-lg shadow-md"
          style={{ backgroundImage: `url('https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Weekly_planning_tool_1734139357/${window.MI_PROJECT_GIT_REF || 'main'}/src/assets/images/Screenshot%202024-11-11%20at%208.35.52%E2%80%AFAM.jpeg')` }}
        >
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-black bg-opacity-70 p-6 rounded-lg">
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
    </div>
  );
};

export { Hero as component }