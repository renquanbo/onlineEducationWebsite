import React from "react";
import {
    DashboardOutlined,
    DeploymentUnitOutlined, 
    ReadOutlined, 
    SolutionOutlined,
    TeamOutlined,
    ProjectOutlined,
    FileAddOutlined,
    EditOutlined,
    MessageOutlined
} from '@ant-design/icons';

export interface MenuItem {
    label: string;
    icon: React.ReactNode
    key: string;
    subMenu: MenuItem[] | null
}

class MenuConfig {

    menus: MenuItem[];

    constructor() {
        this.menus = [
            {
                label: 'Overview',
                key: '/dashboard',
                icon: <DashboardOutlined />,
                subMenu: null
            },
            {
                label: 'Student',
                key: '/dashboard/students',
                icon: <SolutionOutlined />,
                subMenu: [
                    {
                        label: 'Student List',
                        key: '/dashboard/students',
                        icon: <TeamOutlined />,
                        subMenu: null
                    }
                ]
            },
            {
                label: 'Teacher',
                key: '/dashboard/teachers',
                icon: <DeploymentUnitOutlined />,
                subMenu: [
                    {
                        label: 'Teacher List',
                        key: '/dashboard/teachers',
                        icon: <TeamOutlined />,
                        subMenu: null
                    }
                ]
            },
            {
                label: 'Course',
                key: '/dashboard/courses',
                icon: <ReadOutlined />,
                subMenu: [
                    {
                        label: 'All courses',
                        key: '/dashboard/courses',
                        icon: <ProjectOutlined />,
                        subMenu: null
                    },
                    {
                        label: 'Add courses',
                        key: '/dashboard/courses/add-course',
                        icon: <FileAddOutlined />,
                        subMenu: null
                    },
                    {
                        label: 'Edit courses',
                        key: '/dashboard/courses/edit-course',
                        icon: <EditOutlined />,
                        subMenu: null
                    },
                ]
            },
            {
                label: 'Message',
                key: '/dashboard/message',
                icon: <MessageOutlined />,
                subMenu: null
            }
        ]
    }
}

const menuConfig = new MenuConfig();
export default menuConfig;