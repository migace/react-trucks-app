import { useEffect, useState } from "react";
import { TrucksList } from "./components/TrucksList";
import { AddTruck } from "./components/AddTruck";

const API_URL = "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com";

function App() {
  const [trucks, setTrucks] = useState([]);

  const onDeleteTruckClickHandler = (truckId) => {
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

  const onAddTruckSubmitHandler = (event) => {
    event.preventDefault();

    const code = event.target.code.value;
    const name = event.target.name.value;
    const status = event.target.status.value;
    const description = event.target.description.value;

    fetch(`${API_URL}/trucks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        name,
        status,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setTrucks((prevTrucks) => [...prevTrucks, data]);
        }
      });
  };

  useEffect(() => {
    fetch(`${API_URL}/trucks`)
      .then((res) => res.json())
      .then((data) => setTrucks(data));
  }, []);

  return (
    <>
      <h1>Trucks App</h1>
      <AddTruck onAdd={onAddTruckSubmitHandler} />
      <TrucksList trucks={trucks} onDelete={onDeleteTruckClickHandler} />
    </>
  );
}

export default App;
