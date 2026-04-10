import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTruck, deleteTruck, fetchTrucks, CreateTruckPayload } from "@/api/trucks";

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
    },
  });
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (truckId: string) => deleteTruck(truckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUCKS_QUERY_KEY });
    },
  });
};
