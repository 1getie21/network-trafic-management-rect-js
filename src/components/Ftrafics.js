import React, {useEffect, useState} from 'react';
import {
    Button,Tooltip,
    Col,
    Divider,
    Drawer,
    Form,
    Input,
    notification,
    Popconfirm,
    Row,
    Select,
    Table,
    DatePicker,
    Collapse
} from "antd";
import axiosInstance from "../auth/authHeader";

import {CloudDownloadOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker;

const Ftraffics = () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
 const API_URL = "http://localhost:8080";
  // const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
    const [trForm] = Form.useForm();
    const [trSearchForm] = Form.useForm();

    const SubmitButton = ({form: trafficForm, children}) => {
        const [submittable, setSubmittable] = useState(false);
        const values = Form.useWatch([], trafficForm);
        useEffect(() => {
            trafficForm.validateFields({validateOnly: true})
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [trafficForm, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };
    const SubmitSearchButton = ({form: trafficSearchForm, children}) => {
        const [searchSubmittable, setSearchSubmittable] = useState(false);
        const values = Form.useWatch([], trafficSearchForm);
        useEffect(() => {
            trafficSearchForm.validateFields({validateOnly: true})
                .then(() => setSearchSubmittable(true))
                .catch(() => setSearchSubmittable(false));
        }, [trafficSearchForm, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!searchSubmittable}>
                {children}
            </Button>
        );
    };
    const getAllData = () => {
        axiosInstance.get(API_URL + "/f-traffics")
            .then(response => {
                    setData(response?.data?._embedded?.fTrafficDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message);
                });
    };

    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/f-traffics/" + id)
            .then(response => {
                    setDataById(response.data);
                    response.data.sites = response?.data?.sites?.id;
                    trForm.setFieldsValue(response.data);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message);
                });
    };

    const openNotificationWithIcon = (type, messageTitle, description) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };

    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/f-traffics/" + id)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.');
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message);
                });
    };

    const cancel = (e) => {
    };

    const addNewRecord = (values) => {
        axiosInstance.post(API_URL + "/f-traffics", values)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.');
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                        openNotificationWithIcon('error', 'Error ', error?.response?.data?.apierror?.message
                            + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message);
                    } else {
                        openNotificationWithIcon('error', 'Error ~' + error?.response?.data?.apierror?.status, error?.response?.data?.apierror?.message);
                    }
                });
    };

    const updateRecordById = (data, id) => {
        axiosInstance.put(API_URL + "/f-traffics/" + id, data)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.');
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                        openNotificationWithIcon('error', 'Error ', error?.response?.data?.apierror?.message
                            + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message);
                    } else {
                        openNotificationWithIcon('error', 'Error ~' + error?.response?.data?.apierror?.status, error?.response?.data?.apierror?.message);
                    }
                });
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

    const handleCHange = (value) => {
        axiosInstance.get(API_URL + "/f-traffics/tr/" + value)
            .then(response => {
                    setData(response?.data?._embedded?.fTrafficDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message);
                });
    };

    const [sites, setSites] = useState([]);

    const getAllSites = () => {
        axiosInstance.get(API_URL + "/sites")
            .then(response => {
                    const s = response?.data?._embedded?.sitesDtoses;
                    setSites(s);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message);
                });
    };
    const onSearchSubmitClick = (values) => {
        const fromDate = values.from[0].format('YYYY-MM-DD');
        const toDate = values.from[1].format('YYYY-MM-DD');
        setDate('/' + fromDate + '/' + toDate);
        axiosInstance.get(`${API_URL}/f-traffics/${fromDate}/${toDate}`)
            .then(response => {
                setData(response?.data?._embedded?.fTrafficDtoses);
                setLoading(false);
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
        values.sites = {"id": values.sites};
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
    }, []);

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
            title: 'Time Trafic',
            dataIndex: 'trafficTimeName',
            key: 'trafficTimeName',
        },
        {
            title: 'Total Time Traffic Value',
            dataIndex: 'timeValues',
            key: 'timeValues',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
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
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Tooltip title="Update Recored">
                        <a onClick={() => showDrawer(record.id)}>
                            <EditOutlined style={{ fontSize: '16px' }}/>
                        </a>
                    </Tooltip>
                    <Divider type="vertical"/>
                    <Tooltip title="Delete Task">
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => confirm(record.id)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ fontSize: '16px', color:"red" }}/>
                        </Popconfirm>
                    </Tooltip>
                </span>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Row justify="end" style={{marginBottom: 22}}>
                <Col span={12}>
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: 'FIlter By Date Range',
                                children:
                                    <Form
                                        name="validateOnly"
                                        layout="horizontal"
                                        onFinish={onSearchSubmitClick}
                                        onFinishFailed={onSearchFinishFailed}
                                    >
                                        <Row>
                                            <Col  span={10}>
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
                                            <Col span={7}>
                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit">Submit</Button>
                                                </Form.Item>
                                            </Col>
                                            {/*<Col span={8}>*/}
                                            {/*    <Form.Item>*/}
                                            {/*        <a target="_blank" href={API_URL + "/api/pdf" + date}>*/}
                                            {/*            <CloudDownloadOutlined style={{ fontSize: '30px' }} />*/}
                                            {/*        </a>*/}
                                            {/*    </Form.Item>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </Form>
                                ,
                            },
                        ]}
                    />
                </Col>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            name="download file">
                            <Tooltip title="Download File">
                                <a target="_blank" href={API_URL + "/api/pdf" + date}>
                                    <CloudDownloadOutlined style={{ fontSize: '30px' }} />
                                </a>
                            </Tooltip>
                        </Form.Item>
                    </Col>
                </Row>


                <Col span={6}></Col>
                <Col span={4}>
                    <Select
                        onChange={handleCHange}
                        showSearch
                        placeholder="Select a time traffic"
                        optionFilterProp="children"
                        options={[
                            {value: '8 O\'clock', label: '8 O\'clock'},
                            {value: '14 O\'clock', label: '14 O\'clock'},
                            {value: '18 O\'clock', label: '18 O\'clock'},
                        ]}
                    />
                </Col>
                <Col span={4}>
                    <Button onClick={() => showDrawer(undefined)}>Add New Traffic</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Add New Traffic"
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
                                style={{width: '100%'}}
                                placeholder="Please select"
                                options={sites?.map(sites => ({label: sites.name, value: sites.id}))}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Traffic Time"
                            name="trafficTimeName">
                            <Select
                                showSearch
                                placeholder="Select a time trafic"
                                optionFilterProp="children"
                                options={[
                                    {value: '8 O\'clock', label: '8 O\'clock'},
                                    {value: '14 O\'clock', label: '14 O\'clock'},
                                    {value: '18 O\'clock', label: '18 O\'clock'},
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Values"
                            name="timeValues"
                            rules={[
                                {required: true, message: 'Please input Values !'},
                                {pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for Values !'}
                            ]}
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
                            <SubmitButton form={trForm}>Submit</SubmitButton>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Ftraffics;
