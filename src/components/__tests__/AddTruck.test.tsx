import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { AddTruck } from "@/components/AddTruck";

describe("AddTruck", () => {
  it("renders all form fields", () => {
    render(<AddTruck />);

    expect(screen.getByLabelText("Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<AddTruck />);
    expect(
      screen.getByRole("button", { name: "Add Truck" }),
    ).toBeInTheDocument();
  });

  it("renders the heading", () => {
    render(<AddTruck />);
    expect(screen.getByText("Add New Truck")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty required fields", async () => {
    const user = userEvent.setup();
    render(<AddTruck />);

    await user.click(screen.getByRole("button", { name: "Add Truck" }));

    await waitFor(() => {
      expect(screen.getByText("Code is required")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
  });

  it("shows validation error for code exceeding max length", async () => {
    const user = userEvent.setup();
    render(<AddTruck />);

    await user.type(screen.getByLabelText("Code"), "A".repeat(21));
    await user.type(screen.getByLabelText("Name"), "Valid Name");
    await user.click(screen.getByRole("button", { name: "Add Truck" }));

    await waitFor(() => {
      expect(
        screen.getByText("Code must be 20 characters or less"),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for name too short", async () => {
    const user = userEvent.setup();
    render(<AddTruck />);

    await user.type(screen.getByLabelText("Code"), "TRK-001");
    await user.type(screen.getByLabelText("Name"), "A");
    await user.click(screen.getByRole("button", { name: "Add Truck" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
    });
  });

  it("renders all status options", () => {
    render(<AddTruck />);
    const select = screen.getByLabelText("Status");

    expect(select).toBeInTheDocument();
    expect(screen.getByText("Out of Service")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("To Job")).toBeInTheDocument();
    expect(screen.getByText("At Job")).toBeInTheDocument();
    expect(screen.getByText("Returning")).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<AddTruck onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Code"), "TRK-001");
    await user.type(screen.getByLabelText("Name"), "Volvo FH16");
    await user.type(
      screen.getByLabelText("Description"),
      "Test truck description",
    );
    await user.click(screen.getByRole("button", { name: "Add Truck" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("has default status value", () => {
    render(<AddTruck />);
    const select = screen.getByLabelText("Status") as HTMLSelectElement;
    expect(select.value).toBe("OUT_OF_SERVICE");
  });
});
