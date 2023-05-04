import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";

import { httpErrorHandler } from "./errorHandlers";
import type { IBasicResponse } from "@/types/api";

// 把驗證設定成boolean
// interface IPostArgs {
//   url: string;
//   data: object | null;
//   auth?: boolean;
// }

// 把驗證設定成token
// export interface IPostArgs {
//   url: string;
//   data: object | null;
//   token: string;
// }

const baseURL = "https://horae-api.onrender.com/";

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// axios instance request/response基本設定
instance.interceptors.response.use(
  (response: AxiosResponse<IBasicResponse>) => {
    return Promise.resolve(response);
  },
  (error) => {
    if (<AxiosError>error) {
      const { response }: { response: AxiosResponse } = error;
      const { status, data } = response;
      const { message } = data;

      httpErrorHandler(status, message);
    }

    return Promise.reject(error);
  }
);

// api回傳的data，可以透過泛型傳入格式
async function post<T>(url: string, data: unknown, token = "") {
  try {
    if (token !== "") {
      instance.defaults.headers.common["Authorization"] = token;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }

    const clarifiedPath = url.replace(/[^ -~]/g, "");
    const response = await instance.post<T>(clarifiedPath, data);

    const { data: responseData } = response;
    return responseData;
  } catch (error) {
    console.warn(error);
  }
}

async function patch<T>(url: string, data: unknown, token: string) {
  try {
    if (token !== "") {
      instance.defaults.headers.common["Authorization"] = token;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }

    const clarifiedPath = url.replace(/[^ -~]/g, "");
    const response = await instance.patch<T>(clarifiedPath, data);

    const { data: responseData } = response;
    return responseData;
  } catch (error) {
    console.warn(error);
  }
}

async function get<T>(url: string, token: string) {
  try {
    const clarifiedPath = url.replace(/[^ -~]/g, "");
    const response = await instance.get<T>(clarifiedPath);

    return response.data;
  } catch (error) {
    console.warn(error);
  }
}

const axiosFetcher = Object.assign(
  {},
  {
    instance,
    post,
    patch,
    get,
  }
);
export default axiosFetcher;
