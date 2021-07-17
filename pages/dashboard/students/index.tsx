import { useEffect, useState, useRef, ChangeEvent } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { Space, Table, Row, Col, Button, Input, Form, Select,Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';
import studentService from "../../../app/services/studentService";
import { AddStudentRequest, Course, Student, StudentType, UpdateStudentRequest } from "../../../app/model/student";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
// import areaService from "../../../app/services/areaService";
// import { Country } from "../../../app/model/country";
import { getAreas } from "../../../app/util/getAreas";
import Link from "next/link";
import { debounce } from "lodash";

const { Search } = Input;
const { Option } = Select;

const Students = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditingStudent, setIsEditingStudent] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student| null>(null);
    const [total, setTotal] = useState(0);
    const [students, setStudents] = useState<Student[]>([]);
    const [paginator, setPaginator] = useState({limit: 20, page: 1});
    // const [areas, setAreas] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const columns:ColumnType<Student>[] = [ 
        {
            title: 'No.',
            key: 'id',
            render: (text: string,record: any,index:number) => (index + 1),
        },
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a: Student, b: Student) => (a.name.charCodeAt(0) - b.name.charCodeAt(0)),
            // eslint-disable-next-line react/display-name
            render: (text,record: Student,index) => 
                (<Link href="#">{record.name}</Link>)
        },
        {
            title: 'Area',
            key: 'country',
            dataIndex: 'country',
            filters: getAreas().map((item) => ({text: item.en, value:item.en})),
            onFilter: (value: string | number | boolean, record: Student) => record.country === value,
            width: '10%'
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email'
        },
        {
            title: 'Selected Curriculum',
            key: 'courses',
            dataIndex: 'courses',
            width: '25%',
            render: (courses: Course[]) => courses.map((item)=> item.name).join(",")
        },
        {
            title: 'Student type',
            key: 'type',
            dataIndex: 'type',
            filters: [
                { text: 'developer', value: 'developer' },
                { text: 'tester', value: 'tester'}
            ],
            onFilter: (value: string | number | boolean, record: Student) => record.type.name === value,
            render: (type: StudentType) => ( type?.name ),
        },
        {
            title: 'Join time',
            key: 'createdAt',
            dataIndex: 'createdAt',
            render: (createdAt: string) => formatDistanceToNow(new Date(createdAt))
        },
        {
            title: 'Action',
            key: 'action',
            // eslint-disable-next-line react/display-name
            render: (text,record,index) => (
                <Space size="middle">
                    <a onClick={() => handleEditButtonClick(record)}>Edit</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        // async function fetchAreas() {
        //     const { data } = await areaService.getAreas();
        //     if(!!data) {
        //         setAreas(data.countries);
        //     }
        // }
        async function fetchStudentRecords() {
            setLoading(true);
            const { data } = await studentService.getStudents(paginator.limit, paginator.page);
            if(!!data) {
                setStudents(data.students);
                setTotal(data.total);
            }
            setLoading(false);
        }
        // fetchAreas();
        fetchStudentRecords();
    },[paginator]);

    async function queryStudents(value: string) {
        setLoading(true);
        const { data } = await studentService.getStudentsByName(paginator.limit, paginator.page, value);
        if(!!data) {
            setStudents(data.students);
            setTotal(data.total);
        }
        setLoading(false);
    }

    const debouncedQuery = useRef(debounce(queryStudents, 1000));

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedQuery.current(event.target.value);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
            if(isEditingStudent) {
                let updateStudentRequest: UpdateStudentRequest = {
                    id: editingStudent!.id,
                    name: values.name,
                    email: values.email,
                    country: values.area,
                    type: values.type === 'tester' ? 1 : 2
                }
                studentService.updateStudent(updateStudentRequest);
            } else {
                let addStudentRequest:AddStudentRequest = {
                    name: values.name,
                    email: values.email,
                    country: values.area,
                    type: values.type === 'tester' ? 1 : 2 
                }
                studentService.addStudent(addStudentRequest);
            }
            form.resetFields();
            setEditingStudent(null); 
            setIsModalVisible(false);
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
        
        
    };

    const handleEditButtonClick = (record: Student) => {
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            area: record.country,
            studentType: record.type.name
        })
        setEditingStudent(record);
        setIsEditingStudent(true);
        setIsModalVisible(true);
    }

    return(
        <AppLayout>
            <Row style={{marginBottom:'16px'}}>
                <Col span={4}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingStudent(null); 
                            form.resetFields(); 
                            setIsEditingStudent(false); 
                            setIsModalVisible(true);
                        }}
                    >
                        Add
                    </Button>
                </Col>
                <Col span={7} offset={13}>
                    <Search
                        placeholder="Search by name"
                        // 这里有bug 如果在一秒内触发了search事件，那么onChange事件必定会触发，也就是说会在一秒内查询两次学生数据 
                        // 解决办法应该是只有一个触发条件，可以放在state里，让onSearch和onChange同时更改state，然后用另一个hook函数来监听，如有更改就查询
                        onSearch={(value) => { queryStudents(value) }}
                        onChange= {handleSearchChange}
                    />
                </Col>
            </Row>
            <Table
                rowKey='id'
                columns={columns}
                dataSource={students} 
                pagination={{total: total, current:paginator.page, pageSize: paginator.limit}}
                onChange = {
                    ({current, pageSize}) => {
                        setPaginator({ page: current as number, limit: pageSize as number });
                    }
                }
                loading={loading}
            ></Table>
            <Modal 
                centered={true}
                onCancel={handleCancel}
                onOk={handleOk}
                visible={isModalVisible}
                title={isEditingStudent? 'Edit Student' : 'Add Student'}
                footer={
                    [<Button key="ok" type="primary" onClick={handleOk}>
                        {isEditingStudent ? 'Update' : 'Add'}
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
                        <Input placeholder="student name"></Input>
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
                        label="Area: "
                        name="area"
                        rules={[{ required: true, message: '\'area\' is required' }]}
                    >
                        <Select>
                            {getAreas().map((item) => (
                                <Option value={item.en} key={item.id}>{item.en}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Student Type: "
                        name="studentType"
                        rules={[{ required: true, message: '\'student type\' is required' }]}
                    >
                        <Select>
                            <Option value="tester">Tester</Option>
                            <Option value="developer">Developer</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    )
}

export default Students;