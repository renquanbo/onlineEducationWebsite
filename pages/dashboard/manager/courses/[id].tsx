import { Badge, Card, Col, Collapse, Row, Steps, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseStatusBadge, CourseStatusColor, CourseStatusText, weekDays } from "../../../../app/lib/constant/course";
import { CourseDetail, Schedule } from "../../../../app/model/course";
import courseService from "../../../../app/services/courseService";
import CourseOverview from "../../../../components/course/CourseOverview";
import AppLayout from "../../../../components/layout/AppLayout";

const StyledRow = styled(Row)`
    width: calc(100% + 48px);
    margin: 0 0 0 -24px !important;
`

const StyledCol = styled(Col)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    border: 1px solid #f0f0f0;
    border-left: none;
    border-bottom: none;
    padding: 8px 3px;
    :last-child {
        border-right: none;
    }
    p {
    margin-bottom: 0;
    }
`
const StyledB = styled.b`
    color: rgb(115, 86, 241);
    font-size: 24px;
`

const StyledH2 = styled.h2 `
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
  color: #7356f1;
`
const StyledH3 = styled.h3 `
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
  margin: 1em 0;
`
const StepsRow = styled(Row)`
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  .ant-steps-item-title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 6em;
  }
`;

const TABLE = styled.table`
  width: 100%;
  border: 1px solid #f0f0f0;
  border-right: 0;
  border-bottom: 0;
  border-radius: 2px 2px 0 0;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  z-index: 0;
  font-size: 14px;
  background: #fff;
  border-radius: 2px;
`

const TH = styled.th`
  text-align: center;
  border-right: 1px solid #f0f0f0;
  border-top-left-radius: 2px;
  padding: 8px 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
`
const TD = styled.td`
  text-align: center;
  background: transparent;
  padding: 8px 8px;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
`

const getChapterExtra = (source: Schedule, index: number) => {
  const activeIndex = source.chapters.findIndex((item) => item.id === source.current);
  const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;

  return <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>;
};

interface ClassTime {
  weekDay: string;
  time: string;
}

const CourseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [courseDetail, setCourseDetail] = useState<CourseDetail>();
  const [classTimeTableData, setClassTimeTableData] = useState<ClassTime[]>([]);

  useEffect(() => {
    async function fetchCourseDetail() {
      if (!!id && typeof id === "string") {
        const { data } = await courseService.getCourseById(id)
        if (!!data) {
          const newClassTimeTableData = weekDays.map((weekDay) => {
            const target =
                data.schedule.classTime.find((item) => item.toLocaleLowerCase().includes(weekDay.toLocaleLowerCase())) || '';
            const time = target.split(' ')[1];
            return {weekDay: weekDay, time: time}
          });
          setClassTimeTableData(newClassTimeTableData);
          setActiveChapterIndex(
            data.schedule.chapters.findIndex((item) => item.id === data.schedule.current)
          );
          setCourseDetail(data);
        }
      }
    }
    fetchCourseDetail();
  }, [id]);

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseOverview {...courseDetail} cardProps={{ bodyStyle: { paddingBottom: 0 } }}>
            <StyledRow gutter={[6, 16]} justify="space-between" align="middle">
              <StyledCol span={6}>
                <StyledB>{courseDetail?.sales.price}</StyledB>
                <p>Price</p>
              </StyledCol>
              <StyledCol span={6}>
                <StyledB>{courseDetail?.sales.batches}</StyledB>
                <p>Batches</p>
              </StyledCol>
              <StyledCol span={6}>
                <StyledB>{courseDetail?.sales.studentAmount}</StyledB>
                <p>Students</p>
              </StyledCol>
              <StyledCol span={6}>
                <StyledB>{courseDetail?.sales.earnings}</StyledB>
                <p>Earnings</p>
              </StyledCol>
            </StyledRow>
          </CourseOverview>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <StyledH2>Course Detail</StyledH2>

            <StyledH3>Create Time</StyledH3>
            <Row>{courseDetail?.createdAt}</Row>

            <StyledH3>Start Time</StyledH3>
            <Row>{courseDetail?.startTime}</Row>

            <Badge status={CourseStatusBadge[courseDetail?.status] as any} offset={[5, 24]}>
              <StyledH3>Status</StyledH3>
            </Badge>

            <StepsRow>
              <Steps size="small" current={activeChapterIndex} style={{ width: 'auto' }}>
                {courseDetail?.schedule.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </StepsRow>

            <StyledH3>Course Code</StyledH3>
            <Row>{courseDetail?.uid}</Row>

            <StyledH3>Class Time</StyledH3>
            <TABLE>
              <tr>
                {weekDays.map((item,index)=>(
                  <TH key={index}>{item}</TH>
                ))}
              </tr>
              <tr>
                {classTimeTableData.map((item,index)=>(
                  <TD key={index}>{item.time}</TD>
                ))}
              </tr>
            </TABLE>

            <StyledH3>Category</StyledH3>
            <Row>
              {courseDetail?.type.map((item) => (
                <Tag color={'geekblue'} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </Row>

            <StyledH3>Description</StyledH3>
            {courseDetail?.detail !== 'no' ? (
              <Row>{courseDetail?.detail}</Row>
            ) : (
              <Row>No Description </Row>
            )}

            <StyledH3>Chapter</StyledH3>
            {courseDetail?.schedule && (
              <Collapse defaultActiveKey={courseDetail?.schedule.current}>
                {courseDetail?.schedule.chapters.map((item, index) => (
                  <Collapse.Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(courseDetail?.schedule, index)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}

          </Card>
        </Col>
      </Row>
    </AppLayout>
  )
}

export default CourseDetailPage;