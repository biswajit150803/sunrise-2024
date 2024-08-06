import React, { useState } from 'react';
import { Button, Divider, Card, Form, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

interface TaskProps {
  id: number;
  title: string;
  description: string;
  persona: string;
  group: number;
  boolValue: boolean;
}

interface Task {
  // Define the Task interface properties here
}

const TaskCard: React.FC<TaskProps> = ({ id, title, description, persona, group, boolValue }) => {
  const [startUpdate, setStartUpdate] = useState<boolean>(false);
  const [form] = Form.useForm();

  const updateClick = () => {
    setStartUpdate(true);
    form.setFieldsValue({ title, description, persona, group });
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      values.id = id;

      const response = await fetch('/api/task', {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Task updated successfully');
        reset();
        window.location.reload();
      } else {
        alert('Task update failed');
      }
    } catch (error) {
      alert('All fields are necessary');
    }
  };

  const reset = () => {
    setStartUpdate(false);
  };

  const deleteTask = async () => {
    try {
      const response = await fetch(`/api/task?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Task deleted successfully');
        window.location.reload();
      } else {
        alert('Task deletion failed');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completeTask = async () => {
    try {
      const response = await fetch('/api/complete', {
        method: 'POST',
        body: JSON.stringify({ title }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Task completed successfully');
        window.location.reload();
      } else {
        alert('Task completion failed');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <Card
      title={`Task ${id}`}
      size="small"
      bordered={false}
      extra={
        <Button icon={<CheckOutlined />} onClick={completeTask} disabled={!boolValue}>
          Done
        </Button>
      }
      style={{ width: '15vw' }}
      className="bg-white"
    >
      {startUpdate ? (
        <Form form={form} layout="horizontal" initialValues={{ layout: 'vertical' }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]} required tooltip="This is a required field">
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]} required tooltip="This is a required field">
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item name="persona" label="Persona" rules={[{ required: true }]} required tooltip="This is a required field">
            <Input placeholder="Enter persona" />
          </Form.Item>
          <Form.Item name="group" label="Group" rules={[{ required: true }]} required tooltip="This is a required field">
            <Input type="number" placeholder="Enter group no." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submit}>Submit</Button>
            <Button htmlType="button" onClick={reset}>Cancel</Button>
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 className="text-center font-semibold text-lg">{title}</h3>
          <Divider />
          {description}
          <div className="flex gap-2 justify-center my-3">
            <Button icon={<CloseOutlined />} onClick={deleteTask} className="mt-3 h-7 w-22">
              <span className="text-sm">Delete</span>
            </Button>
            <Button icon={<EditOutlined />} onClick={updateClick} className="mt-3 h-7 w-22">
              <span className="text-sm">Update</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;