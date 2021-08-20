import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { Statistic } from "../../app/model/statistics";

interface PieChartProps {
  data: Statistic[];
  title: string;
}

export default function PieChart({ data, title }: PieChartProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br> total: {point.y}',
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if(!data) {
      return
    }
    const total = data.reduce((previousValue, currentItem) => {
      return previousValue + currentItem.amount;
    }, 0);
    const mapSource = data.map(item => {
      return {
        name: item.name,
        y: item.amount
      }
    });
    const newOptions = {
      title: {
        text: title
      },
      subtitle: {
        // text:  title.split(" ")[0].toLowerCase() + " total: " + total,
        text:  title.split(" ")[0] + " total: " + total,
        align: 'right',
      },
      series: [{
        name: "percentage",
        data: mapSource
      }]
    }
    setOptions(newOptions);
  }, [data, title])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    >
    </HighchartsReact>
  );
}