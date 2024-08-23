import React, {useEffect, useState} from 'react';
import {
    Button,
    Tooltip,
    Col,
    Divider,
    DatePicker,
    Drawer,
    Form,
    Input,
    notification,
    Popconfirm,
    Row,
    Select, Collapse,
    Table
} from "antd";
import axiosInstance from "../auth/authHeader";

import AuthService from "../auth/AuthService ";
import {CloudDownloadOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";


const {RangePicker} = DatePicker; 

const SixMCList = () => {
    const logedInUser = AuthService.getCurrentUser();
    const listOfRoles = AuthService?.getRoles();

    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();

   const API_URL = "http://localhost:7070";
  // const API_URL = "http://10.10.10.204:8080/TeamOpsSystem-0.0.1-SNAPSHOT";

    const [trForm] = Form.useForm();
    const [date, setDate] = useState('');

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
        axiosInstance.get(API_URL + "/sixmclist")
            .then(response => {
                    setData(response?.data?.content);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/sixmclist/" + id)
            .then(response => {
                    setDataById(response.data);
                    response.data.sites = response?.data?.sites?.id;
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


    const addNewRecord = (values) => {

        axiosInstance.post(API_URL + "/sixmclist", values)
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
        axiosInstance.put(API_URL + "/sixmclist/" + id, data)
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
        console.log("id=", id)
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
                    console.log("sitesDtoses", response)
                    const s = response?.data?._embedded?.sitesDtoses;
                    setSites(s);
                },

                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };

    const onSearchSubmitClick = (values) => {
        const fromDate = values.from[0].format('YYYY-MM-DD');
        const toDate = values.from[1].format('YYYY-MM-DD');
        setDate('/' + fromDate + '/' + toDate);
        axiosInstance.get(`${API_URL}/sixmclist/${fromDate}/${toDate}`)
            .then(response => {
                setData(response?.data?._embedded?.sixMCListDtoses);
                setLoading(false);
            }, error => {
                console.log(error)
            })
            .catch(error => {
                setLoading(false);
                openNotificationWithIcon('error', 'Error', error?.message);
            });

    };


    const onSearchFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onSubmitClick = (values) => {
        values.sites = {"id": values.sites}
        console.log("values=", values)
        if (addNewMode) {
            addNewRecord(values);
        } else {
            console.log("undefined")
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
    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/sixmclist/" + id)
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

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },


        {
            title: 'Sites',
            dataIndex: 'sites',
            key: 'sites',
            render: sites => sites?.name,
        },

        {
            title: 'Data Center',
            dataIndex: 'datacenter',
            key: 'datacenter',
        },
        {
            title: 'Fiber',
            dataIndex: 'fiber',
            key: 'fiber',
        },
        {
            title: 'Rack',
            dataIndex: 'rack',
            key: 'rack',
        },

        {
            title: 'Opd',
            dataIndex: 'opd',
            key: 'opd',
        },

        {
            title: 'Switch',
            dataIndex: 'switch',
            key: 'switch',
        },

        {
            title: 'T9140',
            dataIndex: 't9140',
            key: 't9140',
        },

        {
            title: 'Server',
            dataIndex: 'server',
            key: 'server',


        },
        {
            title: 'Routine',
            dataIndex: 'routine',
            key: 'routine',

        },

        {
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
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Tooltip title="Update Recored">
                    <a onClick={() => showDrawer(record.id)}>
                        <EditOutlined style={{fontSize: '16px'}}/>
                    </a>
                        </Tooltip>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}

                    <Divider type="vertical"/>

                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => confirm(record.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Task">
                        <a danger>
                            <DeleteOutlined style={{fontSize: '16px', color: "red"}}/>
                        </a>
                            </Tooltip>
                      </Popconfirm>
                    {/*<a onClick={() => deleteById(record.id)}>Delete</a>*/}
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                                    </span>
            ),
        },
    ];
    return (
        <>
            {contextHolder}

            <Row justify="space-between" style={{marginBottom: '4px'}}>
                <Col span={14}>
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: 'Filter By Date Range',
                                children: (
                                    <Form
                                        name="validateOnly"
                                        layout="horizontal"
                                        onFinish={onSearchSubmitClick}
                                        onFinishFailed={onSearchFinishFailed}
                                    >
                                        <Row justify="start"> {/* Align items to the start */}
                                            <Col span={10}>
                                                <Form.Item
                                                    name="from"
                                                    rules={[
                                                        {
                                                            type: 'array',
                                                            required: true,
                                                            message: 'Please select the date range!'
                                                        }
                                                    ]}
                                                >
                                                    <RangePicker/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}></Col>
                                            <Col span={6}>
                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit">Submit</Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                </Col>
                <Col span={5}> {/* Center aligns content */}
                    <Form.Item name="download file">
                        <Tooltip title="Download File">
                            {listOfRoles && listOfRoles.includes('ROLE_ADMIN') ? (
                                <a target="_blank" href={`${API_URL}/api/pdf/sixmclist${date}?userName=ROLE_ADMIN`}>
                                    <CloudDownloadOutlined style={{fontSize: '30px'}}/>
                                </a>
                            ) : (
                                <a target="_blank"
                                   href={API_URL + "/api/pdf/sixmclist" + date + '?userName=' + logedInUser?.username}>
                                    <CloudDownloadOutlined style={{fontSize: '30px'}}/>
                                </a>
                            )}
                        </Tooltip>
                    </Form.Item>
                </Col>
                <Col
                    span={5}></Col> {/* This empty column ensures space between the Download File button and the right edge of the row */}
            </Row>

            <Row justify="end" style={{marginBottom: 16}}>
                <Col>
                    <Button onClick={() => showDrawer(undefined)}>Add New Record</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Add New Report"
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
                            rules={[{required: true, message: 'Please input site name!'}]}
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


                        <Form.Item label="datacenter" name="datacenter">
                            <Select
                                showSearch
                                placeholder="Select a datacenter"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Clean',
                                        label: 'Clean',
                                    },
                                    {
                                        value: 'Dirt',
                                        label: 'Dirt',
                                    },
                                    {
                                        value: 'cooling condition',
                                        label: 'cooling condition',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="fiber" name="fiber">
                            <Select
                                showSearch
                                placeholder="Select a fiber"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Labeled',
                                        label: 'Labeled',
                                    },
                                    {
                                        value: 'Transmission loss',
                                        label: 'Transmission loss',
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="rack"
                            name="rack"
                            rules={[{
                                required: true,
                                message: 'Please input rack !'
                            }]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item label="opd" name="opd">
                            <Select
                                showSearch
                                placeholder="Select a opd"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Normal',
                                        label: 'Normal',
                                    },
                                    {
                                        value: 'Need Replacement',
                                        label: 'Need Replacement',
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="switch" name="switch">
                            <Select
                                showSearch
                                placeholder="Select a opd"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Normal',
                                        label: 'Normal',
                                    },
                                    {
                                        value: 'Abnormal',
                                        label: 'Abnormal',
                                    },
                                ]}/>
                        </Form.Item>
                        <Form.Item label="t9140" name="t9140">
                            <Select
                                showSearch
                                placeholder="Select a opd"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Normal',
                                        label: 'Normal',
                                    },
                                    {
                                        value: 'Abnormal',
                                        label: 'Abnormal',
                                    },
                                ]}/>
                        </Form.Item>
                        <Form.Item label="server" name="server">
                            <Select
                                showSearch
                                placeholder="Select a opd"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Normal',
                                        label: 'Normal',
                                    },
                                    {
                                        value: 'Abnormal',
                                        label: 'Abnormal',
                                    },
                                ]}/>
                        </Form.Item>

                        <Form.Item
                            label="routine"
                            name="routine"
                            rules={[{required: true, message: 'Please input routine!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                        <SubmitButton form={trForm}>Submit</SubmitButton>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default SixMCList;
