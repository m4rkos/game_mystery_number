import { Home } from "./components/Home";
import { Lucky } from "./components/Lucky";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
      path: '/lucky',
      element: <Lucky />
  }
];

export default AppRoutes;
