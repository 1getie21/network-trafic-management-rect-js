// import React, { useEffect, useState } from 'react';
// import { InputNumber } from 'antd';
// import { Button, Col, Divider, Drawer, Form, Input, notification, Popconfirm, Row, Select, Table } from "antd";
// import axiosInstance from "../auth/authHeader";
// import dayjs from "dayjs";
//
// const CheckList = () => {
//     const [data, setData] = useState([]);
//     const [dataById, setDataById] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [addNewMode, setAddNewMode] = useState(false);
//     const [api, contextHolder] = notification.useNotification();
//     const API_URL = "http://localhost:7070";
//     const [trForm] = Form.useForm();
//
//     const SubmitButton = ({ form: trafficForm, children }) => {
//         const [submittable, setSubmittable] = React.useState(false);
//         const values = Form.useWatch([], trafficForm);
//         React.useEffect(() => {
//             trafficForm.validateFields({
//                 validateOnly: true,
//             })
//                 .then(() => setSubmittable(true))
//                 .catch(() => setSubmittable(false));
//         }, [trafficForm, values]);
//
//         return (
//             <Button type="primary" htmlType="submit" disabled={!submittable}>
//                 {children}
//             </Button>
//         );
//     };
//
//     const getAllData = () => {
//         axiosInstance.get(API_URL + "/check_list")
//             .then(response => {
//                     setData(response?.data?._embedded?.checkListDtoses);
//                     setLoading(false);
//                 },
//                 error => {
//                     setLoading(false);
//                     openNotificationWithIcon('error', 'Error', error?.message)
//                 });
//     };
//
//     const getDataById = (id) => {
//         axiosInstance.get(API_URL + "/check_list/" + id)
//             .then(response => {
//                     setDataById(response.data);
//                     response.data.sites = response?.data?.sites?.id;
//                     trForm.setFieldsValue(response.data);
//                 },
//                 error => {
//                     openNotificationWithIcon('error', 'Error', error?.message)
//                 });
//     };
//
//     const openNotificationWithIcon = (type, messageTitle, description) => {
//         api[type]({
//             message: messageTitle,
//             description: description,
//         });
//     };
//
//     const addNewRecord = (values) => {
//         // const acceptedMembers = ['download', 'upload', 'npb', 'avgNBP'];
//         // const filteredValues = Object.fromEntries(
//         //     Object.entries(values).filter(([key]) => acceptedMembers.includes(key))
//         // );
//         //
//         // // Validate input values to be numbers
//         // for (const [key, value] of Object.entries(filteredValues)) {
//         //     if (acceptedMembers.includes(key) && isNaN(value)) {
//         //         openNotificationWithIcon('error', 'Error', `Please enter a valid number for ${key}`);
//         //         return;
//         //     }
//         // }
//         axiosInstance.post(API_URL + "/check_list", values)
//             .then(response => {
//                 openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
//                 getAllData();
//                 setOpen(false);
//                 setDataById(null);
//             }, error => {
//                 if (error?.response?.data?.apierror?.subErrors?.length > 0) {
//                     openNotificationWithIcon('error', 'Error ',
//                         error?.response?.data?.apierror?.message +
//                         " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
//                 } else {
//                     openNotificationWithIcon('error',
//                         'Error ~' + error?.response?.data?.apierror?.status,
//                         error?.response?.data?.apierror?.message)
//                 }
//             })
//     };
//
//     const updateRecordById = (values, id) => {
//         axiosInstance.put(API_URL + "/check_list/" + id, values)
//             .then(response => {
//                     openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
//                     getAllData();
//                     setOpen(false);
//                     setDataById(null);
//                 },
//                 error => {
//                     if (error?.response?.data?.apierror?.subErrors?.length > 0) {
//                         openNotificationWithIcon('error', 'Error ',
//                             error?.response?.data?.apierror?.message +
//                             " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
//                     } else {
//                         openNotificationWithIcon('error',
//                             'Error ~' + error?.response?.data?.apierror?.status,
//                             error?.response?.data?.apierror?.message)
//                     }
//                 }
//             );
//     };
//
//     const showDrawer = (id) => {
//         setDataById(null);
//         setOpen(true);
//         trForm.resetFields();
//         if (id === undefined) {
//             setAddNewMode(true);
//         } else {
//             setDataById(null);
//             getDataById(id);
//             setAddNewMode(false);
//         }
//     };
//
//     const [sites, setSites] = useState([]);
//     const getAllSites = () => {
//         axiosInstance.get(API_URL + "/sites")
//             .then(response => {
//                     console.log("sitesDtoses", response)
//                     const s = response?.data?._embedded?.sitesDtoses;
//                     setSites(s);
//                 },
//                 error => {
//                     openNotificationWithIcon('error', 'Error', error?.message)
//                 });
//     };
//
//     const onSubmitClick = (values) => {
//         values.sites = {"id": values.sites}
//         console.log("values=", values)
//         if (addNewMode) {
//             addNewRecord(values);
//         } else {
//             updateRecordById(values, dataById.id);
//         }
//     };
//
//     const onFinishFailed = (errorInfo) => {
//         console.log('Failed:', errorInfo);
//     };
//
//     useEffect(() => {
//         getAllData();
//         getAllSites();
//     }, []);
//
//     const confirm = (id) => {
//         axiosInstance.delete(API_URL + "/check_list/" + id)
//             .then(response => {
//                     openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.')
//                     getAllData();
//                 },
//                 error => {
//                     openNotificationWithIcon('error', 'Error', error?.message)
//                 })
//     };
//
//
//     const cancel = (e) => {
//     };
//
//
//
//
//
//     const columns = [
//         {
//             title: 'Id',
//             dataIndex: 'id',
//             key: 'id',
//             render: (text, record, index) => index + 1,
//         },
//
//         {
//             title: 'Sites',
//             dataIndex: 'sites',
//             key: 'sites',
//             render: sites => sites?.name,
//         },
//         {
//             title: 'Link-type',
//             dataIndex: 'linkType',
//             key: 'linkType',
//         },
//         {
//             title: 'Download(Gbps)',
//             dataIndex: 'download',
//             key: 'download',
//
//         },
//         {
//             title: 'Upload(Gbps)',
//             dataIndex: 'upload',
//             key: 'upload',
//         },
//         {
//             title: 'Name of reporter',
//             dataIndex: 'createdBy',
//             key: 'createdBy',
//         },
//         {
//             title: 'No, NPB',
//             dataIndex: 'npb',
//             key: 'npb',
//         },
//
//         {
//             title: 'Avg process NBP',
//             dataIndex: 'avgNBP',
//             key: 'avgNBP',
//
//         },
//
//         {
//             title: 'Action',
//             key: 'action',
//             render: (text, record) => (
//                 <span>
//                 {/* eslint-disable jsx-a11y/anchor-is-valid */}
//                     <a onClick={() => showDrawer(record.id)}>Update</a>
//                     {/* eslint-enable jsx-a11y/anchor-is-valid */}
//
//                     <Divider type="vertical"/>
//
//                     {/* eslint-disable jsx-a11y/anchor-is-valid */}
//                     <Popconfirm
//                         title="Delete the task"
//                         description="Are you sure to delete this task?"
//                         onConfirm={()=>confirm(record.id)}
//                         onCancel={cancel}
//                         okText="Yes"
//                         cancelText="No"
//                     >
//     <Button danger>Delete</Button>
//   </Popconfirm>
//                     {/*<a onClick={() => deleteById(record.id)}>Delete</a>*/}
//                     {/* eslint-enable jsx-a11y/anchor-is-valid */}
//                 </span>
//             ),
//         },
//     ];
//     return (
//         <>
//             {contextHolder}
//             <Row justify="end" style={{marginBottom: 16}}>
//                 <Col>
//                     <Button onClick={() => showDrawer(undefined)}>Add New Checklist</Button>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24}>
//                     <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
//                 </Col>
//             </Row>
//             <Drawer
//                 title="Basic Drawer"
//                 placement="right"
//                 onClose={() => setOpen(false)}
//                 visible={open}
//             >
//                 {(addNewMode || dataById) && (
//
//                     <Form
//                         form={trForm} name="validateOnly"
//                         layout="vertical"
//                         onFinish={onSubmitClick}
//                         onFinishFailed={onFinishFailed}
//                     >
//
//                         <Form.Item
//                             label="Sites"
//                             name="sites"
//                             rules={[{required: true, message: 'Please input site name!'}]}
//                         >
//                             <Select
//                                 allowClear
//                                 style={{
//                                     width: '100%',
//                                 }}
//                                 placeholder="Please select"
//                                 options={sites.map(sites => ({label: sites.name, value: sites.id}))}
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="LinkType"
//                             name="linkType"
//                             rules={[{required: true, message: 'Please input link!'}]}
//                         >
//                             <Input/>
//                         </Form.Item>
//
//                         <Form.Item
//                             label="download"
//                             name="download"
//                             rules={[
//                                 { required: true, message: 'Please input download!' },
//                                 { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for download!' }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                         <Form.Item
//                             label="upload"
//                             name="upload"
//                             rules={[
//                                 { required: true, message: 'Please input Upload!' },
//                                 { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for upload!' }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                         <Form.Item
//                             label="npb"
//                             name="npb"
//                             rules={[
//                                 { required: true, message: 'Please input npb !' },
//                                 { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for npb!' }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//                         <Form.Item
//                             label="avgNBP"
//                             name="avgNBP"
//                             rules={[
//                                 { required: true, message: 'Please input avgNBP !' },
//                                 { pattern: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number for avgNBP!' }
//                             ]}
//                         >
//                             <Input />
//                         </Form.Item>
//
//                         {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
//                         <SubmitButton form={trForm}>Submit</SubmitButton>
//                     </Form>
//                 )}
//
//             </Drawer>
//         </>
//     );
// };
//
// export default CheckList;
