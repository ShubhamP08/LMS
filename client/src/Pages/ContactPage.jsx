import HomeLayout from "../Layouts/HomeLayout";
function ContactPage() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <HomeLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-lg">
            <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Name
            </label>
            <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
            />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
    </HomeLayout>
    
  );
}

export default ContactPage;