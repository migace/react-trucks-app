import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { TrucksList } from "@/components/TrucksList";
import { Truck } from "@/types/truck";

const mockTrucksData: Truck[] = [
  {
    id: "1",
    code: "TRK-001",
    name: "Volvo FH16",
    status: "AT_JOB",
    description: "Main delivery truck",
  },
  {
    id: "2",
    code: "TRK-002",
    name: "Scania R500",
    status: "LOADING",
    description: "",
  },
];

describe("TrucksList", () => {
  it("renders column headers", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders truck data in table rows", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    expect(screen.getByText("TRK-001")).toBeInTheDocument();
    expect(screen.getByText("Volvo FH16")).toBeInTheDocument();
    expect(screen.getByText("At Job")).toBeInTheDocument();
    expect(screen.getByText("Main delivery truck")).toBeInTheDocument();

    expect(screen.getByText("TRK-002")).toBeInTheDocument();
    expect(screen.getByText("Scania R500")).toBeInTheDocument();
  });

  it("shows fleet count in heading", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    expect(screen.getByText(/Fleet/)).toHaveTextContent("Fleet (2)");
  });

  it("shows skeleton rows when loading", () => {
    render(<TrucksList trucks={[]} isLoading={true} isError={false} />);

    const skeletonCells = document.querySelectorAll(".animate-pulse");
    expect(skeletonCells.length).toBeGreaterThan(0);
  });

  it("does not show fleet count when loading", () => {
    render(<TrucksList trucks={[]} isLoading={true} isError={false} />);

    expect(screen.getByText("Fleet")).toBeInTheDocument();
    expect(screen.queryByText(/Fleet \(/)).not.toBeInTheDocument();
  });

  it('shows "No trucks found" for empty array', () => {
    render(<TrucksList trucks={[]} isLoading={false} isError={false} />);

    expect(screen.getByText(/No trucks found/)).toBeInTheDocument();
  });

  it("shows error message when isError is true", () => {
    render(<TrucksList trucks={[]} isLoading={false} isError={true} />);

    expect(
      screen.getByText("Failed to load trucks. Please try again."),
    ).toBeInTheDocument();
  });

  it("renders delete buttons for each truck", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    const deleteButtons = screen.getAllByText("Delete");
    expect(deleteButtons).toHaveLength(2);
  });

  it("opens confirm dialog when delete is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Delete Truck/)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/),
    ).toHaveTextContent("Volvo FH16");
  });

  it("shows dash for empty description", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    const dashCells = screen.getAllByText("\u2014");
    expect(dashCells.length).toBeGreaterThanOrEqual(1);
  });

  it("renders truck links pointing to detail pages", () => {
    render(
      <TrucksList trucks={mockTrucksData} isLoading={false} isError={false} />,
    );

    const links = screen.getAllByRole("link");
    const truckLinks = links.filter(
      (link) => link.getAttribute("href")?.startsWith("/trucks/") ?? false,
    );
    expect(truckLinks.length).toBeGreaterThanOrEqual(2);
  });
});
