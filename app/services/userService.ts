import { AES } from "crypto-js";
import { IResponse } from "../model/api";
import { LoginRequest, LoginResponse } from "../model/login";
import { BaseApiService } from "./baseApiService";
import storage from "./storage";

class UserService extends BaseApiService {
    async login({ password, ...rest}:LoginRequest): Promise<boolean> {
        const { data } = await this.post<IResponse<LoginResponse>>('login',{
            ...rest,
            password: AES.encrypt(password, 'cms').toString(),
        }).then(this.showMessage());
        if(!!data) {
            storage.setUserInfo(data);
            return true;
        } else {
            return false;
        }
    }

    async logout(): Promise<boolean>{
        const { data } = await this.post<IResponse<boolean>> ('logout',{})
            .then(this.showMessage(true));
        if(data) {
            storage.removeUserInfo();
            return true;
        } else {
            return false;
        }
    }
}

const userService = new UserService();

export default userService;