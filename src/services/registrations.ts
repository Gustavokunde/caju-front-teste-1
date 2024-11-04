import { Registration, REGISTRATION_STATUS } from "~/types/registration";
import { api } from "./api";

interface GetRegistrationParams {
  cpf?: string;
}

export const getRegistrations = async (params: GetRegistrationParams) => {
  return api.get(`/registrations`, {
    params,
  });
};

export const changeRegistrationStatus = (
  registration: Registration,
  status: REGISTRATION_STATUS
) => {
  return api.put(`/registrations/${registration.id}`, {
    ...registration,
    status,
  });
};
