import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];
let presentIndex = 1;
let nextIndex = tasks[tasks.length - 1].id + 1;
export function initializeTasks() {
   presentIndex = 1;
}

export function getActiveTasks(): Task[] {
    const allTasks = getAllTasks();
    const completedTasks = getCompletedTasks();
    if(allTasks.length===0 || allTasks.length === completedTasks.length) {
        return [];
    }
  const activeTasks = tasks.filter(task => task.group === presentIndex && !task.completed);
  if(activeTasks.length === 0) {
    presentIndex++;
    return getActiveTasks();
  }
  else
    return activeTasks;
}

export function getCompletedTasks(): Task[] {
  return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function completeTask(taskTitle: string): void {
  const task = tasks.find(t => t.title === taskTitle);
  if (task && !task.completed && task.group === presentIndex) {
    task.completed = true;
    
    const allCompletedInGroup = tasks.filter(t => t.group === presentIndex).every(t => t.completed);
    
    // If all tasks in the current group are completed, activate tasks in the next group
    if (allCompletedInGroup) {
     presentIndex++;
    }
  }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
  const newTask = new Task(nextIndex++, title, description, persona, group);
  tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  }
}

export function deleteTask(taskId: number): void {
  tasks = tasks.filter(t => t.id !== taskId);
}