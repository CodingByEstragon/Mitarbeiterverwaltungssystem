import { createSlice } from "@reduxjs/toolkit";

export const seeAllEmployees = createSlice({
  name: "seeAllEmployees",
  initialState: {
    value: false,
  },

  reducers: {
    setSeeAllEmployees: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSeeAllEmployees } = seeAllEmployees.actions;

export default seeAllEmployees.reducer;
