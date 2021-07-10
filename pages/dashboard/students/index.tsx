import { useEffect, useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { Table } from 'antd';

import router, { useRouter } from 'next/router';
import axios from "axios";

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
        key: 'area',
        dataIndex: 'area'
    },
    {
        title: 'Selected Curriculum',
        key: 'selectedCurriculum',
        dataIndex: 'selectedCurriculum'
    },
    {
        title: 'Student type',
        key: 'studentType',
        dataIndex: 'studentType'
    },
    {
        title: 'Join time',
        key: 'joinTime',
        dataIndex: 'joinTime'
    },
    {
        title: 'Action',
        key: 'action'
    }
]

type studentRecord = {
    id: number,
    name: string,
    area: string,
    email: string,
    selectedCurriculum: string,
    studentType: string,
    joinTime: string
}

function parseStudentListData(data: any) : studentRecord[]{
    // console.log(data)
    let records:studentRecord[]  = new Array<studentRecord>();
    for (let student of data.students) {
        let record:studentRecord = {
            id: student.id,
            name: student.name,
            area: student.country,
            email: student.email,
            selectedCurriculum: 'do it later ',
            studentType: 'type later',
            joinTime: student.createdAt
        }
        records.push(record);
        //console.log(student);
    }
    return records;
}

const Students = () => {

    const router = useRouter();

    const [studentRecords, setStudentRecords] = useState<studentRecord[]>([]);

    useEffect(() => {
        if(!localStorage.getItem('token')) {
            router.push('/login');
        } else {
            axios({
                method: 'get',
                url: 'https://cms.chtoma.com/api/students?limit=20&page=1',
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
            })
            .then((response) => {
                //console.log(response);
                let parsedData = parseStudentListData(response.data.data);
                setStudentRecords(parsedData);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    })

    return(
        <AppLayout>
            <Table
                columns={columns}
                dataSource={studentRecords} 
            ></Table>
        </AppLayout>
    )
}

export default Students;