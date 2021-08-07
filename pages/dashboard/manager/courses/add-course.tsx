import { Steps } from "antd";
import { useState } from "react";
import AddCourseForm from "../../../../components/course/AddCourseForm";
import AppLayout from "../../../../components/layout/AppLayout";
const { Step } = Steps;

const AddCourse = () => {

  const [current, setCurrent] = useState(0);

  return (
    <AppLayout>
      <Steps 
        current={current} 
        type="navigation"
        style={{padding:"1em 1.6%", margin:"20px 0"}}
      >
        <Step title="Course Detail"/>
        <Step title="Course Schedule" />
        <Step title="Success"/>
      </Steps>
      <AddCourseForm></AddCourseForm>
    </AppLayout>
  )
}

export default AddCourse;