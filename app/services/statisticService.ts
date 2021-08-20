import axios from "axios";
import { IResponse } from "../model/api";
import { StatisticCourseResponse, StatisticOverviewResponse, StatisticStudentResponse, StatisticTeacherResponse } from "../model/statistics";
import { BaseApiService } from "./baseApiService";

class StatisticService extends BaseApiService {
    getOverview(): Promise<IResponse<StatisticOverviewResponse>> {
        return this.get('statistics/overview');
    }
    getWorldMap = () => {
        return axios.get('https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json');
    }
    getStudentStatistics(): Promise<IResponse<StatisticStudentResponse>> {
        return this.get('statistics/student');
    }
    getTeacherStatistics(): Promise<IResponse<StatisticTeacherResponse>> {
        return this.get('statistics/teacher');
    }
    getCourseStatistics(): Promise<IResponse<StatisticCourseResponse>> {
        return this.get('statistics/course');
    }
}

const statisticService = new StatisticService();
export default statisticService; 