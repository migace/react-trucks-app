import { useEffect, useState } from "react";
import { TrucksList } from "./components/TrucksList";
import { AddTruck } from "./components/AddTruck";
import { Truck } from "./types/truck";

const API_URL = "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com";

function App() {
  const [trucks, setTrucks] = useState<Truck[]>([]);

  const onDeleteTruckClickHandler = (truckId: string) => {
    fetch(`${API_URL}/trucks/${truckId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        setTrucks((prevTrucks) =>
          prevTrucks.filter((truck) => truck.id !== truckId)
        );
      }
    });
  };

  const onSubmitClickHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget.elements as typeof event.currentTarget.elements & {
      name: HTMLInputElement;
      code: HTMLInputElement;
      status: HTMLSelectElement;
      description: HTMLTextAreaElement;
    };

    const name = form.name.value;
    const code = form.code.value;
    const status = form.status.value;
    const description = form.description.value;

    fetch(`${API_URL}/trucks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, code, status, description }),
    })
      .then((res) => res.json())
      .then((data: Truck) => {
        if (data.id) {
          setTrucks((prevTrucks) => [...prevTrucks, data]);
        }
      });
  };

  useEffect(() => {
    fetch(`${API_URL}/trucks`)
      .then((res) => res.json())
      .then((data: Truck[]) => setTrucks(data));
  }, []);

  return (
    <>
      <h1>Trucks App</h1>
      <AddTruck onSubmit={onSubmitClickHandler} />
      <TrucksList trucks={trucks} onDelete={onDeleteTruckClickHandler} />
    </>
  );
}

export default App;
