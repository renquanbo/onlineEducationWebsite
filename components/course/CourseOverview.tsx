import { Card,Row,Col, Button } from "antd";
import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Gutter } from "antd/lib/grid/row";
import { Course } from "../../app/model/course";
import styled from 'styled-components';
import { DurationUnit } from "../../app/lib/constant/duration";
import Link from "next/link";

const gutterValues:[Gutter,Gutter] = [6, 16];

const StyledRow = styled(Row)`
  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px;
  }
`;

const StyledCol = styled(Col)`
  padding: 8px 3px;
`
const getDuration = (data: Course) => {
  const text= data.duration + ' ' + DurationUnit[data.durationUnit];
  return data.duration > 1 ? text + 's' : text;
}

export default function CourseOverview(props: Course) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Card cover={<img src={props.cover} alt="course cover" style={{ height: 260 }}></img>}>
      <Row gutter={gutterValues}>
        <h3>{props.name}</h3>
      </Row>

      <StyledRow justify="space-between" align="middle" gutter={gutterValues}>
        <StyledCol>{props.startTime}</StyledCol>
        <StyledCol style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} /> 
          <b>{props.star}</b>
        </StyledCol>
      </StyledRow>

      <StyledRow gutter={gutterValues} justify="space-between">
        <StyledCol>Duration:</StyledCol>
        <StyledCol>
          <b>{getDuration(props)}</b>
        </StyledCol>
      </StyledRow>

      <StyledRow gutter={gutterValues} justify="space-between">
        <StyledCol>Teacher:</StyledCol>
        <StyledCol>
          <a><b>{props.teacherName}</b></a>
        </StyledCol>
      </StyledRow>

      <Row gutter={gutterValues} justify="space-between">
        <StyledCol>
          <UserOutlined style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }} />
          <span>Student Limit:</span>
        </StyledCol>
        <StyledCol>
          <b>{props.maxStudents}</b>
        </StyledCol>
      </Row>

      <Link href="#" passHref>
        <Button type="primary" style={{marginTop: "8px"}}>Read More</Button>
      </Link>
    </Card>
  )
}