import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { api } from "./api";

interface GetRegistrationParams {
  cpf?: string;
}

export const getRegistrations = async (
  params: GetRegistrationParams
): Promise<Registration[]> => {
  const response = await api.get(`/registrations`, {
    params,
  });
  return response.data;
};

export const createRegistration = async (body: Registration) => {
  return await api.post(`/registrations`, body);
};

export const changeRegistrationStatus = async (
  registration: Registration,
  status: REGISTRATION_STATUS
) => {
  return await api.put(`/registrations/${registration.id}`, {
    ...registration,
    status,
  });
};
