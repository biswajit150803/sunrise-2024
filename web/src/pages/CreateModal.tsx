import React, { useState } from "react";
import { Button, Modal } from "antd";
import CreateForm from "./CreateForm";
import { PlusOutlined } from "@ant-design/icons";
const CreateModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-blue-400 hover:bg-blue-600  font-bold p-4 rounded-full"
        onClick={showModal}
      >
        <PlusOutlined style={{
            color:"white"
        }}/>
      </button>
      <Modal title="Title" open={open} footer={[<></>]} onCancel={handleCancel}>
        <CreateForm />
      </Modal>
    </>
  );
};

export default CreateModal;
