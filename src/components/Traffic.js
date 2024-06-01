import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Drawer, Form, Input, notification, Popconfirm, Row, Select, Table} from "antd";
import axiosInstance from "../auth/authHeader";

const Traffics = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = "http://localhost:8080";
    const [trForm] = Form.useForm();

    const SubmitButton = ({form: trafficForm, children}) => {
        const [submittable, setSubmittable] = React.useState(false);
        const values = Form.useWatch([], trafficForm);
        React.useEffect(() => {
            trafficForm.validateFields({
                validateOnly: true,
            })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [trafficForm, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };

    const getAllData = () => {
        axiosInstance.get(API_URL+"/traffics")
            .then(response => {
                    setData(response?.data?._embedded?.trafficDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/traffics/" + id)
            .then(response => {
                    setDataById(response.data)
                    response.data.sites=response?.data?.sites?.id;
                    trForm.setFieldsValue(response.data);
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
        axiosInstance.delete(API_URL + "/traffics/" + id)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.')
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                })
    };

    const cancel = (e) => {
    };
    const addNewRecord = (values) => {
        // Ensure only specific members are accepted in the values object
        const acceptedMembers = ['eightTimeTraffic', 'fortiethTimeTraffic', 'eighteenTimeTraffic'];
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(([key]) => acceptedMembers.includes(key))
        );

        // Validate input values to have two decimal places
        for (const [key, value] of Object.entries(filteredValues)) {
            if (acceptedMembers.includes(key) && !/^\d+(\.\d{2})?$/.test(value)) {
                openNotificationWithIcon('error', 'Error', `Please enter a valid number with places for ${key}`);
                return;
            }
        }
        axiosInstance.post(API_URL + "/traffics", values)
            .then(response => {
                openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
                getAllData();
                setOpen(false);
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
        axiosInstance.put(API_URL + "/traffics/" + id, data)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
                    getAllData();
                    setOpen(false);
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
    const showDrawer = (id) => {
        setDataById(null);
        setOpen(true);
        trForm.resetFields();
        if (id === undefined) {
            setAddNewMode(true);
        } else {
            setDataById(null);
            getDataById(id);
            setAddNewMode(false);
        }
    };

    const [sites, setSites] = useState([]);
    const getAllSites = () => {
        axiosInstance.get(API_URL + "/sites")
            .then(response => {
                    console.log("response", response)
                    const s = response?.data?._embedded?.sitesDtoses;
                    setSites(s);
                },

                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const onSubmitClick = (values) => {

        values.sites = {"id": values.sites}
        console.log("values=",values)
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
        getAllSites();
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Sites',
            dataIndex: 'sites',
            key: 'sites',
            render: sites=>sites?.name,
        },
        {
            title: 'At 8 O\'clock',
            dataIndex: 'eightTime',
            key: 'eightTime',
        },
        {
            title: 'TotalTimeTraffic',
            dataIndex: 'eightTimeTraffic',
            key: 'eightTimeTraffic',
        },
        {
            title: 'At 14 O\'clock',
            dataIndex: 'fortiethTime',
            key: 'fortiethTime',
        },
        {
            title: 'TotalTimeTraffic',
            dataIndex: 'fortiethTimeTraffic',
            key: 'fortiethTimeTraffic',
        },
        {
            title: 'At 18 O\'clock',
            dataIndex: 'eighteenTime',
            key: 'eighteenTime',
        },
        {
            title: 'TotalTimeTraffic',
            dataIndex: 'eighteenTimeTraffic',
            key: 'eighteenTimeTraffic',

        },
         {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                const date = new Date(text);
                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',

                    minute: '2-digit',
                    second: '2-digit'
                };
                const formattedDate = date.toLocaleDateString('en-US', options);
                return <span>{formattedDate}</span>;
            },

        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a onClick={() => showDrawer(record.id)}>Update</a>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}

                    <Divider type="vertical"/>
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={()=>confirm(record.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
    <Button danger>Delete</Button>
  </Popconfirm>

                    {/* eslint-disable jsx-a11y/anchor-is-valid*/}
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
                    <Button onClick={() => showDrawer(undefined)}>Add New Traffic</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Basic Drawer"
                placement="right"
                onClose={() => setOpen(false)}
                visible={open}
            >
                {(addNewMode || dataById) && (
                    <Form
                        form={trForm} name="validateOnly"
                        layout="vertical"
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="Sites"
                            name="sites"
                        >
                            <Select
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select"
                                options={sites?.map(sites => ({label: sites.name, value: sites.id}))}
                            />
                        </Form.Item>
                        <Form.Item
                            label="eightTimeTraffic"
                            name="eightTimeTraffic"
                            rules={[{required: true, message: 'Please input 8:00 TimeTraffic!'}]}
                        >
                                <Input/>
                        </Form.Item>
                        <Form.Item
                            label="fortiethTimeTraffic"
                            name="fortiethTimeTraffic"
                            rules={[{required: true, message: 'Please input 14:00 TimeTraffic!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="eighteenTimeTraffic"
                            name="eighteenTimeTraffic"
                            rules={[{required: true, message: 'Please input 18:00 TimeTraffic!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="remark"
                            name="remark"
                            rules={[{required: true, message: 'Please input remark!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                            <SubmitButton form={trForm}>Submit</SubmitButton>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Traffics;
