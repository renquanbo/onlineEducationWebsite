import { useEffect, useState } from "react";
import styled from "styled-components";

interface CountDownProps {
  title: string;
  value: number;
}

const ONE_SECOND =  1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

const Title = styled.p`
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
`

const StyledValue = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
`

export default function MyCountDown({title, value}: CountDownProps) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const tick = () => {
    const now = new Date().getTime();
    const timeLeft = value - now;

    const daysLeft = Math.floor(timeLeft / ONE_DAY);
    const hoursLeft = Math.floor((timeLeft - daysLeft * ONE_DAY) / ONE_HOUR);
    const minutesLeft = Math.floor((timeLeft - daysLeft * ONE_DAY - hoursLeft * ONE_HOUR) / ONE_MINUTE);
    const secondsLeft = Math.floor((timeLeft - daysLeft * ONE_DAY - hoursLeft * ONE_HOUR - minutesLeft * ONE_MINUTE) / ONE_SECOND);

    setDays(daysLeft);
    setHours(hoursLeft);
    setMinutes(minutesLeft);
    setSeconds(secondsLeft);
  }

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  })

  return(
    <div>
      <Title>{title}</Title>
      <StyledValue>{days} Days {hours} Hours {minutes} Mins {seconds} Secs</StyledValue> 
    </div>
  )
}