import React, { useState } from 'react';
import { Card } from 'antd';
import Task from '../model/Task';
import { Button, Divider, Flex, Radio, Space, Tooltip } from 'antd';
import { Form, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

const TaskCard: React.FC<{ task: Task, id:Number, title:String, description:String, persona:String, group:Number, completed:Boolean, boolValue: boolean }> = ({ task, id, title, description, persona, group, completed, boolValue }) => {
  const [position, setPosition] = useState<"start" | "end">("end");
const [startUpdate,setUpdate]=useState<boolean>(false);

const updateClick=()=>{
  setUpdate(true);
  form.setFieldValue("title",title);
  form.setFieldValue("description",description);
  form.setFieldValue("persona",persona);
  form.setFieldValue("group",group);  
}
const [form] = Form.useForm();

    const submit = async() => {
        const values = form.getFieldsValue();
        console.log(values);
        values.id=id;
        if(!values.title || !values.description || !values.persona || !values.group){
            alert("All fields are necessary");
        }
        else
        {
            await fetch("/api/task",{
                method:"PUT",
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
        setUpdate(false);
    }

  const deleteTask = async() => {
    console.log("Task deleted");

    await fetch(("/api/task?id="+id),{
      method:"DELETE",
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(response => response.json())
  .then(data => {
      if(data.success){
          alert("Task deleted successfully");
          window.location.reload();
      }
      else{
          alert("Task deletion failed");
      }
  }
  )
  }
  
  const completeTask = async() => {
    console.log("Task completed");
    await fetch("/api/complete",{
      method:"POST",
      body:JSON.stringify({title:title}),
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(response => response.json())
  .then(data => {
      if(data.success){
          alert("Task completed successfully");
          window.location.reload();
      }
      else{
          alert("Task completion failed");
      }
  })

  }
  // card for each task
  return (

    <Card
      title={"Task " + id}
      size="small"
      bordered={false}
      extra={
        <>
           <Button icon={<CheckOutlined />} onClick={completeTask} iconPosition={position} disabled={!boolValue}>
            Done
          </Button>
          &nbsp;
        </>
      }
      style={{ width: "15vw" }}
      className="bg-white"
    >
        {startUpdate?<div>
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
            <Button type="primary" onClick={submit}>Submit</Button>
            <Button htmlType="reset" onClick={reset}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>:
      <div style={{ textAlign: "center" }} >
        <h3 className="text-center font-semibold text-lg">{title}</h3>
        <Divider />
        {description}
        <div className="flex gap-2 justify-center my-3">
        <Button icon={<CloseOutlined />} iconPosition={position} onClick={deleteTask} className="mt-3 h-7 w-22" >
          <p className="text-sm">Delete</p>
        </Button>
        <Button icon={<EditOutlined />} iconPosition={position} onClick={updateClick} className="mt-3 h-7 w-22">
          <p className="text-sm">Update</p>
        </Button>
        </div>
      </div>

      }
    </Card>
    // </div>
    //   )}
    // </Draggable>
  );
};

export default TaskCard;

// <Draggable draggableId={task.id.toString()} index={index}>
//   {(provided) => (
//     <div
//       ref={provided.innerRef}
//       {...provided.draggableProps}
//       {...provided.dragHandleProps}
//       style={{
//         ...provided.draggableProps.style,
//         margin: "10px",
//       }}
//     >
