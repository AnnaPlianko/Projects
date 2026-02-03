import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: "",
  reducers: {
    setSearchText: (_state, action: PayloadAction<string>) => {
      return action.payload;
    }
  }
});

export const { setSearchText } = searchSlice.actions;
export default searchSlice.reducer;
