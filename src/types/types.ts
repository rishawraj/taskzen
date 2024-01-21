interface TagType {
  id: string;
  name: string;
}

interface TaskType {
  _id?: string;
  title: string;
  completed: boolean;
  description?: string;
  selectedListItem?: string;
  dueDate?: string;
  tags?: TagType[];
  subTasks?: SubTaskType[];
  user?: string;
}

export interface TaskTypeResponse {
  error?: any;
  _id?: string;
  title: string;
  completed: boolean;
  description?: string;
  selectedListItem?: string;
  dueDate?: string;
  tags?: TagType[];
  subTasks?: SubTaskType[];
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubTaskType {
  id: string;
  title: string;
  completed: boolean;
}

interface NavBarProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

interface TaskProps {
  index: number;
  task: TaskTypeResponse;
  handleToggle: (ID: string, completed: boolean) => void;
  handleDelete: (ID: string) => void;
  handleEdit: (ID: string, task: TaskTypeResponse) => void;
  // openSideModal: (ID: string) => void;
  openSideModal: () => void;
  updateCurrTask: (ID: string) => void;
}

interface TaskFormProps {
  index: number;
  task: TaskTypeResponse | undefined;
  handleEdit: (ID: string, task: TaskTypeResponse) => void;
  closeModal: () => void;
}

export enum TaskDateCategory {
  UPCOMING = "UPCOMING",
  TODAY = "TODAY",
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export interface DeleteResponse {
  message: string;
  deletedTasks: {
    acknowledged: boolean;
    deletedCount: number;
  };
}

export interface ListResponse {
  _id?: string;
  name: string;
  // Assuming tasks can be any type; replace with the actual type if known
  tasks?: any[];
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export { TaskType, TagType, TaskFormProps, TaskProps, NavBarProps };
