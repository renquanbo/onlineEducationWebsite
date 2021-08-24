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
import { getBreadcrumbs, getDefaultKeys, getMenusByRole, MenuItem } from '../../app/lib/constant/menuConfig';
import AppBreadCrumb from './AppBreadCrumb';
import { Role } from '../../app/model/role';
import MessagePanel from './MessagePanel';

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

function renderMenuItems(menus: MenuItem[] | undefined): JSX.Element[] {
  return menus!.map((item) => {
    if (item.subMenu !== null) {
      return (
        <SubMenu key={item.key} icon={item.icon} title={item.label}>
          {renderMenuItems(item.subMenu)}
        </SubMenu>
      )
    } else {
      return (
        <Menu.Item key={item.key} icon={item.icon} title={item.label}>
          <Link href={item.path}>
            {item.label}
          </Link>
        </Menu.Item>
      )
    }
  })
}

function getUserRole(path: string): Role {
  return path.split('/')[2] as Role
}

const AppLayout = (props: React.PropsWithChildren<any>) => {

  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const generatedMenus = getMenusByRole(getUserRole(router.pathname));
  const menuItems = renderMenuItems(generatedMenus);
  const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(generatedMenus,router.pathname);
  const breadcrumbs = getBreadcrumbs(generatedMenus,router.pathname);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible collapsed={collapsed} >
        <Logo>
          {collapsed ? <Image src="/bcd-logo-blue-small.png" alt="logo" width={48} height={32} ></Image> : <Image src="/bcd-logo-blue.svg" alt="logo" width={168} height={32} ></Image>}
        </Logo>
        <Menu theme="dark" mode="inline"
          defaultSelectedKeys={[defaultSelectedKeys]}
          defaultOpenKeys={[defaultOpenKeys]}
        >
          {menuItems}
        </Menu>
      </Sider>

      <Layout style={{ width: '100%', overflowX: 'hidden' }} id="contentLayout">
        <StyledHeader>
          <CollapsedMenuIcon onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapsedMenuIcon>
          <Row align="middle">
            <MessagePanel />
            <UserIcon />
          </Row>
        </StyledHeader>

        <AppBreadCrumb breadcrumbs={breadcrumbs}></AppBreadCrumb>

        <StyledContent>
          {children}
        </StyledContent>
      </Layout>
    </Layout>
  )
}

export default AppLayout;