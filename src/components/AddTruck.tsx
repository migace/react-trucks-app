import { FormEvent } from "react";
import { TruckStatus } from "../types/truck";

const TRUCK_STATUSES: TruckStatus[] = [
  "OUT_OF_SERVICE",
  "LOADING",
  "TO_JOB",
  "AT_JOB",
  "RETURNING",
];

interface AddTruckProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const AddTruck = ({ onSubmit }: AddTruckProps) => (
  <fieldset>
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="code">Code</label>
        <input id="code" name="code" />
      </div>

      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select id="status" name="status">
          {TRUCK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea rows={4} id="description" name="description" />
      </div>

      <button type="submit">Add</button>
    </form>
  </fieldset>
);
