import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Popconfirm, Row, Select, Space, Input, Slider } from "antd";
import Search from "antd/lib/input/Search";
import Modal from "antd/lib/modal/Modal";
import Table, { ColumnType } from 'antd/lib/table';
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { SkillDes } from "../../../../app/lib/constant";
import { phone } from "../../../../app/lib/constant/rule";
import { TeachersResponse, Teacher, Skill, UpdateTeacherRequest, AddTeacherRequest, TeacherRequest } from "../../../../app/model/teacher";
import storage from "../../../../app/services/storage";
import teacherService from "../../../../app/services/teacherService";
import { useListEffect } from "../../../../components/custom-hooks/list-effect";
import AppLayout from "../../../../components/layout/AppLayout";

const { Option } = Select;

const prefixSelector = (
  <Form.Item name="prefix" initialValue="86" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

const Teachers = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { data, paginator, total, loading, modifyDataSuccessTimes,setPaginator, setLoading, setData, setTotal, setModifyDataSuccessTimes} = useListEffect
    <TeacherRequest, TeachersResponse, Teacher>
    (teacherService.getTeachers.bind(teacherService), "teachers", true);

  const columns: ColumnType<Teacher>[] = [
    {
      title: 'No.',
      key: 'id',
      render: (text: string, record: any, index: number) => (index + 1),
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a: Teacher, b: Teacher) => (a.name.charCodeAt(0) - b.name.charCodeAt(0)),
      // eslint-disable-next-line react/display-name
      render: (text, record: Teacher, index) =>
        (<Link href={router.pathname + '/' + record.id}>{record.name}</Link>)
    },
    {
      title: 'Country',
      key: 'country',
      dataIndex: 'country',
      filters: storage.getAreas()?.map((item) => ({ text: item.en, value: item.en })),
      onFilter: (value, record: Teacher) => record.country === value,
      width: '10%'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Skill',
      key: 'skill',
      dataIndex: 'skills',
      render: (skills: Skill[]) => (skills.map(item => item.name)).join(',')
    },
    {
      title: 'Course Amount',
      dataIndex: 'courseAmount',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (text, record, index) => (
        <Space size="middle">
          <a onClick={() => handleEditButtonClick(record)}>Edit</a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteButtonClick(record)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  async function queryTeachers(value: string) {
    setLoading(true);
    const { data } = await teacherService.getTeachers({
      limit: paginator.limit,
      page: paginator.page,
      query: value
    });
    if (!!data) {
      setData(data.teachers);
      setTotal(data.total);
    }
    setLoading(false);
  }

  const debouncedQuery = useRef(debounce(queryTeachers, 1000));

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedQuery.current(event.target.value);
  }

  const handleEditButtonClick = (record: Teacher) => {
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      country: record.country,
      phone: record.phone,
      skills: record.skills || [{ name: '', level: 2 }],
    })
    setEditingTeacher(record);
    setIsEditingTeacher(true);
    setIsModalVisible(true);
  }

  const handleDeleteButtonClick = (record: Teacher) => {
    teacherService.deleteTeacher(record.id)
      .then(() => setModifyDataSuccessTimes(modifyDataSuccessTimes + 1));
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditingTeacher) {
          let updateTeacherRequest: UpdateTeacherRequest = {
            ...values,
            id: editingTeacher.id,
          }
          teacherService.updateTeacher(updateTeacherRequest)
            .then(() => { setModifyDataSuccessTimes(modifyDataSuccessTimes + 1) });
        } else {
          let addTeacherRequest: AddTeacherRequest = {
            ...values
          }
          teacherService.addTeacher(addTeacherRequest)
            .then(() => { setModifyDataSuccessTimes(modifyDataSuccessTimes + 1) });;
        }
        form.resetFields();
        setEditingTeacher(null);
        setIsModalVisible(false);
      })
  };


  return (
    <AppLayout>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTeacher(null);
              form.resetFields();
              setIsEditingTeacher(false);
              setIsModalVisible(true);
            }}
          >
            Add
          </Button>
        </Col>
        <Col span={7} offset={13}>
          <Search
            placeholder="Search by name"
            onSearch={(value) => { queryTeachers(value) }}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={data}
        pagination={{ total: total, current: paginator.page, pageSize: paginator.limit }}
        onChange={
          ({ current, pageSize }) => {
            setPaginator({ limit: pageSize, page: current});
          }
        }
        loading={loading}
      ></Table>
      <Modal
        centered={true}
        onCancel={handleCancel}
        onOk={handleOk}
        visible={isModalVisible}
        title={isEditingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        footer={
          [<Button key="ok" type="primary" onClick={handleOk}>
            {isEditingTeacher ? 'Update' : 'Add'}
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>]
        }
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ offset: 1 }}
        >
          <Form.Item
            label="Name: "
            name="name"
            rules={[{ required: true, message: '\'name\' is required' }]}
          >
            <Input placeholder="teacher name"></Input>
          </Form.Item>
          <Form.Item
            label="Email: "
            name="email"
            rules={[
              {
                required: true,
                message: '\'email\' is required'
              },
              {
                type: 'email',
                message: '\'email\' is not a valid email'
              }
            ]}
          >
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item
            label="Country: "
            name="country"
            rules={[{ required: true, message: '\'country\' is required' }]}
          >
            <Select>
              {storage.getAreas()?.map((item) => (
                <Option value={item.en} key={item.id}>{item.en}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }, { pattern: phone }]}>
            <Input addonBefore={prefixSelector} placeholder="mobile phone" />
          </Form.Item>
          <Form.Item label={<b>Skills</b>}> </Form.Item>
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row align="middle" justify="space-between" key={field.name}>
                    <Col span={7}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input style={{ textAlign: 'right' }} />
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'level']}
                        fieldKey={[field.fieldKey, 'level']}
                        initialValue={2}
                      >
                        <Slider
                          step={1}
                          min={1}
                          max={5}
                          tipFormatter={(value: number) => SkillDes[value]}
                        />
                      </Form.Item>
                    </Col>

                    <Col style={{ alignSelf: 'stretch' }}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ margin: '10px 0 0 10px', color: 'red' }}
                        />
                      )}
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Skill
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </AppLayout>
  )
}

export default Teachers;