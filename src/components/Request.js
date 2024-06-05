import React, {useEffect, useState} from 'react';
import {Button, Col,Divider,Drawer,  Form, Input,notification,Popconfirm, Row, Select,Table

} from "antd";
import axiosInstance from "../auth/authHeader";
import {CloudDownloadOutlined} from "@ant-design/icons";

const Request = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = "http://localhost:8080";

    // const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
    const [trForm] = Form.useForm();
    const [selectedFile1, setSelectedFile1] = useState(null);
    //const [selectedFile2, setSelectedFile2] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile1(event.target.files[0]);
    }; 
    // const handleFileChange2 = (event) => {
    //     setSelectedFile2(event.target.files[0]);
    // }; 


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
        axiosInstance.get(API_URL + "/request")
            .then(response => {
                    setData(response?.data?._embedded?.requestDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/request/" + id)
            .then(response => {
                    setDataById(response.data);
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
    const addFIle = () => {
        const formData = new FormData();
        formData.append('file', selectedFile1);
        //formData.append('file2', selectedFile2);
        axiosInstance.post(API_URL + '/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    const addNewRecord = (values) => {
        addFIle();
        axiosInstance.post(API_URL + "/request", values)
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

        addFIle();
        axiosInstance.put(API_URL + "/request/" + id, data)
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
    const onSubmitClick = (values) => {
        //values.detailFile = selectedFile2?.name
        values.descriptionFile = selectedFile1?.name
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
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount
    const confirm = (id) => {
        axiosInstance.delete(API_URL + "/request/" + id)
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
            title: 'FName',
            dataIndex: 'fname',
            key: 'fname',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Request',
            dataIndex: 'requester',
            key: 'requester',
        },

        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Service Categories',
            dataIndex: 'categories',
            key: 'categories',
        },


        {
            title: 'Contact-Person',
            dataIndex: 'contact',
            key: 'contact',

        },


        {
            title: 'Service Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <>
                    {(record?.description || record?.descriptionFile) && (
                        <>
                            {record?.description && (
                                <p>{record.description}</p>
                            )}
                            {record?.descriptionFile && (
                                <a target="_blank" href={API_URL + "/files/" + record.descriptionFile}>
                                    <CloudDownloadOutlined/>
                                </a>
                            )}
                        </>
                    )}
                </>
            ),
        },
        {
            title: 'Action Status',
            dataIndex: 'status',
            key: 'status',
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                        <a target="_blank"
                           href={API_URL + "/files/" + record?.descriptionFile}>{record?.descriptionFile}
                        </a> ,
                    {/*<a target="_blank"*/}
                    {/*   href={API_URL + "/files/" + record?.detailFile}>{record?.detailFile}*/}
                    {/*    </a>*/}
                    <Divider type="vertical"/>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a onClick={() => showDrawer(record.id)}>Update</a>
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
                        <Button danger>Delete</Button>
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
            <Row justify="end" style={{marginBottom: 16}}>
                <Col>
                    <Button onClick={() => showDrawer(undefined)}>Add New Recored</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Add New Request"
                placement="right"
                onClose={() => setOpen(false)}
                visible={open}
            >
                {(addNewMode || dataById) && (
                    <Form
                        layout="vertical"
                        initialValues={dataById}
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
                    >

                        <Form.Item
                            label="fname"
                            name="fname"
                            rules={[{required: true, message: 'Please input fname!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        {/*<Form.Item*/}
                        {/*    label="phone"*/}
                        {/*    name="phone"*/}

                        {/*    rules={[{required: true, message: 'Please input phone!'},*/}
                        {/*        {pattern: /^[0-9]+?$/, message: 'Please enter a valid phone !'}*/}
                        {/*    ]}*/}
                        {/*>*/}
                        {/*    <Input addonBefore="+251"/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                { required: true, message: 'Please input phone number!' },
                                { pattern: /^[0-9]+?$/, message: 'Please enter a valid phone number!' },
                                { len: 9, message: 'Phone number must be 9 digits!' } // Add this rule for length validation
                            ]}
                        >
                            <Input addonBefore="+251" />
                        </Form.Item>

                        <Form.Item
                            label="email"
                            name="email"
                            rules={[
                                {required: true, message: 'Please input your email!'},
                                {type: 'email', message: 'Please enter a valid email address!'},
                            ]}
                        >
                            <Input/>
                        </Form.Item>


                        <Form.Item label="requester" name="requester">
                            <Select
                                showSearch
                                placeholder="Select a requester"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'INSA CERT',
                                        label: 'INSA CERT',
                                    },
                                    {
                                        value: 'INSA / OPERATION',
                                        label: 'INSA / OPERATION',
                                    },
                                    {
                                        value: 'Federal government',
                                        label: 'Federal government',
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="organization"
                            name="organization"
                            rules={[{required: true, message: 'Please input organization!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="categories"
                            name="categories"  // Corrected the name from " categories" to "categories"
                            rules={[{required: true, message: 'Please select a category!'}]}  // Add validation rule
                        >
                            <Select
                                showSearch
                                placeholder="Select a category"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'Service Monitor',
                                        label: 'Service Monitor',
                                    },
                                    {
                                        value: 'Service Mirror',
                                        label: 'Service Mirror',
                                    },
                                    {
                                        value: 'Service Block',
                                        label: 'Service Block',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="contact"
                            name="contact"
                            rules={[{required: true, message: 'Please input contact!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description">
                            <Input.TextArea placeholder="Enter text or upload a file"/>
                        </Form.Item>

                        {/* Option to upload a file */}
                        <Form.Item
                            label="Upload Description File">
                            <Input onChange={handleFileChange} type="file"/>
                        </Form.Item>

<<<<<<< HEAD
                        <Form.Item
                            label="Detail"
                            name="detail">
                            <Input.TextArea placeholder="Enter text or upload a file"/>
                        </Form.Item>

                        {/* Option to upload a file */}
                        <Form.Item
                            label="Upload Detail File">
                            <Input onChange={handleFileChange2} type="file"/>
                        </Form.Item>
=======

                        <Form.Item label="status" name="status">
                            <Select
                                showSearch
                                placeholder="Select a status"
                                optionFilterProp="children"
                                options={[
                                    {
                                        value: 'HIGH',
                                        label: 'HIGH',
                                    },
                                    {
                                        value: 'MEDIUM',
                                        label: 'MEDIUM',
                                    },
                                    {
                                        value: 'LOW',
                                        label: 'LOW',
                                    },
                                ]}
                            />
                        </Form.Item>

>>>>>>> b0d732c8b0dbb20c7d54afb7b77d732c47149149
                        {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                        <SubmitButton form={trForm}>Submit</SubmitButton>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Request;
