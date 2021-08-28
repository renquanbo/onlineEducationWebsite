import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SkillStatistic, Statistic, StatisticCourseResponse, StatisticOverviewResponse, StatisticStudentResponse, StatisticTeacherResponse } from '../../../app/model/statistics';
import areaService from '../../../app/services/areaService';
import statisticService from '../../../app/services/statisticService';
import storage from '../../../app/services/storage';
import AppLayout from '../../../components/layout/AppLayout';
import dynamic from 'next/dynamic';
import { RoleEnum } from '../../../app/lib/constant/roleEnum';
import PieChart from '../../../components/overview/pie';
import LineChart from '../../../components/overview/line';
import BarChart from '../../../components/overview/bar';
import HeatChart from '../../../components/overview/heat';
import OverviewCard from '../../../components/dashboard/overview-card';

const StyledLabelContainer = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7vw;
  .anticon {
    background: #fff;
    padding: 1.3vw;
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
const DistributionWithNoSSR = dynamic(() => import('../../../components/overview/distribution'), {
  ssr: false,
});


const getPercent = (lastMonthAdded: number, total: number): number => {
  return +((lastMonthAdded / total) * 100).toFixed(1)
}

const ManagerDashboard = () => {
  const [overview, setOverview] = useState<StatisticOverviewResponse>();
  const [studentStatistics, setStudentStatistics] = useState<StatisticStudentResponse>();
  const [teacherStatistics, setTeacherStatistics] = useState<StatisticTeacherResponse>();
  const [courseStatistics, setCourseStatistics] = useState<StatisticCourseResponse>();
  const [distributionRole, setDistributionRole] = useState<string>(RoleEnum.student);
  const [selectedType, setSelectedType] = useState<string>("Student type");

  useEffect(() => {
    async function fetchOverview() {
      const { data } = await statisticService.getOverview();
      if (!!data) {
        setOverview(data);
      }
    }
    async function fetchStudentStatistics() {
      const { data } = await statisticService.getStudentStatistics();
      if (!!data) {
        setStudentStatistics(data);
      }
    }
    async function fetchTeacherStatistics() {
      const { data } = await statisticService.getTeacherStatistics();
      if (!!data) {
        setTeacherStatistics(data);
      }
    }
    async function fetchCourseStatistics() {
      const { data } = await statisticService.getCourseStatistics();
      if (!!data) {
        setCourseStatistics(data);
      }
    }
    fetchOverview();
    fetchStudentStatistics();
    fetchTeacherStatistics();
    fetchCourseStatistics();
  }, [])

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
          <OverviewCard
            total={overview?.student?.total}
            percent={getPercent(overview?.student?.lastMonthAdded, overview?.student?.total)}
            title='TOTAL STUDENTS'
            subTitle='Increase in 30 Days'
            icon={<SolutionOutlined/>}
            style={{ background: "rgb(24, 144, 255)" }}
          ></OverviewCard>
        </Col>
        <Col span={8}>
          <OverviewCard
            total={overview?.teacher?.total}
            percent={getPercent(overview?.teacher?.lastMonthAdded, overview?.teacher?.total)}
            title='TOTAL TEACHERS'
            subTitle='Increase in 30 Days'
            icon={<DeploymentUnitOutlined/>}
            style={{ background: "rgb(103, 59, 183)" }}
          ></OverviewCard>
        </Col>
        <Col span={8}>
          <OverviewCard
            total={overview?.course?.total}
            percent={getPercent(overview?.course?.lastMonthAdded, overview?.course?.total)}
            title='TOTAL COURSES'
            subTitle='Increase in 30 Days'
            icon={<ReadOutlined/>}
            style={{ background: "rgb(255, 170, 22)" }}
          ></OverviewCard>
        </Col>
      </Row>

      <Row gutter={[6, 16]} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <Card title="Distribution" extra={
            <Select defaultValue={RoleEnum.student} onSelect={setDistributionRole} bordered={false}>
              <Select.Option value={RoleEnum.student}>Student</Select.Option>
              <Select.Option value={RoleEnum.teacher}>Teacher</Select.Option>
            </Select>
          }>
            <DistributionWithNoSSR data={
              distributionRole === RoleEnum.student ? studentStatistics?.country : teacherStatistics?.country
            }
              title={distributionRole} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Types" extra={
            <Select defaultValue={selectedType} onSelect={setSelectedType} bordered={false}>
              <Select.Option value="Student type">Student Type</Select.Option>
              <Select.Option value="Course type">Course Type</Select.Option>
              <Select.Option value="Gender type">Gender</Select.Option>
            </Select>
          }>{
              selectedType === "Student type"
                ? <PieChart data={studentStatistics?.type} title="Student type"></PieChart>
                : selectedType === "Course type"
                  ? <PieChart data={courseStatistics?.type} title="Course type"></PieChart>
                  : (
                    <Row gutter={16}>
                      <Col span={12}>
                        <PieChart data={Object.entries(overview.student.gender).map(([name, amount]) => ({ name, amount }))} title="Student gender"></PieChart>
                      </Col>
                      <Col span={12}>
                        <PieChart data={Object.entries(overview.teacher.gender).map(([name, amount]) => ({ name, amount }))} title="Teacher gender"></PieChart>
                      </Col>
                    </Row>
                  )
            }
          </Card>
        </Col>
      </Row>

      <Row gutter={[6, 16]} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart data={{
              student: studentStatistics?.createdAt,
              teacher: teacherStatistics?.createdAt,
              course: courseStatistics?.createdAt
            }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Languages">
            <BarChart data={{
              teacher: teacherStatistics?.skills,
              interest: studentStatistics?.interest
            }}></BarChart>
          </Card>
        </Col>
      </Row>
      <Row gutter={[6,16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatChart
              data={courseStatistics?.classTime }
              title="Course schedule per weekday"
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  )
}

export default ManagerDashboard;