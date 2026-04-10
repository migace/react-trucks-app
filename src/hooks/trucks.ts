import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTruck, deleteTruck, fetchTruck, fetchTrucks, CreateTruckPayload } from "@/api/trucks";
import { Truck } from "@/types/truck";

export const TRUCKS_QUERY_KEY = ["trucks"] as const;

export const useTrucks = () =>
  useQuery({
    queryKey: TRUCKS_QUERY_KEY,
    queryFn: fetchTrucks,
  });

export const useAddTruck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTruckPayload) => createTruck(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUCKS_QUERY_KEY });
      toast.success("Truck added successfully");
    },
    onError: () => {
      toast.error("Failed to add truck. Please try again.");
    },
  });
};

export const useTruck = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["truck", id] as const,
    queryFn: () => fetchTruck(id),
    initialData: () =>
      queryClient.getQueryData<Truck[]>(TRUCKS_QUERY_KEY)?.find((t) => t.id === id),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(TRUCKS_QUERY_KEY)?.dataUpdatedAt,
  });
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (truckId: string) => deleteTruck(truckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUCKS_QUERY_KEY });
      toast.success("Truck deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete truck. Please try again.");
    },
  });
};
