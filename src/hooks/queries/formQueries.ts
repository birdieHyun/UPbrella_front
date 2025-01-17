import { getRentFormData, getReturnFormData, getReturnUmbrella } from "@/api/formApi";
import { useQuery } from "@tanstack/react-query";
export const useGetRentFormData = (umbrellaId: number) => {
  return useQuery({
    queryKey: ["rentFormData"],
    queryFn: () => getRentFormData(umbrellaId),
    select: (res) => res.data,
    retry: 0,
  });
};

export const useGetReturnFormData = (storeId: number) => {
  return useQuery({
    queryKey: ["returnFormData"],
    queryFn: () => getReturnFormData(storeId),
    select: (res) => res.data,
    retry: 0,
  });
};

export const useGetReturnUmbrella = () => {
  return useQuery({
    queryKey: ["returnUmbrella"],
    queryFn: () => getReturnUmbrella(),
    select: (res) => res.data,
    retry: 0,
  });
};
