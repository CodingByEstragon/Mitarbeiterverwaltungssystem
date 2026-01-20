import { createSlice } from "@reduxjs/toolkit";

export const projects = createSlice({
   name: "projects",
   initialState: {
      value: [],
   },
   
   reducers: {
      setProjects: (state, action) => {
         state.value = action.payload;
      },
      pushNewProject: (state, action) => {
         state.value.push(action.payload);
      },
   },
});

export const { setProjects, pushNewProject } = projects.actions;

export default projects.reducer;
 