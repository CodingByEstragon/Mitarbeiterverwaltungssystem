import { createSlice } from "@reduxjs/toolkit";

export const supervisors = createSlice({
  name: "supervisors",
  initialState: {
    value: {},
  },

  reducers: {
    setSupervisor: (state, action) => {
      state.value = action.payload;
    },
    pushNewSupervisor: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { setSupervisor, pushNewSupervisor } = supervisors.actions;

export default supervisors.reducer;
