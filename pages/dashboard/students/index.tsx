import { useEffect, useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { Table } from 'antd';
import studentService from "../../../app/services/studentService";
import { Course, Student, StudentType } from "../../../app/model/student";


const Students = () => {
    const [total, setTotal] = useState(0)
    const [students, setStudents] = useState<Student[]>([]);
    const [paginator, setPaginator] = useState({limit: 20, page: 1})

    const columns = [ 
        {
            title: 'No.',
            key: 'id',
            dataIndex: 'id'
        },
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: 'Area',
            key: 'country',
            dataIndex: 'country'
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
            render: (courses: Course[]) => courses.map((item)=> item.name).join(",")
        },
        {
            title: 'Student type',
            key: 'type',
            dataIndex: 'type',
            render: (type: StudentType) => ( type?.name )
        },
        {
            title: 'Join time',
            key: 'createAt',
            dataIndex: 'createAt'
        },
        {
            title: 'Action',
            key: 'action'
        }
    ]

    useEffect(() => {
        async function fetchStudentRecords() {
            const { data } = await studentService.getStudents(paginator.limit,paginator.page);
            if(!!data) {
                setStudents(data.students);
                setTotal(data.total);
            }
        }
        fetchStudentRecords();
    },[paginator]);

    return(
        <AppLayout>
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
            ></Table>
        </AppLayout>
    )
}

export default Students;