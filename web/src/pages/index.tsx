import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import Task from "@/model/Task";
import { Badge } from "antd";
import CreateModal from "./CreateModal";

interface RestType {
  name: string;
  data: Task[];
}

interface FormatDataType {
  todo: Task[];
  restData: RestType[];
}

interface TaskWithStatus {
  data: Task;
  status: boolean;
}

export default function Home() {
  const [data, setData] = useState<FormatDataType>();

  const fetchData = async (type: string): Promise<Task[]> => {
    const res = await fetch(`http://localhost:3000/api/task?type=${type}`);
    const responseData = await res.json();
    return responseData.data;
  };

  const formatData = async (): Promise<FormatDataType> => {
    const [completedData, activeData, allData] = await Promise.all([
      fetchData("completed"),
      fetchData("active"),
      fetchData("all"),
    ]);

    let todo = allData.filter(
      (item: Task) =>
        item &&
        !item.completed &&
        !activeData.some((i: Task) => i.id === item.id)
    );

    const inProgress: TaskWithStatus[] = [];

    if (activeData.length === 1) {
      inProgress.push({ data: activeData[0], status: true });
      if (todo.length > 0) {
        inProgress.push({ data: todo[0], status: false });
        todo = todo.slice(1);
      }
    } else if (activeData.length > 1) {
      inProgress.push(
        { data: activeData[0], status: true },
        { data: activeData[1], status: true }
      );
      todo = [...activeData.slice(2), ...todo];
    }

    todo = todo.filter(Boolean);

    return {
      todo,
      restData: [
        { name: "In Progress", data: inProgress.map(item => item.data) },
        { name: "Completed", data: completedData },
      ],
    };
  };

  useEffect(() => {
    const fetchFormattedData = async () => {
      const formattedData = await formatData();
      setData(formattedData);
    };
    fetchFormattedData();
  }, []);

  return (
    <>
      <h1 className="text-center font-bold text-3xl w-full mt-4">Taskboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-15 my-8 w-screen px-[2vw]">
        <CreateModal />
        <TaskSection
          title="To-Do"
          tasks={data?.todo}
          showBadge
          className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]"
        />
        <InProgressSection data={data?.restData[0]} />
        <TaskSection
          title="Completed"
          tasks={data?.restData[1]?.data}
          showBadge
          className="grid grid-cols-2 gap-4 w-[30vw]"
        />
      </div>
    </>
  );
}

interface TaskSectionProps {
  title: string;
  tasks?: Task[];
  showBadge?: boolean;
  className?: string;
}

const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, showBadge, className }) => (
  <div className="flex flex-col gap-5">
    <div className="flex gap-2">
      <h3 className="text-center font-semibold text-lg w-full">
        {title}&nbsp;
        {showBadge && <Badge count={tasks?.length} showZero color="green" />}
      </h3>
    </div>
    <div className={className}>
      {tasks?.map((task: Task) => (
        task && <TaskCard key={task.id} {...task} task={task} boolValue={false} />
      ))}
    </div>
  </div>
);

interface InProgressSectionProps {
  data?: RestType;
}

const InProgressSection: React.FC<InProgressSectionProps> = ({ data }) => (
  <div className="flex flex-col gap-5 w-[100vw] lg:w-[30vw]">
    <div className="flex gap-2">
      <h3 className="text-center font-semibold text-lg w-full">
        In-Progress &nbsp;
        <Badge count={data?.data.length} showZero color="green" />
      </h3>
    </div>
    <div className="gap-6 flex flex-col">
      <div className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]">
        {data?.data.slice(0, 2).map((task: Task, index: number) => (
          <React.Fragment key={task.id}>
            <TaskCard {...task} task={task} boolValue={index === 0} />
            {index === 0 && data.data[1] && data.data[0].group !== data.data[1].group && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);