import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Form, Input, message, Button, Select, TimePicker } from "antd";
import { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { format } from "date-fns";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { weekDays } from "../../app/lib/constant/course";
import { ScheduleRequest } from "../../app/model/course";
import courseService from "../../app/services/courseService";

const { Option } = Select;

type ChapterFormValue = {
  chapters: {
    name: string;
    content: string;
  }[];
  classTime: {
    weekday: string;
    time: Date;
  }[];
}

interface FieldNameWeekdayPair {
  fieldName: number;
  value: string;
}

interface updateChapterFormProps {
  courseId: number;
  scheduleId: number;
  onSuccess?: () => void;
  isAdd: boolean;
}

export default function UpdateChapterForm({ courseId, scheduleId, onSuccess, isAdd }: updateChapterFormProps) {
  const [form] = useForm<ChapterFormValue>();
  const [fieldNameWeekdayPairs, setFieldNameWeekdayPairs] = useState<FieldNameWeekdayPair[]>([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);

  const handleOptionChange = (fieldName: number, value: string) => {
    if (fieldNameWeekdayPairs.length === 0 || !fieldNameWeekdayPairs.map(item => item.fieldName).includes(fieldName)) {
      setFieldNameWeekdayPairs([...fieldNameWeekdayPairs, { fieldName: fieldName, value: value }]);
      setSelectedWeekdays([...selectedWeekdays, value]);
    } else {
      let tempFieldNameWeekdayPairs = fieldNameWeekdayPairs.filter(item => item.fieldName !== fieldName);
      tempFieldNameWeekdayPairs.push({fieldName:fieldName, value: value});
      setFieldNameWeekdayPairs(tempFieldNameWeekdayPairs);
      let tempSelectedWeekdays = tempFieldNameWeekdayPairs.map(item => item.value);
      setSelectedWeekdays(tempSelectedWeekdays);
    }
  }

  const handleFieldItemRemove = (fieldName: number) => {
    let tempFieldNameWeekdayPairs = fieldNameWeekdayPairs.filter(item => item.fieldName !== fieldName);
    setFieldNameWeekdayPairs(tempFieldNameWeekdayPairs);
    let tempSelectedWeekdays = tempFieldNameWeekdayPairs.map(item => item.value);
    setSelectedWeekdays(tempSelectedWeekdays);
  }

  const initialValues = {
    chapters: [{ name: '', content: '' }],
    classTime: [{ weekday: '', time: '' }]
  };

  const onFinish = (values: ChapterFormValue) => {
    if (!courseId && !scheduleId) {
      message.error('You must select a course to update!');
      return;
    }

    const { classTime: origin, chapters } = values;
    const classTime = origin.map(({ weekday, time }) => `${weekday} ${moment(time).format('HH:mm:ss')}`);
    console.log(classTime);
    const req: ScheduleRequest = {
      chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
      classTime,
      scheduleId,
      courseId,
    };

    courseService.updateSchedule(req).then((res) => {
      const { data } = res;

      if (!!onSuccess && data) {
        onSuccess();
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (isAdd || !scheduleId) {
        return;
      }
      const {data} = await courseService.getScheduleById(scheduleId);
      if (!!data) {
        if(data.classTime === null) {
          form.setFieldsValue({ chapters: [{ name: '', content: '' }], classTime: [{ weekday: '', time: '' }] });
          return;
        }
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: moment(new Date(`2021-08-11 ${time}`)) };
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
        setSelectedWeekdays(classTimes.map((item) => item.weekday));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isAdd, scheduleId]) 

  return (
    <Form
      form={form}
      name="schedule"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={initialValues}
      style={{ padding: '0 1.6%' }}
    >
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <h2 style={{ fontFamily: "'Segoe UI'" }}>Chapters</h2>
          <Form.List name="chapters">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...fields}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.fieldKey, 'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one chapter.');
                            }
                          }}
                        >
                        </MinusCircleOutlined>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2 style={{ fontFamily: "'Segoe UI'" }}>Class times</h2>
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'weekday']}
                        fieldKey={[field.fieldKey, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          onChange={(value: string) => {
                            handleOptionChange(field.name, value);
                          }}
                        >
                          {weekDays.map((day) => (
                            <Option key={day} value={day} disabled={selectedWeekdays.includes(day)}>{day}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'time']}
                        fieldKey={[field.fieldKey, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <FormItem>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              handleFieldItemRemove(field.name);
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one class time.');
                            }
                          }}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        disabled={fields.length >= 7}
                        onClick={() => {
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}