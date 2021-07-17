import { IResponse } from "../model/api";
import { CountryResponse } from "../model/country";
import { BaseApiService } from "./baseApiService";

class AreaService extends BaseApiService {
    getAreas(): Promise<IResponse<CountryResponse>> {
        return this.get<IResponse<CountryResponse>>('/countries');
    }
}

const areaService = new AreaService();
export default areaService;