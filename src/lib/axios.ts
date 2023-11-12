import axios from "axios";

export const wilayahNusantaraAxios = axios.create({
  baseURL: "https://api.wilayah-nusantara.id"
})