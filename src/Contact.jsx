export default function Contact() {
    return (
      <section className="min-h-screen px-6 py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Your Name</label>
              <input type="text" className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input type="email" className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea rows="4" className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
              Send Message
            </button>
          </form>
        </div>
      </section>
    );
  }
  