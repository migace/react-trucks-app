import { useEffect, useState } from "react";
import { TrucksList } from "./components/TrucksList";
import { AddTruck } from "./components/AddTruck";
import { Truck } from "./types/truck";

const API_URL = "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com";

function App() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const onDeleteTruckClickHandler = async (truckId: string) => {
    const res = await fetch(`${API_URL}/trucks/${truckId}`, { method: "DELETE" });
    if (res.status === 200) {
      setTrucks((prevTrucks) => prevTrucks.filter((truck) => truck.id !== truckId));
    }
  };

  const onSubmitClickHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget.elements as typeof event.currentTarget.elements & {
      name: HTMLInputElement;
      code: HTMLInputElement;
      status: HTMLSelectElement;
      description: HTMLTextAreaElement;
    };

    const res = await fetch(`${API_URL}/trucks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        code: form.code.value,
        status: form.status.value,
        description: form.description.value,
      }),
    });
    const data: Truck = await res.json();
    if (data.id) {
      setTrucks((prevTrucks) => [...prevTrucks, data]);
    }
  };

  useEffect(() => {
    const loadTrucks = async () => {
      const res = await fetch(`${API_URL}/trucks`);
      const data: Truck[] = await res.json();
      setTrucks(data);
    };
    loadTrucks();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Fleet Manager
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your truck fleet
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                  </svg>
                  Light mode
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark mode
                </>
              )}
            </button>
          </header>

          <div className="space-y-8">
            <AddTruck onSubmit={onSubmitClickHandler} />
            <TrucksList trucks={trucks} onDelete={onDeleteTruckClickHandler} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
