import AppLayout from '../../../components/layout/AppLayout';
import { Card, Col, List, message, Row, Space, Tooltip, Typography } from "antd";
import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { StudentCourseDetailStatistic, StudentCourseStatistic, StudentStatistic } from '../../../app/model/statistics';
import statisticService from '../../../app/services/statisticService';
import OverviewCard from '../../../components/dashboard/overview-card';
import { BulbOutlined, CalendarFilled, DesktopOutlined, HeartFilled, ReloadOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons';
import { Course } from '../../../app/model/course';
import courseService from '../../../app/services/courseService';
import styled from 'styled-components';
import Countdown from 'antd/lib/statistic/Countdown';
import Link from 'next/link';
import storage from '../../../app/services/storage';
import { isFuture } from 'date-fns';
import { DurationUnit } from '../../../app/lib/constant/duration';
import MyCountDown from '../../../components/dashboard/my-count-down';

//@ts-ignore
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);


const StyledList = styled(List)`
  .ant-list-item {
    position: relative;
  }
  .ant-list-item-action {
    position: absolute;
    left: 240px;
    bottom: 30px;
  }
  .ant-list-item-meta-description {
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

enum CourseStatus {
  Pending = 0,
  Active,
  Done
}

interface StoreState {
  page: number;
  max: number;
  recommend: Course[];
}

type ActionType = 'increment' | 'reset' | 'setMax' | 'setRecommend';

type Action = {
  type: ActionType;
  payload?: number | Course[];
};

const initialState: StoreState = { page: 1, max: 0, recommend: [] };

const limit = 5;

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'increment':
      return { ...state, page: state.page + 1 };
    case 'reset':
      return { ...state, page: 1 };
    case 'setMax':
      return { ...state, max: action.payload as number };
    case 'setRecommend':
      return { ...state, recommend: action.payload as Course[] };
    default:
      throw new Error();
  }
}

function getCourseCount(status: number, courses: StudentCourseDetailStatistic[]) {
  if (!courses) {
    return;
  }
  const result = courses.reduce((pre, cur) => {
    if (cur.course.status === status) {
      return pre + 1;
    } else {
      return pre
    }
  }, 0)
  return result;
}

const StudentDashboard = () => {
  const [studentStatistic, setStudentStatistic] = useState<StudentStatistic>();
  const [state, dispatch] = useReducer<Reducer<StoreState, Action>>(reducer, initialState);
  const changeBatch = async () => {
    try {
      const { page } = state;
      const current = page * limit > state.max ? 1 : page;
      const {
        data: { courses, total },
      } = await courseService.getCourses({ page: current, limit })

      dispatch({ type: page * limit > total ? 'reset' : 'increment' });

      if (total !== state.max) {
        dispatch({ type: 'setMax', payload: total });
      }

      dispatch({ type: 'setRecommend', payload: courses });
    } catch (err) {
      message.error('Server is busy, please try again later!');
    }
  }

  useEffect(() => {
    async function fetchOverview() {
      const { data } = await statisticService.getStudentStatisticsByStudent()
      if (!!data) {
        setStudentStatistic(data);
        dispatch({ type: 'setRecommend', payload: data.recommend.courses });
      }
    }
    fetchOverview();
  }, [])

  return (
    <AppLayout>
      <Row align="middle" gutter={[24, 16]}>
        <Col span={8}>
          <OverviewCard
            total={getCourseCount(CourseStatus.Pending, studentStatistic?.own?.courses)}
            percent={getCourseCount(CourseStatus.Pending, studentStatistic?.own?.courses) / studentStatistic?.own?.amount * 100}
            title='Pending'
            subTitle='course pending'
            icon={<BulbOutlined />}
            style={{ background: '#1890ff' }}
          ></OverviewCard>
        </Col>
        <Col span={8}>
          <OverviewCard
            total={getCourseCount(CourseStatus.Active, studentStatistic?.own?.courses)}
            percent={getCourseCount(CourseStatus.Active, studentStatistic?.own?.courses) / studentStatistic?.own?.amount * 100}
            title='Active'
            subTitle='course in active'
            icon={<DesktopOutlined />}
            style={{ background: '#673bb7' }}
          ></OverviewCard>
        </Col>
        <Col span={8}>
          <OverviewCard
            total={getCourseCount(CourseStatus.Done, studentStatistic?.own?.courses)}
            percent={getCourseCount(CourseStatus.Done, studentStatistic?.own?.courses) / studentStatistic?.own?.amount * 100}
            title='Done'
            subTitle='course have done'
            icon={<SafetyOutlined />}
            style={{ background: '#ffaa16' }}
          ></OverviewCard>
        </Col>
      </Row>

      <Card
        title={<h3> Courses you might be interested in </h3>}
        extra={
          <Tooltip title="Change batch">
            <ReloadOutlined
              onClick={changeBatch}
              style={{ color: '#1890ff', fontSize: 18, cursor: 'pointer' }}
            />
          </Tooltip>
        }
      >
        {state.recommend ?
          <StyledList
            id="container"
            itemLayout="vertical"
            size="large"
            dataSource={state.recommend}
            //@ts-ignore
            renderItem={(item: Course, index) => (
              <List.Item
                key={item.id}
                extra={
                  <MyCountDown
                  // title={isFuture(new Date(item.startTime)) ? 'Cutdown' : 'In Progress'}
                  // value={new Date(item.startTime).getTime()}
                  title={isFuture(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30) ? 'Countdown' : 'In Progress'}
                  value={Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30}
                  ></MyCountDown>
                }
                actions={[
                  <IconText
                    icon={TeamOutlined}
                    text={item.maxStudents}
                    key="list-vertical-limit-o"
                  />,
                  <IconText icon={HeartFilled} text={item.star} key="list-vertical-star-o" />,
                  <IconText
                    icon={CalendarFilled}
                    text={item.duration + ' ' + DurationUnit[item.durationUnit]}
                    key="list-vertical-calendar-o"
                  />,
                ]}
              >
                <List.Item.Meta
                  // eslint-disable-next-line @next/next/no-img-element
                  avatar={<img src={item.cover} width="200px" />}
                  title={
                    <Link href={`/dashboard/${storage?.userInfo?.role}/courses/${item.id}`} passHref>
                      {item.name}
                    </Link>
                  }
                  description={item.detail}
                ></List.Item.Meta>
              </List.Item>
            )}
          ></StyledList>
          : null}

      </Card>
    </AppLayout>
  )
}

export default StudentDashboard;