import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useRef, useState } from "react";
import { Statistic } from "../../app/model/statistics";

const generateSeriesItemData = (data: Statistic[]) => {
  if(!data) {
    return;
  }
  const resultArr = new Array(12);
  resultArr.fill(0);
  data.forEach(item => {
    const values = item.name.split('-');
    const index = parseInt(values[1]);
    if (index >= 1 && index <= 12) {
      resultArr[index - 1] = item.amount;
    }
  })
  return resultArr;
}

interface LineChartProps {
  data: {
    [key: string]: Statistic[]
  };
}

export default function LineChart({ data }: LineChartProps) {
  const [options, setOptions] = useState<any>({
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: 'Increment',
      },
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
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
    const series = Object.entries(data).map((item) => {
      return {
        name: item[0],
        data: generateSeriesItemData(item[1])
      }
    });
    setOptions({
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