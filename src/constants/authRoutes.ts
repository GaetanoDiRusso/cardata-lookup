import { getLoginRoute, getRegisterRoute } from "./navigationRoutes";

const LOGIN_ROUTE = getLoginRoute();
const SIGNUP_ROUTE = getRegisterRoute();

export const AUTH_ROUTES = [
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
];
