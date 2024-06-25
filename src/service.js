import axios from "axios";

export const api_host = "http://home.huangyiyang.com:8001";

const handleResponse = (response, expectedStatus) => {
  if (response.status === expectedStatus) {
    return response.data;
  } else {
    throw new Error(`Unexpected response code: ${response.status}`);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error(
      `Server responded with status code ${error.response.status}: ${error.response.data}`
    );
    throw new Error(`Server error: ${error.response.status}`);
  } else if (error.request) {
    console.error("No response received:", error.request);
    throw new Error("No response received from server");
  } else {
    console.error("Error setting up request:", error.message);
    throw new Error(`Request setup error: ${error.message}`);
  }
};

export const fetchCameras = async () => {
  try {
    const response = await axios.post(api_host + "/api/device/cameras");
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

export const createCamera = async (camera) => {
  try {
    const response = await axios.post(
      api_host + "/api/device/creatCamera",
      camera
    );
    return handleResponse(response, 201);
  } catch (error) {
    handleError(error);
  }
};

export const updateCamera = async (camera) => {
  try {
    const response = await axios.post(
      api_host + `/api/device/updateCamera?camera_id=${camera.Camera_id}`,
      camera
    );
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

export const deleteCamera = async (camera_id) => {
  try {
    const response = await axios.post(
      api_host + `/api/device/deleteCamera?camera_id=${camera_id}`
    );
    return handleResponse(response, 204);
  } catch (error) {
    handleError(error);
  }
};

export const fetchAreas = async () => {
  try {
    const response = await axios.post(api_host + "/api/device/areas");
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

export const createArea = async (area) => {
  try {
    const response = await axios.post(api_host + "/api/device/creatArea", area);
    return handleResponse(response, 201);
  } catch (error) {
    handleError(error);
  }
};

export const deleteArea = async (area_id) => {
  try {
    const response = await axios.post(
      api_host + `/api/device/deleteArea?area_id=${area_id}`
    );
    return handleResponse(response, 204);
  } catch (error) {
    handleError(error);
  }
};

export const updateArea = async (area) => {
  try {
    const response = await axios.post(
      api_host + `/api/device/updateArea?area_id=${area.id}`,
      area
    );
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

export const fetchEvents = async () => {
  try {
    const response = await axios.post(api_host + "/api/device/allevents");
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

export const fetchEventTypes = async () => {
  try {
    const response = await axios.post(api_host + "/api/device/eventTypes");
    return handleResponse(response, 200);
  } catch (error) {
    handleError(error);
  }
};

// 将字符串点坐标转换为{x,y}
export const convertPolygonPoints = (coordString) => {
  if (!coordString) {
    return [];
  }
  const coords = coordString.split(";");
  const coordArray = [];
  for (let i = 0; i < coords.length; i += 2) {
    const x = parseInt(coords[i], 10);
    const y = parseInt(coords[i + 1], 10);
    coordArray.push({ x, y });
  }
  return coordArray;
};

// 转换时间戳为可读时间
export const localtime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};
