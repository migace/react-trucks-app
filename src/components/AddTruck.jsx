export const AddTruck = ({ onAdd }) => (
  <fieldset>
    <form onSubmit={onAdd}>
      <label htmlFor="code">Code</label>
      <input id="code" name="code" />

      <label htmlFor="name">Name</label>
      <input id="name" name="name" />

      <label htmlFor="status">Status</label>
      <select id="status" name="status">
        <option>OUT_OF_SERVICE</option>
        <option>LOADING</option>
        <option>TO_JOB</option>
        <option>AT_JOB</option>
        <option>RETURNING</option>
      </select>

      <label htmlFor="description">Description</label>
      <input id="description" name="description" />

      <button>Add</button>
    </form>
  </fieldset>
);
