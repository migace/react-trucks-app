import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { useTrucks, useAddTruck, useDeleteTruck } from "@/hooks/trucks";
import { mockTrucks } from "@/test/mocks/handlers";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

describe("useTrucks", () => {
  it("fetches and returns trucks", async () => {
    const { result } = renderHook(() => useTrucks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTrucks);
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useTrucks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe("useAddTruck", () => {
  it("returns a mutation function", () => {
    const { result } = renderHook(() => useAddTruck(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });

  it("successfully adds a truck", async () => {
    const { result } = renderHook(() => useAddTruck(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      code: "NEW-001",
      name: "New Truck",
      status: "LOADING",
      description: "Test truck",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteTruck", () => {
  it("returns a mutation function", () => {
    const { result } = renderHook(() => useDeleteTruck(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });

  it("successfully deletes a truck", async () => {
    const { result } = renderHook(() => useDeleteTruck(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
