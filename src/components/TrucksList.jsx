export const TrucksList = ({ trucks = [], onDelete }) => (
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Name</th>
        <th>Status</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {trucks.map((truck) => (
        <tr key={truck.id}>
          <td>{truck.code}</td>
          <td>{truck.name}</td>
          <td>{truck.status}</td>
          <td>{truck.description}</td>
          <td>
            <button onClick={() => onDelete(truck.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
