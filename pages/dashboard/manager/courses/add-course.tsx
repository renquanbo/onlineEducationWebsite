import { Button, Result, Steps } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { Course } from "../../../../app/model/course";
import AddCourseForm from "../../../../components/course/AddCourseForm";
import UpdateChapterForm from "../../../../components/course/UpdateChapterForm";
import AppLayout from "../../../../components/layout/AppLayout";
const { Step } = Steps;

const AddCourse = () => {
  const [current, setCurrent] = useState(0);
  const [availableNavigate, setAvailableNavigate] = useState<number[]>([0]);
  const [courseId, setCourseId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const router = useRouter();

  const moveToNext = () => {
    setCurrent(current + 1);
    setAvailableNavigate([...availableNavigate, current + 1]);
  };

  const onSuccess = (course: Course) => {
    setCourseId(course.id);
    setScheduleId(course.scheduleId);
    moveToNext();
  }

  const steps = [
    <AddCourseForm key={1} onSuccess={onSuccess} isUpdate={false}></AddCourseForm>,
    <UpdateChapterForm key={2} courseId={courseId} scheduleId={scheduleId} onSuccess={moveToNext} isAdd={true}></UpdateChapterForm>,
    <Result
      key={3}
      status="success"
      title="Successfully Create Course!"
      extra={[
        <Button
          type="primary"
          key="detail"
          onClick={() => router.push(`/dashboard/manager/courses/${courseId}`)} 
        >
          Go Course
        </Button>,
        <Button
          key="again"
          onClick={() => {
            router.reload();
          }}
        >
          Create Again
        </Button>,
      ]}
    />
  ]

  return (
    <AppLayout>
      <Steps 
        current={current} 
        type="navigation"
        onChange={(current) => {
          if(availableNavigate.includes(current)) {
            setCurrent(current);
          }
        }}
        style={{padding:"1em 1.6%", margin:"20px 0"}}
      >
        <Step title="Course Detail"/>
        <Step title="Course Schedule" />
        <Step title="Success"/>
      </Steps>
      
      {steps.map((item, index) => (
        <div key={index} style={{display: index === current ? 'block' : 'none'}}>
          {item}
        </div>
      ))}
    </AppLayout>
  )
}

export default AddCourse;