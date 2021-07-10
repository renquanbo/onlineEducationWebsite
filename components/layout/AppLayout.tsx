import Image from 'next/image'
import Link from 'next/link';
import { Layout, Menu, Row } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    MessageOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined, 
    ReadOutlined, 
    SolutionOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';

import UserIcon from '../../components/layout/UserIcon';

const { Header, Sider, Content } = Layout;

const CollapsedMenuIcon = styled.span`
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
        color: #1890ff;
    }
`;

const Logo = styled.div`
    height: 32px;
    margin: 16px;
`;

const StyledContent = styled(Content)`
    margin: 16px;
    background-color: #fff;
    padding: 16px;
    min-height: auto;
`;

const StyledHeader = styled(Header)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const AppLayout =  (props: React.PropsWithChildren<any>) => {

    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{height: '100vh'}}>
        <Sider collapsible collapsed={collapsed} >
            <Logo>
                {collapsed ? <Image src="/bcd-logo-blue-small.png" alt="logo" width={48} height={32} ></Image> : <Image src="/bcd-logo-blue.svg" alt="logo" width={168} height={32} ></Image>}
            </Logo>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                    <Link href="/dashboard">
                        Overview
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<SolutionOutlined />}>
                    <Link href="/dashboard/students">
                        Student
                    </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<DeploymentUnitOutlined />}>
                    Teacher
                </Menu.Item>
                <Menu.Item key="4" icon={<ReadOutlined />}>
                    Course
                </Menu.Item>
                <Menu.Item key="5" icon={<MessageOutlined />}>
                    Message
                </Menu.Item>
            </Menu>
        </Sider>

        <Layout >
            <StyledHeader>
                <CollapsedMenuIcon onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                </CollapsedMenuIcon>
                <Row align="middle">
                    <UserIcon />
                </Row>
            </StyledHeader>
            <StyledContent>
                {children}
            </StyledContent>
        </Layout>
    </Layout>
    )
}

export default AppLayout;