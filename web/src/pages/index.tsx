import React, { useEffect, useState } from "react";
// import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { initialTasks } from "@/utils/TaskList";
import { Inter } from "next/font/google";
// import { useStateValue } from "@/context/StateProvider";
import Task from "@/model/Task";
const inter = Inter({ subsets: ["latin"] });
import { Badge, Space, Switch } from "antd";
import CreateModal from "./CreateModal";

type RestType = {
  name: string;
  data: any;
};
type FormatDataType = {
  todo: Task[];
  restData: RestType[];
};

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);

  // Backend api calls
  const getActiveData = async () => {
    const res = await fetch("http://localhost:3000/api/task?type=active");
    const data = await res.json();
    return data.data;
  };
  const getCompletedData = async () => {
    const res = await fetch("http://localhost:3000/api/task?type=completed");
    const data = await res.json();
    return data.data;
  };
  const getAllData = async () => {
    const res = await fetch("http://localhost:3000/api/task?type=all");
    const data = await res.json();
    return data.data;
  };
  const formatData = async () => {
    const completedData = await getCompletedData();
    const activeData = await getActiveData();
    console.log(activeData);
    const allData = await getAllData();
    console.log(allData);
    let inProgress = [];
    let todo = allData.filter(
      (item: Task) =>
        item !== undefined &&
        item.id !== undefined &&
        !item.completed &&
        activeData.findIndex((i: Task) => i.id === item.id) === -1
    );

    if (activeData.length === 1) {
      if(todo.length>0)
      {
        inProgress.push(
          { data: activeData[0], status: true },
          { data: todo[0], status: false }
        );
        todo = todo.slice(1);
      }
      else
      {
        inProgress.push(
          { data: activeData[0], status: true }
        );
      }
    } else if (activeData.length > 1) {
      inProgress.push(
        { data: activeData[0], status: true },
        { data: activeData[1], status: true }
      );
      const actdata=activeData.slice(2);
      todo=[...actdata,...todo];
    }
    console.log("todo",todo)
    if(todo[0]==undefined)
      todo=todo.slice(1);
    console.log("todo",todo)
    return {
      todo: todo,
      restData: [
        { name: "In Progress", data: inProgress },
        { name: "Completed", data: completedData },
      ],
    };
  };

  const [data, setData] = useState<FormatDataType>();
  useEffect(() => {
    const f = async () => {
      const d: any = await formatData();
      console.log(d);
      setData(d);
    };
    f();
  }, []);

  return (
    <>
    <h1 className="text-center font-bold text-3xl w-[100%] mt-4">Taskboard</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-15 my-8 w-screen px-[2vw]">
      {/* Create Modal for creating a task */}
      <CreateModal />
      {/* To Do Section */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          <h3 className="text-center font-semibold text-lg w-[100%]">
            To-Do&nbsp;{" "}
            <Badge
              count={data !== undefined && data.todo.length}
              showZero
              color="green"
            />
          </h3>
        </div>
          <div className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]">
            {data !== undefined &&
              data.todo.map((task: Task, index: number) => (
                <>
                  {" "}
                  {task !== undefined && (
                    <TaskCard key={task.id} id={task.id} title={task.title} description={task.description} persona={task.persona} group={task.group} completed={task.completed} task={task} boolValue={false} />
                  )}{" "}
                </>
              ))}
          </div>
        </div>
      {/* In Progress Section */}
      <div className="flex flex-col gap-5 w-[100vw] lg:w-[30vw]">
        <div className="flex gap-2">
          <h3 className="text-center font-semibold text-lg w-[100%]">
            In-Progress &nbsp;
            <Badge
              count={data !== undefined && data.restData[0].data.length}
              showZero
              color="green"
            />
          </h3>
        </div>
        <div className="gap-6 flex flex-col">
          <div className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]">
              {data!==undefined && data.restData[0].data.length>0 &&
              <TaskCard task={data !== undefined && data.restData[0].data[0].data} 
                id={data !== undefined && data.restData[0].data[0].data.id}
                title={data !== undefined && data.restData[0].data[0].data.title}
                description={data !== undefined && data.restData[0].data[0].data.description}
                persona={data !== undefined && data.restData[0].data[0].data.persona}
                group={data !== undefined && data.restData[0].data[0].data.group}
                completed={data !== undefined && data.restData[0].data[0].data.completed}
                boolValue={true}
              />}
              {data!==undefined && data.restData[0].data.length>1 && data.restData[0].data[0].data.group!==data.restData[0].data[1].data.group && <br/>}      

              {data!==undefined && data.restData[0].data.length>1 && <TaskCard task={data !== undefined && data.restData[0].data[1].data} 
              id={data !== undefined && data.restData[0].data[1].data.id} 
              title={data !== undefined && data.restData[0].data[1].data.title}
              description={data !== undefined && data.restData[0].data[1].data.description}
              persona={data !== undefined && data.restData[0].data[1].data.persona}
              group={data !== undefined && data.restData[0].data[1].data.group}
              completed={data !== undefined && data.restData[0].data[1].data.completed}
              boolValue={data!==undefined && data.restData[0].data[0].data.group===data.restData[0].data[1].data.group}/>}
          </div>
        </div>
      </div>
      {/* Completed section */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          <h3 className="text-center font-semibold text-lg w-[100%]">
            Completed &nbsp;
            <Badge
              count={data !== undefined && data.restData[1].data.length}
              showZero
              color="green"
            />
          </h3>
        </div>
        <div className="gap-6 flex flex-col">
          <div className="grid grid-cols-2 gap-4 w-[30vw]">
            {data !== undefined &&
              data.restData[1].data.map((task: Task, index: number) => (
                <>
                  {" "}
                  {task !== undefined && (
                    <TaskCard key={task.id} id={task.id} title={task.title} description={task.description} persona={task.persona} group={task.group} completed={task.completed} task={task} boolValue={false}/>
                  )}{" "}
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}