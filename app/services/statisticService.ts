import axios from "axios";
import { IResponse } from "../model/api";
import { StatisticOverviewResponse } from "../model/statistics";
import { BaseApiService } from "./baseApiService";

class StatisticService extends BaseApiService {
    getOverview():Promise<IResponse<StatisticOverviewResponse>> {
        return this.get('statistics/overview');
    }
    getWorldMap = () => {
        return axios.get('https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json');
    }
}

const statisticService = new StatisticService();
export default statisticService; 