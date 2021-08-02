import { Row, Col, Card, Avatar, Tabs, Tag } from "antd";
import { useRouter } from "next/router";
import Link from 'next/link';
import styled from 'styled-components';
import { useEffect, useState } from "react";
import { StudentProfile } from "../../../../app/model/student";
import { StudentCourse, CourseType } from "../../../../app/model/course";
import studentService from "../../../../app/services/studentService";
import AppLayout from "../../../../components/layout/AppLayout";
import { programLanguageColors } from "../../../../app/lib/constant";
import Table, { ColumnType } from 'antd/lib/table';

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

const StudentDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [studentProfile, setStudentProfile] = useState<StudentProfile>();
    const columns: ColumnType<StudentCourse>[] = [
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
                <Link href='#'>{value}</Link>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (type: CourseType[]) => type.map((item) => item.name).join(','),
        },
        {
            title: 'Join Time',
            dataIndex: 'createdAt',
        },
      ];

    useEffect(() => {
        async function fetchStudentProfile() {
            if(!!id && typeof id === "string") {
                const { data } = await studentService.getStudentById(parseInt(id));
                if(!!data) {
                    setStudentProfile(data);
                }
            }
        }
        fetchStudentProfile();
    },[id])

    return (
        <AppLayout>
            <Row gutter={[6, 16]}>
                <Col span={8}>
                <Card
                    title={
                        <Avatar
                            src={studentProfile?.avatar}
                            style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
                        />
                    }
                >
                    <Row gutter={[6, 16]}>
                        <Col span={12} key="Name" style={{ textAlign: 'center' }}>
                            <b>Name</b>
                            <p>{studentProfile?.name}</p>
                        </Col>
                        <Col span={12} key="Age" style={{ textAlign: 'center' }}>
                            <b>Age</b>
                            <p>{studentProfile?.age}</p>
                        </Col>
                    </Row>
                    <Row gutter={[6, 16]}>
                        <Col span={12} key="Email" style={{ textAlign: 'center' }}>
                            <b>Email</b>
                            <p>{studentProfile?.email}</p>
                        </Col>
                        <Col span={12} key="Phone" style={{ textAlign: 'center' }}>
                            <b>Phone</b>
                            <p>{studentProfile?.phone}</p>
                        </Col>
                    </Row>
                    <Row gutter={[6, 16]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <b>Address</b>
                            <p>{studentProfile?.address}</p>
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
                                    <Col span={24} key="Education">
                                        <StyledBold>
                                            Education:
                                        </StyledBold>
                                        <span>{studentProfile?.education}</span>
                                    </Col>
                                    <Col span={24} key="Area">
                                        <StyledBold>
                                            Area:
                                        </StyledBold>
                                        <span>{studentProfile?.country}</span>
                                    </Col>
                                    <Col span={24} key="Gender">
                                        <StyledBold>
                                            Gender:
                                        </StyledBold>
                                        <span>{studentProfile?.gender}</span>
                                    </Col>
                                    <Col span={24} key="Member Period">
                                        <StyledBold>
                                            Member Period:
                                        </StyledBold>
                                        <span>{studentProfile?.memberStartAt} - {studentProfile?.memberEndAt}</span>
                                    </Col>
                                    <Col span={24} key="Type">
                                        <StyledBold>
                                            Type:
                                        </StyledBold>
                                        <span>{studentProfile?.type.name}</span>
                                    </Col>
                                    <Col span={24} key="Create Time:">
                                        <StyledBold>
                                            Create Time:
                                        </StyledBold>
                                        <span>{studentProfile?.createdAt}</span>
                                    </Col>
                                    <Col span={24} key="Update Time">
                                        <StyledBold>
                                            Update Time:
                                        </StyledBold>
                                        <span>{studentProfile?.updatedAt}</span>
                                    </Col>
                                </Row>
                                <StyledH3>Interesting</StyledH3>
                                <Row gutter={[6, 16]}>
                                    <Col>
                                        {studentProfile?.interest.map((item, index) => (
                                            <Tag 
                                                color={programLanguageColors[index]} 
                                                key={index} 
                                                style={{padding: '5px 10px'}}
                                            >
                                                {item}
                                            </Tag>
                                        ))}
                                    </Col>
                                </Row>
                                <StyledH3>Description</StyledH3>
                                <Row gutter={[6, 16]}>
                                    <Col style={{ lineHeight: 2 }}>{studentProfile?.description}</Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Courses" key="2">
                                <Table dataSource={studentProfile?.courses} columns={columns} rowKey="id"></Table>
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    )
}

export default StudentDetails;