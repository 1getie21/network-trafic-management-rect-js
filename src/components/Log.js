import React from 'react';
import {Button, Form, Input, InputNumber, Space} from 'antd';

const App = () => {
    const SubmitButton = ({form, children}) => {
        const [submittable, setSubmittable] = React.useState(false);
        const values = Form.useWatch([], form);
        React.useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };
    const [form] = Form.useForm();
    return (

        <Form
            form={form} name="validateOnly"
            layout="vertical"
        >
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{required: true, message: 'Please input first name!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{required: true, message: 'Please input last name!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[{required: true, message: 'Please input email!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Username"
                name="username"
                rules={[{required: true, message: 'Please input username!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input username!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item>
                {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                <SubmitButton form={form}>Submit</SubmitButton>
            </Form.Item>
        </Form>
    );
};

export default App;
