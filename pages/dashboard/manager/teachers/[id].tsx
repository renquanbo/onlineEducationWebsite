
import { HeartFilled } from "@ant-design/icons";
import { Card, Col, Rate, Row, Tabs, List } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Table, { ColumnType } from "antd/lib/table";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Course } from "../../../../app/model/course";
import { TeacherProfile, TeacherResponse } from "../../../../app/model/teacher";
import { storage } from "../../../../app/services/storage";
import teacherService from "../../../../app/services/teacherService";
import AppLayout from "../../../../components/layout/AppLayout";
import styled from 'styled-components';

const StyledH3 = styled.h3`
    color: #7356f1;
    margin: 20px 0px;
    font-size: 24px;
`;

const StyledBold = styled.b`
    margin-right: 16px;
    min-width: 150px;
    display: inline-block;
`;

const TeacherDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [teacher, setTeacher] = useState<TeacherResponse>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>();
  const columns: ColumnType<Course>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // eslint-disable-next-line react/display-name
      render: (value, record) => (
        <Link href={`/dashboard/${storage.userInfo.role}/courses/${record.id}`}>{value}</Link>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
    },
    {
      title: 'Create Time',
      dataIndex: 'ctime',
    },
    {
      title: 'Enjoy',
      dataIndex: 'star',
      // eslint-disable-next-line react/display-name
      render: (value) => (
        <Rate character={<HeartFilled />} defaultValue={value} disabled style={{ color: 'red' }} />
      ),
    },
  ];

  useEffect(() => {
    async function fetchTeacherProfile() {
      if (!!id && typeof id === "string") {
        const { data } = await teacherService.getTeacherById(parseInt(id));
        if (!!data) {
          setTeacher(data);
          setTeacherProfile(data.profile);
        }
      }
    }
    fetchTeacherProfile();
  }, [id])

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={teacherProfile?.avatar}
                style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
              />
            }
          >
            <Row gutter={[6, 16]}>
              <Col span={12} key="Name" style={{ textAlign: 'center' }}>
                <b>Name</b>
                <p>{teacher?.name}</p>
              </Col>
              <Col span={12} key="Country" style={{ textAlign: 'center' }}>
                <b>Age</b>
                <p>{teacher?.country}</p>
              </Col>
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={12} key="Email" style={{ textAlign: 'center' }}>
                <b>Email</b>
                <p>{teacher?.email}</p>
              </Col>
              <Col span={12} key="Phone" style={{ textAlign: 'center' }}>
                <b>Phone</b>
                <p>{teacher?.phone}</p>
              </Col>
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <b>Address</b>
                <p>{teacherProfile?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <StyledH3>Information</StyledH3>
                <Row gutter={[6, 16]}>
                  <Col span={24} key="Birthday">
                    <StyledBold>
                      Birthday:
                    </StyledBold>
                    <span>{teacherProfile?.education}</span>
                  </Col>
                  <Col span={24} key="Gender">
                    <StyledBold>
                      Gender:
                    </StyledBold>
                    <span>{teacherProfile?.gender}</span>
                  </Col>
                  <Col span={24} key="Create Time:">
                    <StyledBold>
                      Create Time:
                    </StyledBold>
                    <span>{teacher?.createdAt}</span>
                  </Col>
                  <Col span={24} key="Update Time">
                    <StyledBold>
                      Update Time:
                    </StyledBold>
                    <span>{teacher?.updatedAt}</span>
                  </Col>
                </Row>

                <StyledH3>Skills</StyledH3>

                {teacher?.skills.map((item, index) => (
                  <Row key={index} gutter={[6, 16]} align="middle">
                    <Col span={4}>
                      <b>{item.name}:</b>
                    </Col>
                    <Col>
                      <Rate disabled defaultValue={item.level} />
                    </Col>
                  </Row>
                ))}
                <StyledH3>Description</StyledH3>
                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>{teacherProfile?.description}</Col>
                </Row>
                <StyledH3>Education</StyledH3>

                <List>
                  {teacherProfile.education?.map((item, index) => (
                    <List.Item extra={item.degree} key={index}>
                    <List.Item.Meta
                      title={item.startEnd.replace(' ', ' To ')}
                      description={item.level}
                    ></List.Item.Meta>
                  </List.Item>
                  ))}
                </List>

                <StyledH3>Work Experience</StyledH3>
                <List>
                  {teacherProfile.workExperience?.map((item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        title={item.startEnd.replace(' ', ' To ')}
                        description={
                          <Row>
                            <Col span={4}>
                              <b>{item.company}</b>
                            </Col>
                            <Col offset={1}>{item.post}</Col>
                          </Row>
                        }
                      ></List.Item.Meta>
                    </List.Item>
                  ))}
                </List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Courses" key="2">
                <Table dataSource={teacher?.courses} columns={columns} rowKey="id"></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  )
}

export default TeacherDetails;