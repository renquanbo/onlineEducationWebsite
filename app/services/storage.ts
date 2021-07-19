import { Country, CountryResponse } from "../model/country";
import { LoginResponse } from "../model/login";

type UserInfo = LoginResponse;
type CountryInfo = CountryResponse;

class Storage {
    private key = 'oew';

    setUserInfo(info: UserInfo): void {
        localStorage.setItem(this.key, JSON.stringify(info));
    }

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

    setAreas(countries: CountryInfo) {
        localStorage.setItem('areas',JSON.stringify(countries));
    }

    getAreas() {
        try {
            const item = localStorage.getItem('areas');
            if (typeof item === "string") {
                return JSON.parse(item) as CountryInfo
            } else if (typeof item === null) {
                return null;
            }
            return null;
        }catch (error) {
            null
        }
    }
}
export const storage = new Storage();

export default storage;