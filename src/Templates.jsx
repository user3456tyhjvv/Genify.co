export default function Templates() {
    return (
      <section className="min-h-screen px-6 py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">Choose a Template</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["YouTube", "Instagram", "Podcast", "Business", "Sticker", "Wall Sign"].map((name) => (
            <div key={name} className="p-6 border dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2">{name} Template</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Customize your {name.toLowerCase()} branding here.</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Customize
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }
  