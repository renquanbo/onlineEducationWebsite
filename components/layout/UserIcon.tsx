import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import userService from '../../app/services/userService';

function UserIcon() {
    const router = useRouter();

    const logout = async () => {
        const isLogout = await userService.logout();
        if(isLogout) {
            router.push('/login');
        }   
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={logout}>
                <LogoutOutlined />
                <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
            <Avatar icon={<UserOutlined />} />
        </Dropdown>
    )
}

export default UserIcon;