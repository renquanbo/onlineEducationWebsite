import axios, { AxiosError } from "axios";
import { IResponse } from "../model/api";
import storage from "./storage";
import { message } from 'antd';

const axiosInstance = axios.create({
    baseURL: 'https://cms.chtoma.com/api/',
})

axiosInstance.interceptors.request.use((config) => {
    // if it is not login request, add authorization token to headers
    if (!config.url?.includes("login")) {
        return {...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' + storage?.token,
            },
        };
    }
    return config;
})

export class BaseApiService {
    protected async get<T>(path: string): Promise<T>{
        return axiosInstance
            .get(path)
            .then((res) => res.data)
            .catch((err) => this.errorHandler(err));
    }

    protected async post<T>(path: string, data: object) :Promise<T>{
        return axiosInstance
            .post(path,data)
            .then((res) => res.data)
            .catch((err) => this.errorHandler(err));
    }

    private errorHandler(err: AxiosError<IResponse>) : IResponse | null{
        const msg = err.response?.data.msg;
        const code = err.response?.status;
        if (typeof msg === 'string' && typeof code === 'number') {
            console.log({msg, code});
            return {msg, code};
        } else {
            return null;
        }
    }

    protected isError(code: number): boolean {
        return !(code.toString().startsWith('2') || code.toString().startsWith('3'));
    }

    protected showMessage = (isSuccessDisplay = false) => (res: IResponse): IResponse => {
        const { code, msg } = res;
        const isError = this.isError(code);

        if (isError) {
            message.error(msg);
        }

        if (isSuccessDisplay && !isError) {
            message.success(msg);
        }

        return res;
    };
}
