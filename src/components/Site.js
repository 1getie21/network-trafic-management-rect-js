import React, {useEffect, useState} from 'react';
import {Button, Tooltip, Col, Divider, Drawer, Form, Input, notification, Popconfirm, Row, Table} from "antd";
import axiosInstance from "../auth/authHeader";

import { EditOutlined, DeleteOutlined} from "@ant-design/icons";

const Site = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const cancel = (e) => {
    };

    //const API_URL = "http://localhost:8080";
    const API_URL = "http://172.21.22.224:8080/TeamOpsSystem-0.0.1-SNAPSHOT";


    const openNotificationWithIcon = (type, messageTitle, description) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };
    // const getAllData = () => {
    //     axiosInstance.get(API_URL + "/sites")
    //         .then(response => {
    //                 setData(response?.data?._embedded?.sitesDtoses);
    //                 setLoading(false);
    //             },
    //             error => {
    //                 setLoading(false);
    //                 openNotificationWithIcon('error', 'Error', error?.message)
    //             }
    //         );
    // };

    const getAllData = () => {
        axiosInstance.get(API_URL + "/sites?sort=name,asc")
            .then(response => {
                const sortedData = response?.data?._embedded?.sitesDtoses;

                if (!sortedData || !Array.isArray(sortedData)) {
                    console.warn("API data is empty.");
                    setLoading(false); // Ensure loading state is updated
                    setData([]); // Initialize data as empty array or handle as per your logic
                    return; // Exit function early
                }

                // Check if data is sorted by 'name' in ascending order
                const isSorted = sortedData.every((item, index) => {
                    if (index === 0) return true; // First item is always sorted
                    return item.name >= sortedData[index - 1].name; // Check if current item is >= previous item
                });

                if (!isSorted) {
                    console.warn("API data might not be sorted. Sorting locally.");

                    // Sort data locally by 'name'
                    const sortedLocally = sortedData.slice().sort((a, b) => a.name.localeCompare(b.name));
                    setData(sortedLocally);
                } else {
                    // Use sortedData as-is if already sorted by 'name'
                    setData(sortedData);
                }

                setLoading(false); // Update loading state after data manipulation
            })
            .catch(error => {
                setLoading(false); // Ensure loading state is updated in case of error
                openNotificationWithIcon('error', 'Error', error?.message); // Display error notification
            });
    };
    
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/sites/" + id)
            .then(response => {
                    setDataById(response?.data);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };

    const deleteById = (id) => {
        axiosInstance.delete(API_URL + "/sites/" + id)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'Data Is deleted successfully.'
                    });
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };

    const addNewRecord = (values) => {
        axiosInstance.post(API_URL + "/sites", values)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'New Site Is added successfully.'
                    });
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    console.log("Error=", error)
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };
    const updateRecordById = (data, id) => {
        axiosInstance.put(API_URL + "/sites/" + id, data)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'Data Is updated successfully.'
                    });
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const showDrawer = (id) => {
        setOpen(true);
        if (id === undefined) {
            setAddNewMode(true);
        } else {
            setDataById(null);
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
    }, []);
    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        // {
        //     title: 'Id',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: 'Site Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Tooltip title="Update Rcored">
                    <a onClick={() => showDrawer(record.id)}>
                        <EditOutlined style={{fontSize: '16px'}}/>
                    </a>
                    </Tooltip>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                    <Divider type="vertical"/>
                     <Popconfirm
                         title="Delete the task"
                         description="Are you sure to delete this task?"
                         onConfirm={() => deleteById(record.id)}
                         onCancel={cancel}
                         okText="Yes"
                         cancelText="No">
                                 <Tooltip title="Delete Task">
                                     <a danger>
                            <DeleteOutlined style={{fontSize: '16px', color: "red"}}/>
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
                title="New site"
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
                            label="Name"
                            name="name"
                            rules={[{required: true, message: 'Please input sites name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Url"
                            name="url"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Site;
