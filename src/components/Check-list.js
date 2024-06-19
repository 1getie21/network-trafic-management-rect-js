import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { Button,
    Tooltip, DatePicker, RangePicker as AntRangePicker,
    Collapse, Col,
    Divider, Drawer,
    Form, Input, notification,
    Popconfirm, Row,
    Select, Table } from "antd";
import axiosInstance from "../auth/authHeader";
import {CloudDownloadOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
const {RangePicker} = DatePicker;

const CheckList = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = "http://localhost:8080";
    //const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
    const [trForm] = Form.useForm();
    const [date, setDate] = useState('');


    const SubmitButton = ({ form: trafficForm, children }) => {
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
        axiosInstance.get(API_URL + "/check_list")
            .then(response => {
                    setData(response?.data?._embedded?.checkListDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };

    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/check_list/" + id)
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
        axiosInstance.post(API_URL + "/check_list", values)
            .then(response => {
                openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
                getAllData();
                setOpen(false);
                setDataById(null);
            }, error => {
                if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                    openNotificationWithIcon('error', 'Error ',
                        error?.response?.data?.apierror?.message +
                        " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                } else {
                    openNotificationWithIcon('error',
                        'Error ~' + error?.response?.data?.apierror?.status,
                        error?.response?.data?.apierror?.message)
                }
            })
    };

    const updateRecordById = (values, id) => {
        axiosInstance.put(API_URL + "/check_list/" + id, values)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                        openNotificationWithIcon('error', 'Error ',
                            error?.response?.data?.apierror?.message +
                            " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                    } else {
                        openNotificationWithIcon('error',
                            'Error ~' + error?.response?.data?.apierror?.status,
                            error?.response?.data?.apierror?.message)
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
        const npbProcess = [values.npbone, values.npbtwo, values.npbthree];
        if (npbProcess.every(process => !isNaN(process))) {
            const avgNBP = npbProcess.reduce((acc, curr) => acc + curr, 0) / npbProcess.length;
            values.avgNBP = avgNBP.toFixed(2);
            if (addNewMode) {
                addNewRecord(values);
            } else {
                updateRecordById(values, dataById.id);
            }
        } else {
            openNotificationWithIcon('error', 'Error', 'Please enter valid numbers for NPB process.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getAllData();
        getAllSites();
    }, []);

    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/check_list/" + id)
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
            title: 'Link-type',
            dataIndex: 'linkType',
            key: 'linkType',
        },
        {
            title: 'Download(Gbps)',
            dataIndex: 'download',
            key: 'download',

        },
        {
            title: 'Upload(Gbps)',
            dataIndex: 'upload',
            key: 'upload',
        },
        {
            title: 'Name of reporter',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },


        {
            title: 'Total process NBP',
            dataIndex: 'nbpTotal',
            key: 'nbpTotal',

        },

        {
            title: 'Avg process NBP',
            dataIndex: 'avgNBP',
            key: 'avgNBP',

        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Tooltip title="Update Recored">
                    <a onClick={() => showDrawer(record.id)}>
                        <EditOutlined style={{ fontSize: '16px'}}/>
                    </a>
                        </Tooltip>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}

                    <Divider type="vertical"/>

                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={()=>confirm(record.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Task">
                <a danger>
            <DeleteOutlined style={{ fontSize: '16px', color:"red" }}/>
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
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
                <Col span={13}>
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
                                            <Col span={12}>
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
                                                    <RangePicker />
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

                <Row>
                    <Col span={8} style={{ textAlign: 'center' }}> {/* Center aligns content */}
                        <Form.Item name="download file">
                            <Tooltip title="Download File">
                                <a target="_blank" href={API_URL + "/api/pdf" + date}>
                                    <CloudDownloadOutlined style={{ fontSize: '30px' }} />
                                </a>
                            </Tooltip>
                        </Form.Item>
                    </Col>
                    <Col span={8}></Col> {/* This empty column ensures space between the Download File button and the right edge of the row */}
                </Row>


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
                title="Add New List"
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
                        <Form.Item
                            label="LinkType"
                            name="linkType"
                            rules={[{required: true, message: 'Please input link!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="download"
                            name="download"
                            rules={[
                                { required: true, message: 'Please input download!' },
                                { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for download!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="upload"
                            name="upload"
                            rules={[
                                { required: true, message: 'Please input Upload!' },
                                { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for upload!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        NBP Process
                        <Form.Item
                            label="NBP 1"
                            name="npbone"
                            rules={[{ required: true, message: 'Please input NBP process 1!' }]}
                        >
                            <InputNumber min={0} step={0.1} />
                        </Form.Item>
                        <Form.Item
                            label="NBP 2"
                            name="npbtwo"
                            rules={[{ required: true, message: 'Please input NBP process 2!' }]}
                        >
                            <InputNumber min={0} step={0.1} />
                        </Form.Item>
                        <Form.Item
                            label="NBP 3"
                            name="npbthree"
                            rules={[{ required: true, message: 'Please input NBP process 3!' }]}
                        >
                            <InputNumber min={0} step={0.1} />
                        </Form.Item>

                        {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                        <SubmitButton form={trForm}>Submit</SubmitButton>
                    </Form>
                )}

            </Drawer>
        </>
    );
};

export default CheckList;

