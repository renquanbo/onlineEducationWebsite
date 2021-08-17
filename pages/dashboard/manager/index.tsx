import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StatisticOverviewResponse } from '../../../app/model/statistics';
import areaService from '../../../app/services/areaService';
import statisticService from '../../../app/services/statisticService';
import storage from '../../../app/services/storage';
import AppLayout from '../../../components/layout/AppLayout';
import highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import Distribution from '../../../components/overview/distribution';

const StyledLabelContainer = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  .anticon {
    background: #fff;
    padding: 0.7em;
    border-radius: 50%;
    color: #999;
  }
`

const StyledCard = styled(Card)`
  border-radius: 5px; 
  cursor: pointer;
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`

const getPercent = (lastMonthAdded: number, total: number):number => {
  return +((lastMonthAdded / total) * 100).toFixed(1)
}

const ManagerDashboard = () => {
  const [overview, setOverview] = useState<StatisticOverviewResponse>();
  

  useEffect(() => {
    async function fetchOverview() {
      const { data } = await statisticService.getOverview();
      if(!!data) {
        setOverview(data);
      }
    }
    fetchOverview();
  },[])

  useEffect(() => {
    async function fetchAreas() {
      const { data } = await areaService.getAreas();
      if (!!data) {
        storage.setAreas(data);
      }
    }

    fetchAreas();
    
  }, [])

  return (
    <AppLayout>
      <Row align="middle" gutter={[24, 16]}>
        <Col span={8}>
          <StyledCard bordered={true} style={{ background: "rgb(24, 144, 255)" }}>
            <Row>
              <StyledLabelContainer span={6}>
                <SolutionOutlined></SolutionOutlined>
              </StyledLabelContainer>
              <Col span={18}>
                <h3>TOTAL STUDENTS</h3>
                <h2>{overview?.student?.total}</h2>
                <Progress
                  percent={100 - getPercent(overview?.student?.lastMonthAdded,overview?.student?.total)}
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                />
                <p>{getPercent(overview?.student?.lastMonthAdded,overview?.student?.total)}% Increase in 30 Days</p>
              </Col>
            </Row>
          </StyledCard>
        </Col>
        <Col span={8}>
          <StyledCard bordered={true} style={{ background: "rgb(103, 59, 183)" }}>
            <Row>
              <StyledLabelContainer span={6}>
                <DeploymentUnitOutlined />
              </StyledLabelContainer>
              <Col span={18}>
                <h3>TOTAL TEACHERS</h3>
                <h2>{overview?.teacher?.total}</h2>
                <Progress
                  percent={100 - getPercent(overview?.teacher?.lastMonthAdded,overview?.teacher?.total)}
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                />
                <p>{getPercent(overview?.teacher?.lastMonthAdded,overview?.teacher?.total)}% Increase in 30 Days</p>
              </Col>
            </Row>
          </StyledCard>
        </Col>
        <Col span={8}>
          <StyledCard bordered={true} style={{ background: "rgb(255, 170, 22)" }}>
            <Row>
              <StyledLabelContainer span={6}>
                <ReadOutlined />
              </StyledLabelContainer>
              <Col span={18}>
                <h3>TOTAL COURSES</h3>
                <h2>{overview?.course?.total}</h2>
                <Progress
                  percent={100 - getPercent(overview?.course?.lastMonthAdded,overview?.course?.total)}
                  showInfo={false}
                  size="small"
                  strokeColor="white"
                  trailColor="lightgreen"
                />
                <p>{getPercent(overview?.course?.lastMonthAdded,overview?.course?.total)}% Increase in 30 Days</p>
              </Col>
            </Row>
          </StyledCard>
        </Col>
      </Row>
      <Row gutter={[6,16]}>
        <Col span={12}>
          <Distribution></Distribution>
        </Col>
        <Col span={12}></Col>
      </Row>
    </AppLayout>
  )
}

export default ManagerDashboard;