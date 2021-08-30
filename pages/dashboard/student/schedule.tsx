import AppLayout from '../../../components/layout/AppLayout';
import { Calendar, Card, Col, Descriptions, Row, Tooltip, Typography } from "antd";
import { useEffect, useState } from 'react';
import courseService from '../../../app/services/courseService';
import storage from '../../../app/services/storage';
import { Moment } from 'moment';
import { Chapter, ClassSchedule } from '../../../app/model/course';
import { cloneDeep, omit } from 'lodash';
import { addDays, addMonths, addYears, differenceInCalendarDays, getDay, getMonth, getYear, isSameDay } from 'date-fns';
import { addHours, addWeeks } from 'date-fns/esm';
import { weekDays } from '../../../app/lib/constant/course';
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';

interface WeekdayTime {
  weekday: number;
  time: string;
}

interface ClassCalendar extends WeekdayTime {
  date: Date;
  chapter: Chapter;
}

const courseTypeColors: string[] = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'crimson',
  'purple',
  'red',
  'lime',
];


function generateClassCalendar(course: ClassSchedule): ClassCalendar[] {
  const {
    startTime, duration, durationUnit,
    schedule: { classTime, chapters }
  } = course;

  if (!classTime) {
    return [];
  }

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);
  const transformWeekday = (day: string) => weekDays.findIndex(item => item === day);
  //处理星期和时间字符串，便于排序和查找
  const classTimes = classTime.map((item) => {
    const [day, time] = item.split(' ');
    const weekday = transformWeekday(day);

    return { weekday, time };
  });
  const getClassTimeByGivenDay = (day: number) => classTimes.find((item) => item.weekday === day);
  const result: ClassCalendar[] = [
    { date: start, chapter: chaptersCopy.shift(), weekday: getDay(start), time: '' }, // 第一节课没有时间
  ];
  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassTimeByGivenDay(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();

      result.push({ date, chapter, ...classInfo });
    }
  }
  return result;
}

const SchedulePage = () => {
  const [data, setData] = useState<(ClassSchedule & { calendar: ClassCalendar[] })[]>([]);
  const [notifyInfo, setNotifyInfo] = useState<ClassSchedule & { class: ClassCalendar }>(null);
  const dateCellRender = (current: Moment) => {
    const listData = data.map((course) => {
      const { calendar } = course;
      const target = calendar.find(item => isSameDay(item.date,current.toDate()))
      return !!target ? { class: target, ...omit(course, 'calendar') } : null;
    })
      .filter((item) => !!item);
    return (
      <>
        {listData.map((item, index) => (
          <Row
            gutter={[6, 6]}
            key={index}
            style={{ fontSize: 12 }}
            onClick={() => setNotifyInfo(item)}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>

            <Col span={8} offset={1}>
              {item.class.time}
            </Col>

            <Col offset={1} style={{ color: courseTypeColors[item.type[0]?.id % 9] }}>
              {item.name}
            </Col>
          </Row>
        ))}
      </>
    )
  }

  const monthCellRender = (current: Moment) => {
    const month = getMonth(current.toDate());
    const year = getYear(current.toDate());
    const result = data
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  }

  useEffect(() => {
    async function fetchClassSchedule() {
      const res = await courseService.getClassSchedule(storage.userInfo.userId);
      if (!res) {
        return;
      }
      if (!!res.data) {
        const convertedData = res.data.map((course) => ({ ...course, calendar: generateClassCalendar(course) }));
        setData(convertedData);
      }
    }
    fetchClassSchedule();
  }, [])

  return (
    <AppLayout>
      <Card title="My Class Schedule">
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
      </Card>

      <Modal
        title="Class Info"
        visible={!!notifyInfo}
        footer={null}
        onCancel={() => setNotifyInfo(null)}
      >
        <Descriptions>
          <Descriptions.Item span={8} label="Course Name">
            {notifyInfo?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter N.O">
            {notifyInfo?.schedule.chapters.findIndex(
              (item) => item.id === notifyInfo?.class.chapter?.id
            ) + 1}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Course Type">
            {notifyInfo?.type[0]?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Teacher Name">
            {notifyInfo?.teacherName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Class Time">
            {notifyInfo?.class.time}

            <Tooltip title="Remend me">
              <NotificationFilled
                style={{ color: '#1890ff', marginLeft: 10, cursor: 'pointer' }}
                onClick={() => {
                  // TODO: notify system;
                  setNotifyInfo(null);
                }}
              />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter Name">
            {notifyInfo?.class.chapter?.name}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Chapter Content">
            {notifyInfo?.class.chapter?.content}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </AppLayout>
  )
}

export default SchedulePage;