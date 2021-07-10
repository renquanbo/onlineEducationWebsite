import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import router, { useRouter } from 'next/router'

import axios from 'axios';

function UserIcon() {
    const router = useRouter();

    const logout = () => {

        axios({
            method: 'post',
            url: 'https://cms.chtoma.com/api/logout',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
        })
        .then((response)=>{
            console.log(response);
            localStorage.clear();
            router.push('/login');
        })
        .catch((error) => {
            console.log(error);
        })
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