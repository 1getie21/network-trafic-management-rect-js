import React, { useEffect, useState } from 'react';
import {
    Button, Tooltip,
    Col,
    DatePicker, Collapse, RangePicker as AntRangePicker,
    Divider,
    Drawer,
    Form,
    Input,
    notification,
    Popconfirm,
    Row,
    Select,
    Table
} from "antd";
import axiosInstance from "../auth/authHeader";
import dayjs from "dayjs";
import { CloudDownloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AuthService from "../auth/AuthService ";

const {RangePicker} = DatePicker;
const FailedTraffics = () => {
    const logedInUser = AuthService.getCurrentUser();
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    //const API_URL = process.env.REACT_APP_API_URL;
    const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
    
    const [trForm] = Form.useForm();

    const [sites, setSites] = useState([]);
    const [page, setPage] = useState(0);
    const [sitesLoading, setSitesLoading] = useState(false);
    const [hasMoreSites, setHasMoreSites] = useState(true);

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

    // Define setDate if necessary
    const [date, setDate] = useState("");

    const getAllData = () => {
        axiosInstance.get(API_URL + "/failed-traffics")
            .then(response => {
                    setData(response?.data?._embedded?.failedTrafficDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };

    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/failed-traffics/" + id)
            .then(response => {
                    setDataById(response.data);
                    response.data.fixedAt = dayjs(response.data.fixedAt);
                    response.data.disConnectedAt = dayjs(response.data.disConnectedAt);
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
        axiosInstance.post(API_URL + "/failed-traffics", values)
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
        axiosInstance.put(API_URL + "/failed-traffics/" + id, data)
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

    const getAllSites = (page) => {
        setSitesLoading(true);
        axiosInstance.get(API_URL + "/sites?page=" + page + "&size=" + 10)
            .then(response => {
                    const newSites = response?.data?._embedded?.sitesDtoses;
                    if (newSites) {
                        const totalPage = response?.data?.page?.totalPages;
                        setSites(prevSites => [...prevSites, ...newSites]);
                        setSitesLoading(false);
                        if (page === totalPage - 1) {
                            setHasMoreSites(false);
                        }
                    }

                },
                error => {
                    setSitesLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                })
    };

    const handlePopupScroll = (event) => {
        const {target} = event;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            if (hasMoreSites && !sitesLoading) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    getAllSites(nextPage);
                    return nextPage;
                });
            }
        }
    };

    const onSearchSubmitClick = (values) => {
        const fromDate = values.from[0].format('YYYY-MM-DD');
        const toDate = values.from[1].format('YYYY-MM-DD');
        setDate('/' + fromDate + '/' + toDate);
        axiosInstance.get(`${API_URL}/failed-traffics/${fromDate}/${toDate}`)
            .then(response => {
                setData(response?.data?._embedded?.failedTrafficDtoses);
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
        values.sites = {"id": values.sites}
        console.log("values=", values)
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
        getAllSites(page);
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount

    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/failed-traffics/" + id)
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
            title: 'Disconnected Sites',
            dataIndex: 'sites',
            key: 'sites',
            render: sites => sites?.name,
        },
        {
            title: 'Disconnected-link',
            dataIndex: 'failedLinkType',
            key: 'failedLinkType',
        },
        {
            title: 'ReportededAt',
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
            title: 'Reporter',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Reported to',
            dataIndex: 'reportedTo',
            key: 'reportedTo',
        },
        {
            title: 'Fixed At',
            dataIndex: 'fixedAt',
            key: 'fixedAt',
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
            title: 'FailedAt',
            dataIndex: 'disConnectedAt',
            key: 'disConnectedAt',
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
            title: 'Failed length',
            dataIndex: 'failureLength',
            key: 'failureLength',
        },
        {
            title: 'Reason for down',
            dataIndex: 'failedReason',
            key: 'failedReason',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Tooltip title="Update Rcored">
                    <a onClick={() => showDrawer(record.id)}>
                    <EditOutlined style={{ fontSize: '16px'}}/>
                   </a>
                        </Tooltip>

                   <Divider type="vertical"/>
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
                        <DeleteOutlined style={{ fontSize: '16px', color:"red" }}/>
                       </a>
                       </Tooltip>
                   </Popconfirm>
               </span>
            ),
        },
    ];

    return (
        <>
            {contextHolder}

            <Row justify="space-between" style={{ marginBottom: '4px' }}>
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
                <Col span={10} > {/* Center aligns content */}
                    <Form.Item name="download file">
                        <Tooltip title="Download File">
                            <a target="_blank" href={API_URL + "/api/pdf/failed-traffics" + date+'?userName='+logedInUser?.username}>
                                <CloudDownloadOutlined style={{ fontSize: '30px' }} />
                            </a>
                        </Tooltip>
                    </Form.Item>
                </Col>
                <Col span={10}></Col> {/* This empty column ensures space between the Download File button and the right edge of the row */}
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
                title="Add New F.traffic"
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
                            label="Disconnected Sites"
                            name="sites"
                            rules={[{required: true, message: 'Please input site name!'}]}
                        >
                            <Select
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select"
                                options={sites?.map(sites => ({label: sites?.name, value: sites?.id}))}
                                onPopupScroll={handlePopupScroll}
                                loading={sitesLoading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Type of disconnected-link"
                            name="failedLinkType"
                            rules={[{required: true, message: 'Please input link!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Reported to"
                            name="reportedTo"
                            rules={[{required: true, message: 'Please input name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="fixedAt"
                            name="fixedAt"
                            rules={[{required: true, message: 'Please input fixed time!'}]}
                        >
                            <DatePicker showTime/>
                        </Form.Item>
                        <Form.Item
                            label="The time when it was discontinued"
                            name="disConnectedAt"
                            rules={[{required: true, message: 'Please input The time when it was discontinued !'}]}
                        >
                            <DatePicker showTime/>
                        </Form.Item>
                        <Form.Item
                            label="Reason for down"
                            name="failedReason"
                            rules={[{required: true, message: 'Please input reason!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <SubmitButton form={trForm}>Submit</SubmitButton>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default FailedTraffics;
