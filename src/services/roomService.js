import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getRooms = async () => {
  const response = await axios.get(`${API_URL}/rooms`);

  return response.data.rooms;
};

export const getRoomById = async (id) => {
  const response = await axios.get(`${API_URL}/rooms/${id}`);

  return response.data.room;
};
