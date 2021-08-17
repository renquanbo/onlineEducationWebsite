export interface BasicStatistics {
  total: number;
  lastMonthAdded: number;
}

export interface GenderStatistics {
  gender: { 
    male: number; 
    female: number; 
    unknown: number;
  };
}

export interface StatisticOverviewResponse {
  course: BasicStatistics;
  student: BasicStatistics & GenderStatistics;
  teacher: BasicStatistics & GenderStatistics;
}