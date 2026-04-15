import { http, HttpResponse } from "msw";
import { Truck } from "@/types/truck";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const mockTrucks: Truck[] = [
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
    description: "Secondary truck",
  },
  {
    id: "3",
    code: "TRK-003",
    name: "MAN TGX",
    status: "OUT_OF_SERVICE",
    description: "",
  },
];

export const handlers = [
  http.get(`${API_URL}/trucks`, () => {
    return HttpResponse.json(mockTrucks);
  }),

  http.get(`${API_URL}/trucks/:id`, ({ params }) => {
    const truck = mockTrucks.find((t) => t.id === params.id);
    if (!truck) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(truck);
  }),

  http.post(`${API_URL}/trucks`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: "new-1", ...body }, { status: 201 });
  }),

  http.delete(`${API_URL}/trucks/:id`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
