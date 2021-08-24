import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import statisticService from '../../app/services/statisticService';
import { Statistic } from '../../app/model/statistics';

interface DistributionProps {
  data: Statistic[];
  title: string
}

interface Properties {
  'hc-key': string;
  name: string;
}

interface Feature {
  type: string;
  properties: Properties;
}

interface WorldMap {
  features: Feature[];
}

export default function Distribution({data, title}: DistributionProps) {
  const [worldMap, setWorldMap] = useState<WorldMap>(null);
  const [options, setOptions] = useState<any>({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#fff'],
        [0.5, Highcharts.getOptions().colors[0]],
        [1, '#1890ff'],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
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
    async function fetchWorldMap() {
      const {data} = await statisticService.getWorldMap();
      if (!!data) {
        setWorldMap(data);
        setOptions({
          series: [{ mapData: data }],
        })
      }
    }
    fetchWorldMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(!worldMap || !data) {
      return;
    }
    const newOptions = {
      title:{
        text: title.charAt(0).toUpperCase() + title.slice(1)
      },
      series:[{
        mapData: worldMap,
        data: data.map(item => {
          const target = worldMap.features.find((feature) => item.name === feature.properties.name);
          return target ? [target.properties['hc-key'], item.amount]: [];
        }),
        name: 'Total',
        states: {
          hover: {
            color: '#a4edba',
          },
        },
      }],
    };
    setOptions(newOptions);
  }, [worldMap, data, title]);

  return (
    <HighchartsReact
      constructorType={'mapChart'}
      highcharts={Highcharts}
      options={options}
      ref={charRef}
    />
  )
}