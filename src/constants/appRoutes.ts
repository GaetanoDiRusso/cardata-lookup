import { getHomeRoute, getNewFolderRoute } from "./navigationRoutes";

const HOME_ROUTE = getHomeRoute();
const NEW_VEHICLE_ROUTE = getNewFolderRoute();

export const APP_ROUTES = [
  HOME_ROUTE,
  NEW_VEHICLE_ROUTE,
];
