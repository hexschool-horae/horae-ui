import axiosFetcher from "@/apis/axios";
import apiPath from "@/apis/path";
import * as interfaces from "@/apis/interface/api";

export const POST_SIGN_UP = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(
    apiPath.POST_SIGN_UP,
    payload
  );
};

export const POST_USER_LOGIN = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(
    apiPath.POST_USER_LOGIN,
    payload
  );
};
