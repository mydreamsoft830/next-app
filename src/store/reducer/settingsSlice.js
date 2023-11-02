import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import { getSettingApi } from "@/utils/api";
import moment from "moment";
import { checkDemoMode } from "@/utils";

const initialState = {
    data: null,
    lastFetch: null,
    loading: false,
    fcmToken: null,
};

export const settingsSlice = createSlice({
    name: "Settings",
    initialState,
    reducers: {
        settingsRequested: (settings, action) => {
            settings.loading = true;
        },
        settingsSucess: (settings, action) => {
            settings.data = action.payload.data;
            settings.loading = false;
            settings.lastFetch = Date.now();
        },
        settingsFailure: (settings, action) => {
            settings.loading = false;
        },
        getToken: (settinngs, action) => {
            settinngs.fcmToken = action.payload.data
        }
    },
});

export const { settingsRequested, settingsSucess, settingsFailure, getToken } = settingsSlice.actions;
export default settingsSlice.reducer;

// API CALLS


// store token 
export const getFcmToken = (data) => {
    store.dispatch(getToken({ data }))
}

// Selectors
export const settingsData = createSelector(
    (state) => state.Settings,
    (settings) => settings.data
);

export const Fcmtoken =  createSelector(
    state => state.Settings,
    settings => settings.fcmToken
)