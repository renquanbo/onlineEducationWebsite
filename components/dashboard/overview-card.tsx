import { Card, Col, Progress, Row } from "antd";
import styled from "styled-components";
import { BasicStatistics } from "../../app/model/statistics";

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

export interface OverviewProps<T = BasicStatistics> {
  total: number;
  percent: number;
  title: string;
  subTitle: string;
  icon: JSX.Element;
  style?: React.CSSProperties;
  mainKey?: 'amount' | 'total';
}

export default function OverviewCard({ total, percent, title, subTitle, icon, style }: OverviewProps) {
  return (
    <StyledCard bordered={true} style={{ ...style }}>
      <Row>
        <StyledLabelContainer span={6}>
          {icon}
        </StyledLabelContainer>
        <Col span={18}>
          <h3>{title}</h3>
          <h2>{total}</h2>
          <Progress
            percent={100 - percent}
            showInfo={false}
            size="small"
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p>{percent + '% ' + subTitle}</p>
        </Col>
      </Row>
    </StyledCard>
  );
}