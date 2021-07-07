import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';
import { Form, Input, Button, Radio, Checkbox, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useRouter } from 'next/router'

import axios from 'axios';

const {Title} = Typography;

const StyledTitle = styled(Title)`
    text-align: center;
    margin:0.5em 0px;
`;

const StyledButton = styled(Button) `
    width: 100%;
`;

type LogInfo = {
    email: string,
    password: string,
    role: string,
    remember: boolean
}

function Login() {
    const router = useRouter()
    const onFinish = (values: LogInfo) => {
        // use axios to post the login request
        console.log(values);
        axios.post('https://cms.chtoma.com/api/login',{
            email: values.email,
            password: values.password,
            role: values.role
        })
        router.push("/dashboard");
        
    };

    return (
        <div>
            <StyledTitle>COURSE MANAGEMENT ASSISTANT</StyledTitle>
            <Row justify="center">
                <Col span={8}>
                    <Form 
                        name="login"
                        initialValues={{ remember: true , role: 'student'}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="role"
                        >
                            <Radio.Group>
                                <Radio.Button value="student">Student</Radio.Button>
                                <Radio.Button value="teacher">Teacher</Radio.Button>
                                <Radio.Button value="manager">Manager</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
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
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Please input email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { 
                                    required: true, 
                                    message: '\'password\' is required' 
                                },
                                {
                                    min: 4,
                                    message: '\'password\' must be between 4 and 16 characters',                                   
                                },
                                {
                                    max: 16,
                                    message: '\'password\' must be between 4 and 16 characters'
                                }
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Please input password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <StyledButton type="primary" htmlType="submit" className="login-form-button">
                                Sign in
                            </StyledButton>
                        </Form.Item>
                        <Space>
                            <span>No account?</span>
                            <a href="/signup">Sign up</a>
                        </Space>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Login