import AppLayout from '../../../../components/layout/AppLayout';
import { Col, Input, Row, Select, Tag, Typography } from "antd";
import Table, { ColumnType } from 'antd/lib/table';
import { StudentOwnCourse, StudentOwnCoursesResponse } from '../../../../app/model/student';
import Link from 'next/link';
import { CourseStatusColor, CourseStatusText } from '../../../../app/lib/constant/course';
import { DurationUnit } from '../../../../app/lib/constant/duration';
import { formatDistanceToNow } from 'date-fns';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useListEffect } from '../../../../components/custom-hooks/list-effect';
import { CourseRequest } from '../../../../app/model/course';
import courseService from '../../../../app/services/courseService';
import storage from '../../../../app/services/storage';
import { debounce } from 'lodash';

const OwnCoursesPage = () => {
  const [query, setQuery] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'name' | 'type'>('name');
  const columns: ColumnType<StudentOwnCourse>[] = [
    {
      title: 'No.',
      key: 'id',
      render: (text: string, record: any, index: number) => (index + 1),
    },
    {
      title: 'Course Name',
      key: 'name',
      dataIndex: ['course','name'],
      sorter: (a: StudentOwnCourse, b: StudentOwnCourse) => (a.course.name.charCodeAt(0) - b.course.name.charCodeAt(0)),
      // eslint-disable-next-line react/display-name
      // render: (text, record: StudentOwnCourse, index) =>
      //   (<Link href={`/dashboard/student/courses/${record?.id}`}>{record?.course?.name}</Link>)
    },
    {
      title: 'Status',
      dataIndex: ['course', 'status'],
      // eslint-disable-next-line react/display-name
      render: (status: number) => (
        <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: ['course', 'duration'],
      render: (value, record: StudentOwnCourse) => { 
        if(value > 1) {
          return `${value} ${DurationUnit[record?.course?.durationUnit]}s`
        } else {
          return `${value} ${DurationUnit[record?.course?.durationUnit]}`
        }
      },
    },
    {
      title: 'Course Start',
      dataIndex: ['course', 'startTime'],
    },
    {
      title: 'Category',
      dataIndex: ['course', 'typeName'],
    },

    {
      title: 'Join Time',
      dataIndex: 'createdAt',
      render: (value: string) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
  ];

  const {data, total, paginator, loading, setData, setTotal, setLoading, setPaginator} = useListEffect<
    CourseRequest,
    StudentOwnCoursesResponse,
    StudentOwnCourse
  >(courseService.getStudentOwnCourses.bind(courseService), 'courses', true, {userId: storage?.userInfo?.userId})

  useEffect(() => {
    async function queryCourses() {
      setLoading(true);
      courseService.getStudentOwnCourses({limit: paginator.limit, page: paginator.page, userId: storage?.userInfo?.userId, [searchBy]: query})
        .then((res) => {
          if (res && res.data) {
            console.log(data);
            setData(res.data.courses);
            setTotal(res.data.total);
          }
          setLoading(false);
        })
    }
    queryCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchBy, query])

  const debouncedQuery = useRef(debounce(setQuery, 1000));

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedQuery.current(event.target.value);
  }

  return (
    <AppLayout>
      <Row gutter={[6,16]} style={{ marginBottom: '16px' }}>
        <Col>
          <Input
            addonBefore={
              <Select defaultValue="name" onChange={(value: 'name' | 'type') => {setSearchBy(value)}}>
                <Select.Option value="name">Name</Select.Option>
                <Select.Option value="type">Category</Select.Option>
              </Select>
            }
            addonAfter={<SearchOutlined />}
            placeholder={`Search by ${searchBy}`}
            onChange={handleSearchChange}
          ></Input>
        </Col>
      </Row>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={data}
        pagination={{ total: total, current: paginator.page, pageSize: paginator.limit }}
        onChange={
          ({ current, pageSize }) => {
            setPaginator({ page: current as number, limit: pageSize as number });
          }
        }
        loading={loading}
      ></Table>
    </AppLayout>
  )
}

export default OwnCoursesPage;