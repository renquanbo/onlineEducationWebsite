import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useRef, useState } from "react";
import { SkillStatistic, Statistic } from "../../app/model/statistics";
import { SkillDes } from '../../app/lib/constant';

interface BarChartsProps {
  data: {
    [key: string]: Statistic[] | { [key: string]: SkillStatistic[] }
  };
}

type ISeriesItem = {
  name: string;
  stack: string;
  data: number[];
  type: "column";
};

const generateSeriesItem = (level: number, data: SkillStatistic[][]): number[] => {
  let result: number[] = []
  data.map((item) => {
    const target = item.find(element => element.level === level);
    if (!!target) {
      result.push(target.amount);
    } else {
      result.push(0);
    }
  })
  return result;
}

export default function BarChart({ data }: BarChartsProps) {
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: 'Comparing what students are interested in and teachers’ skills',
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Interested VS Skills',
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === 'interest'
          ? `${this.series.name}: ${this.y}`
          : `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>total: ${this.point.total}`;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    }
  });
  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;
    const timer = setTimeout(() => {
      chart.reflow();
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!data['teacher']) {
      return;
    }
    const categories = Object.entries(data['teacher']).map((item) => (item[0]));
    const teacherSkillsArr = Object.entries(data['teacher']).map((item:[string, SkillStatistic[]]) => (item[1]));
    let series: ISeriesItem[] = []
    for (const value in SkillDes) {
      const level = Number(value);
      if (!isNaN(level)) {
        series.push({
          name: SkillDes[level],
          data: generateSeriesItem(level, teacherSkillsArr),
          stack: 'teacher',
          type: "column"
        })
      }
    }
    const interestArr = data['interest'] as Statistic[];
    const interestItem: ISeriesItem = {
      name: 'interest',
      stack: 'interest',
      data: categories.map(item => {
        const target = interestArr?.find(element => element.name === item)
        return !!target ? target.amount : 0;
      }),
      type: "column"
    }
    series.push(interestItem);
    setOptions({
      xAxis: {
        categories: categories
      },
      series: series
    })
  }, [data])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={charRef}
    />
  )
}