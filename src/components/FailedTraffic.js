import React, {useEffect, useState} from 'react';
import {
    Button,
    Col,
    DatePicker,
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

const FailedTraffics = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = "http://localhost:8080";
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
            title: 'Id',
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
            title: 'Reported time',
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
            title: 'Name of reporter',
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
            title: 'The time when it was failed',
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
            title: 'Failed time length',
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
                   <a onClick={() => showDrawer(record.id)}>Update</a>
                   <Divider type="vertical"/>
                   <Popconfirm
                       title="Delete the task"
                       description="Are you sure to delete this task?"
                       onConfirm={() => confirm(record.id)}
                       onCancel={cancel}
                       okText="Yes"
                       cancelText="No"
                   >
                       <Button danger>Delete</Button>
                   </Popconfirm>
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
