import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
  },
  reducers: {
    addProperty: (state, action) => {
      const newProperty = { id: Date.now(), ...action.payload };
      state.properties.push(newProperty);
    },
    updateProperty: (state, action) => {
      const { id, data } = action.payload;
      const index = state.properties.findIndex((property) => property.id === Number(id));
      if (index !== -1) {
        state.properties[index] = { ...state.properties[index], ...data };
      }
    },
  },
});

export const { addProperty, updateProperty } = propertySlice.actions;
export default propertySlice.reducer;
