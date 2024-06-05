import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Drawer, Form, Input, notification, Popconfirm, Row, Select, Table} from "antd";
import axiosInstance from "../auth/authHeader";

import {CloudDownloadOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";

const Users = () => {
    const [data, setData] = useState([]);
    const [role, setRole] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpenDrawer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    // const API_URL = "http://localhost:8080";
    const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
    const [form] = Form.useForm();

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

    const getAllData = () => {
        axiosInstance.get(API_URL + "/users")
            .then(response => {
                    setData(response?.data?._embedded?.userDtoes);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getAllRoles = () => {
        axiosInstance.get(API_URL + "/role")
            .then(response => {
                    console.log("response", response)
                    // const roles = response?.data?._embedded?.rolesDTOes;
                    const roles = response?.data?.content;
                    setRole(roles);
                },

                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/users/" + id)
            .then(response => {

                    const {role, ...userData} = response?.data;
                    setDataById({...userData, role: role.map(role => role.id)});
                    form.setFieldsValue({...userData, role: role.map(role => role.id)});
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const openNotificationWithIcon = (type, messageTitle, description) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };
    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/users/" + id)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.')
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                })
    };

    const cancel = (e) => {
    }
    const addNewRecord = (values) => {

        let updatedRole = values.role.map((item) => {
            return {"id": item};
        });
        values.role = updatedRole
        axiosInstance.post(API_URL + "/users/signup", values)
            .then(response => {
                openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
                getAllData();
                setOpenDrawer(false);
                setDataById(null);
            }, error => {
                if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                    openNotificationWithIcon('error', 'Error '
                        , error?.response?.data?.apierror?.message
                        + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                } else {
                    openNotificationWithIcon('error',
                        'Error ~' + error?.response?.data?.apierror?.status
                        , error?.response?.data?.apierror?.message)
                }
            })
    };
    const updateRecordById = (data, id) => {
        let updatedRole = data.role.map((item) => {
            return {"id": item};
        });
        data.role = updatedRole
        axiosInstance.put(API_URL + "/users/" + id, data)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
                    getAllData();
                    setOpenDrawer(false);
                    setDataById(null);
                }
                , error => {
                    if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                        openNotificationWithIcon('error', 'Error '
                            , error?.response?.data?.apierror?.message
                            + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                    } else {
                        openNotificationWithIcon('error',
                            'Error ~' + error?.response?.data?.apierror?.status
                            , error?.response?.data?.apierror?.message)
                    }
                }
            );
    };
    const showUserDrawer = (id) => {
        setDataById(null);
        setOpenDrawer(true);
        form.resetFields();
        if (id === undefined) {
            setAddNewMode(true);
        } else {
            getDataById(id);
            setAddNewMode(false);
        }
    };

    const onSubmitClick = (values) => {
        if (addNewMode) {
            addNewRecord(values);
        } else {
            updateRecordById(values, dataById.id);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getAllData();
        getAllRoles();
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: roles => roles.map(role => role.name).join(', '),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a onClick={() => showUserDrawer(record.id)}>
                        <EditOutlined/>
                    </a>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}

                    <Divider type="vertical"/>
                           <Popconfirm
                               title="Delete the task"
                               description="Are you sure to delete this task?"
                               onConfirm={() => confirm(record.id)}
                               onCancel={cancel}
                               okText="Yes"
                               cancelText="No"
                           >
                    <a danger>
                         <DeleteOutlined/>
                    </a>
                </Popconfirm>

                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    {/*<a onClick={() => deleteById(record.id)}>Delete</a>*/}
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                </span>
            ),
        },
    ];
    return (
        <>
            {contextHolder}
            <Row justify="end" style={{marginBottom: 16}}>
                <Col>
                    <Button onClick={() => showUserDrawer(undefined)}>Add New Record</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Add New User"
                placement="right"
                onClose={() => setOpenDrawer(false)}
                visible={open}
            >
                {(addNewMode || dataById) && (
                    <Form
                        form={form} name="validateOnly"
                        layout="vertical"
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
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
                        <Form.Item
                            label="Role"
                            name="role"
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select"
                                options={role.map(role => ({label: role.name, value: role.id}))}
                            />
                        </Form.Item>
                        <Form.Item>
                            {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                            <SubmitButton form={form}>Submit</SubmitButton>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Users;
