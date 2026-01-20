import { createSlice } from "@reduxjs/toolkit";

export const employees = createSlice({
   name: "employees",
   initialState: {
      value: [],
   },

   reducers: {
      setEmployees: (state, action) => {
         state.value = action.payload;
      },
      pushNewEmployee: (state, action) => {
         state.value.push(action.payload);
      },
   },
});

export const { setEmployees, pushNewEmployee } = employees.actions;

export default employees.reducer;
