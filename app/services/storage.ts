import { LoginResponse } from "../model/login";

type UserInfo = LoginResponse;

class Storage {
    private key = 'oew';

    setUserInfo(info: UserInfo): void {
        localStorage.setItem(this.key, JSON.stringify(info));
    }

    /**
     * 这里有问题，问题是关于null 或者 undefined 如何处理 
     * 问题在于 JSON.parse只接收 string 类型的参数，但是localStorage.getItem返回的是string|null，此时编译器提示有错误
     */

    // get userInfo1(): UserInfo {
    //     try {
    //       return JSON.parse(localStorage.getItem(this.key)) as UserInfo;
    //     } catch (error) {
    //       return null;
    //     }
    // }


    /**
     * 以下是一个解决这个问题的思路，但是我感觉太繁琐
     */
    get userInfo(): UserInfo | null{
        try {
            const item = localStorage.getItem(this.key);
            if(typeof item === "string") {
                return JSON.parse(item) as UserInfo;
            } else if (typeof item === null) {
                return null;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    get token(): string | undefined{
        return this.userInfo?.token;
    }

    removeUserInfo(): void {
        localStorage.removeItem(this.key);
    }
}
export const storage = new Storage();

export default storage;