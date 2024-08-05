import React, { useState } from 'react'
import { Button, Form, Input, Radio } from 'antd';
type LayoutType = Parameters<typeof Form>[0]['layout'];

const CreateForm:React.FC=() => {
    
    const [form] = Form.useForm();

    const submit = async() => {
        const values = form.getFieldsValue();
        console.log(values);
        if(!values.title || !values.description || !values.persona || !values.group){
            alert("All fields are necessary");
        }
        else
        {
            await fetch("/api/task",{
                method:"POST",
                body:JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(data => {
                if(data.success){
                    alert("Task created successfully");
                    reset();
                    window.location.reload();
                }
                else{
                    alert("Task creation failed");
                }
            })
        }
    }
    const reset = () => {
        form.resetFields();
        form.setFieldValue("title","");
        form.setFieldValue("description","");
        form.setFieldValue("persona","");
        form.setFieldValue("group","");
    }
 
  return (
    <div>
        <Form
        
        name="validateOnly"
      layout={"horizontal"}
      form={form}
      initialValues={{ layout: "vertical" }}
    >
      <Form.Item name="title" label="Title"  rules={[{ required: true }]} required tooltip="This is a required field">
        <Input placeholder="Enter title" />
      </Form.Item>
      <Form.Item name="description" label="Description"  rules={[{ required: true }]} required tooltip="This is a required field">
        <Input placeholder="Enter description" />
      </Form.Item>
      <Form.Item name="persona" label="Persona"  rules={[{ required: true }]} required tooltip="This is a required field">
        <Input placeholder="Enter persona" />
      </Form.Item>
      <Form.Item name="group" label="Group"  rules={[{ required: true }]} required tooltip="This is a required field">
        <Input type="Number" placeholder="Enter group no." />
      </Form.Item>
      <Form.Item>
        <div className='flex gap-5 justify-center mt-1'>
        <Button type="primary" onClick={submit}>Submit</Button>
        <Button htmlType="reset" onClick={reset} style={{
            backgroundColor:"red",
            color:"white",
        }}>Reset</Button>
        </div>
      </Form.Item>
    </Form>
    </div>
  )
}

export default CreateForm