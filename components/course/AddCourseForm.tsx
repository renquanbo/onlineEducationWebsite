import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Spin, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DurationUnit } from '../../app/lib/constant/duration';
import { AddCourseRequest, Course, CourseType } from '../../app/model/course';
import { Teacher } from '../../app/model/teacher';
import courseService from '../../app/services/courseService';
import teacherService from '../../app/services/teacherService';
import format from 'date-fns/format';
import { HttpRequestHeader, UploadFile } from 'antd/lib/upload/interface';
import { getBase64 } from '../../app/lib/util/image-helper';
import Modal from 'antd/lib/modal/Modal';

const { Option } = Select;

const UploadItem = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    height: 293px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(240, 240, 240);
  width: 100%;
  .anticon {
    font-size: 44px;
    color: #1890ff;
  }
  p {
    font-size: 24px;
    color: #999;
  }
`;

const DeleteIcon = styled(CloseCircleOutlined)`
  color: red;
  position: absolute;
  right: -10px;
  top: 1em;
  font-size: 24px;
  opacity: 0.5;
`;

const customHeaders:HttpRequestHeader = {
  'X-Requested-With': null
}

interface AddCourseFormProps {
  onSuccess?: (course: Course) => void
}

export default function AddCourseForm({onSuccess} : AddCourseFormProps) {

  const [form] = useForm();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [isTeacherSearching, setIsTeacherSearching] = useState<boolean>(false);
  const [durationUnit, setDurationUnit] = useState(3);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<{ previewImage: string; previewTitle: string }>(null);

  const handleSearchTeacher = async (name: string) => {
    setIsTeacherSearching(true);
    const { data } = await teacherService.getTeachers({ query: name })
    if (!!data) {
      setTeachers(data.teachers)
    }
    setIsTeacherSearching(false);
  }

  const handleDurationUnitChange = (value: any) => {
    setDurationUnit(value);
  }

  const handleDurationChange = (value: any) => {
    form.setFieldsValue({ duration: value });
  }

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    setPreview({
      previewImage: file.url || file.preview,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const onFinish = async (formValues: any) => {
    let request: AddCourseRequest = {
      ...formValues,
      startTime: formValues.startTime !== null ? format(formValues.startTime.toDate(), 'yyyy-MM-dd') : '',
      durationUnit: durationUnit
    }
    const { data } = await courseService.addCourse(request);
    if(!!onSuccess && !! data) {
      onSuccess(data);
    }
  }

  useEffect(() => {
    const fetchCourseTypes = async () => {
      const { data } = await courseService.getTypes();
      if (!!data) {
        setCourseTypes(data);
      }
    }
    const fetchCourseCode = async () => {
      const { data } = await courseService.getCode();
      if (!!data) {
        form.setFieldsValue({ uid: data });
      }
    }
    fetchCourseTypes();
    fetchCourseCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        labelCol={{ offset: 1 }}
        wrapperCol={{ offset: 1 }}
        onFinish={onFinish}
      >

        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[{ required: true }, { max: 100, min: 3 }]}
            >
              <Input type="text" placeholder="course name" />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Row gutter={[6, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Teacher"
                  name="teacherId"
                  rules={[{ required: true }]}
                  style={{ marginLeft: 5 }}
                >
                  <Select
                    placeholder="Select teacher"
                    notFoundContent={isTeacherSearching ? <Spin size="small" /> : null}
                    filterOption={false}
                    showSearch
                    onSearch={handleSearchTeacher}
                  >
                    {teachers.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                  <Select mode="multiple">
                    {courseTypes.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Course Code" name="uid" rules={[{ required: true }]}>
                  <Input
                    type="text"
                    placeholder="course code"
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[6, 16]} style={{ marginTop: 32 }}>
          <Col span={8}>
            <Form.Item name="startTime" label="Start Date">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => { return current && current < moment().endOf('day'); }}
              />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber<number>
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => +value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                style={{ width: '100%' }}
              >
              </InputNumber>
            </Form.Item>

            <Form.Item label="Student Limit" name="maxStudents" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Duration" name="duration" rules={[{ required: true }]}>
              <Input.Group compact style={{ display: 'flex' }}>
                <InputNumber min={0} style={{ flex: 1 }} onChange={handleDurationChange} />
                <Select defaultValue={DurationUnit.month} onChange={handleDurationUnitChange}>
                  <Option value={DurationUnit.hour}>hour</Option>
                  <Option value={DurationUnit.day}>day</Option>
                  <Option value={DurationUnit.week}>week</Option>
                  <Option value={DurationUnit.month}>month</Option>
                  <Option value={DurationUnit.year}>year</Option>
                </Select>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Description" name="detail"
              rules={[
                { required: true },
                {
                  min: 100,
                  max: 1000,
                  message: 'Description length must between 100 - 1000 characters.',
                },
              ]}
            >
              <TextArea placeholder="Course description" style={{ height: "293px" }} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ position: 'relative' }}>
            <UploadItem label="Cover" name="cover">
              <ImgCrop rotate aspect={16 / 9}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  headers={customHeaders}
                  onChange={(info) => {
                    const { status } = info.file;
                    if (status === 'done') {

                      form.setFieldsValue({ cover: info.file.response.url});
                    } else if (status === 'error') {
                      form.setFieldsValue({ cover: '' });
                    }
                    setIsUploading(status === 'uploading');
                    setFileList(info.fileList);
                  }}
                  onPreview={handlePreview}
                >
                  {fileList.length >= 1 ? null : (
                    <UploadInner>
                      <InboxOutlined />
                      <p>Click or drag file to this area to upload</p>
                    </UploadInner>
                  )}
                </Upload>
              </ImgCrop>
            </UploadItem>
            {isUploading && (
              <DeleteIcon
                onClick={() => {
                  setIsUploading(false);
                  setFileList([]);
                }}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                Create Course
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Modal
          visible={!!preview}
          title={preview?.previewTitle}
          footer={null}
          onCancel={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="example" style={{ width: '100%' }} src={preview?.previewImage} />
        </Modal>
      </Form>
    </>
  )
}