import { configureStore } from "@reduxjs/toolkit";
import employees from "./helper/employees";
import projects from "./helper/projects";
import supervisor from "./helper/supervisor";
import seeAllEmployees from "./helper/seeAllEmployees";

export default configureStore({
   reducer: {
      employees: employees,
      seeAllEmployees: seeAllEmployees,
      supervisor: supervisor,
      projects: projects,
   },
});
