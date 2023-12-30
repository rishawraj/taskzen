// import { ReactNode } from "react";

interface TaskType {
  title: string;
  completed: boolean;
  description?: string;
  // list?: string[];
  selectedListItem?: string;
  dueDate?: string;
  tags?: string[];
  subTasks?: SubTaskType[];
}

interface SubTaskType {
  title: string;
  completed: boolean;
}

interface NavBarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

interface TaskProps {
  index: number;
  task: TaskType;
  handleToggle: (index: number) => void;
  handleDelete: (index: number) => void;
  handleEdit: (index: number, task: TaskType) => void;
}

interface TaskFormProps {
  index: number;
  task: TaskType;
  handleEdit: (index: number, task: TaskType) => void;
  closeModal: () => void;
}
