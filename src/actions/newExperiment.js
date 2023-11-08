import * as TYPES from "./types";

import API from "@/utils/axiosInstance";
import Cookies from "universal-cookie";
import { showToast } from "./toastActions";

export const startKraken = (data) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.LOADING });
    dispatch(removePod());
    dispatch({
      type: TYPES.SET_POD_STATUS,
      payload: null,
    });
    const response = await API.post("/start-kraken", {
      params: data,
    });
    if (response.data.status === "200") {
      dispatch({
        type: TYPES.SET_DATA,
        payload: response.data.message,
      });
      dispatch(showToast("success", "Kraken started successfully!"));
      dispatch(getPodDetails());
    } else {
      dispatch(showToast("danger", response.data.message));
    }
  } catch (error) {
    dispatch(showToast("danger", "Something went wrong", "Try again later"));
  }
  dispatch({ type: TYPES.COMPLETED });
};

export const removePod = () => async (dispatch) => {
  try {
    const response = await API.get("/removePod");
    if (response.data.status === "200") {
      dispatch({
        type: TYPES.SET_POD_STATUS,
        payload: null,
      });
      dispatch({
        type: TYPES.SET_LOGS,
        payload: {
          logs: "",
          errorLogs: "",
        },
      });
    }
  } catch (error) {
    dispatch(showToast("danger", "Something went wrong", "Try again later"));
  }
};

export const getPodStatus = () => async (dispatch) => {
  try {
    //  dispatch({ type: TYPES.LOADING });
    const response = await API.get("/getPodStatus");
    if (response.data.status === "200") {
      dispatch({
        type: TYPES.SET_POD_STATUS,
        payload: response.data.podStatus.trim(),
      });
    }
  } catch (error) {
    dispatch(showToast("danger", "Something went wrong", "Try again later"));
  }
  // dispatch({ type: TYPES.COMPLETED });
};

export const getLogs = () => async (dispatch) => {
  try {
    dispatch({ type: TYPES.LOADING });
    const response = await API.get("/getLogs");
    if (response.status === 200 && response.data.message) {
      dispatch({
        type: TYPES.SET_LOGS,
        payload: {
          logs: response.data.message,
          errorLogs: response.data?.errorLog?.substring(1500),
        },
      });
    }
  } catch (error) {
    dispatch(showToast("danger", "Something went wrong", "Try again later"));
  }
  dispatch({ type: TYPES.COMPLETED });
};

export const getPodDetails = () => async (dispatch) => {
  try {
    //  dispatch({ type: TYPES.LOADING });
    const response = await API.get("/getPodDetails");
    if (response.status === 200 && response.data.message) {
      dispatch({
        type: TYPES.SET_POD_DETAILS,
        payload: JSON.parse(response.data.message)[0],
      });
    }
  } catch (error) {
    dispatch(showToast("danger", "Something went wrong", "Try again later"));
  }
  // dispatch({ type: TYPES.COMPLETED });
};

export const updateScenarioChecked = (scenario) => ({
  type: TYPES.CHECK_SCENARIO,
  payload: scenario,
});

export const checkForRootPassword = (isOpen) => (dispatch) => {
  const cookies = new Cookies(null, { path: "/" });
  if (!cookies.get("root-password")) {
    dispatch({ type: TYPES.TOGGLE_ROOT_MODAL, payload: true });
  } else {
    dispatch({ type: TYPES.TOGGLE_ROOT_MODAL, payload: isOpen });
  }
};

export const checkPodmanInstalled = () => async (dispatch) => {
  const response = await API.get("/getPodmanStatus");
  if (response.data.status === "success") {
    dispatch({ type: TYPES.GET_PODMAN_STATUS, payload: true });
  }
};