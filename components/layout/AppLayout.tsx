import Image from 'next/image'
import Link from 'next/link';
import { Layout, Menu, Row } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';

import UserIcon from '../../components/layout/UserIcon';
import { useRouter } from 'next/router';
import menuConfig, { MenuItem } from '../../app/model/menuConfig';
import AppBreadCrumb from './AppBreadCrumb';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

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

const getDefaultSelectedKeys = (path: string) => {
    let index = path.indexOf('[id]');
    if(index !==  -1) {
        return path.slice(0, index - 1);
    }
    return path;
}

const getDefaultOpenKeys = (path: string) => {
    let currentPath = path;
    let index = path.indexOf('[id]');
    // remove [id] params
    if(index !==  -1) {
        currentPath = path.slice(0, index - 1);
    }
    // 如果包含三级路由
    if((currentPath.match(/\//g) || []).length > 2) {
        // 去掉最后一级路由
        currentPath = currentPath.slice(0, currentPath.lastIndexOf('/'));
    }
    return currentPath;
}

function renderMenuItems (menus: MenuItem[]): JSX.Element[] {
    return menus.map((item) => {
        if (item.subMenu !== null) {
            return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {renderMenuItems(item.subMenu)}
                </SubMenu>
            )
        } else {
            return (
                <Menu.Item key={item.key} icon={item.icon} title={item.label}>
                    <Link href={item.key}>
                        {item.label}
                    </Link>
                </Menu.Item>
            )
        }
    })
}


const AppLayout =  (props: React.PropsWithChildren<any>) => {

    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const menuItems = renderMenuItems(menuConfig.menus);

    return (
        <Layout style={{height: '100vh'}}>
            <Sider collapsible collapsed={collapsed} >
                <Logo>
                    {collapsed ? <Image src="/bcd-logo-blue-small.png" alt="logo" width={48} height={32} ></Image> : <Image src="/bcd-logo-blue.svg" alt="logo" width={168} height={32} ></Image>}
                </Logo>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[getDefaultSelectedKeys(router.pathname)]} defaultOpenKeys={[getDefaultOpenKeys(router.pathname)]}>
                    {menuItems}
                </Menu>
            </Sider>

            <Layout style={{width:'100%', overflowX:'hidden'}}>
                <StyledHeader>
                    <CollapsedMenuIcon onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </CollapsedMenuIcon>
                    <Row align="middle">
                        <UserIcon />
                    </Row>
                </StyledHeader>
                <AppBreadCrumb></AppBreadCrumb>
                <StyledContent>

                    {children}
                </StyledContent>
            </Layout>
        </Layout>
    )
}

export default AppLayout;