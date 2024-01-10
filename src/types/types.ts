interface TagType {
  id: string;
  name: string;
}

interface TaskType {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  selectedListItem?: string;
  dueDate?: string;
  tags?: TagType[];
  subTasks?: SubTaskType[];
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
  task: TaskType;
  handleToggle: (ID: string) => void;
  handleDelete: (ID: string) => void;
  handleEdit: (ID: string, task: TaskType) => void;
  // openSideModal: (ID: string) => void;
  openSideModal: () => void;
  updateCurrTask: (ID: string) => void;
}

interface TaskFormProps {
  index: number;
  task: TaskType | undefined;
  handleEdit: (ID: string, task: TaskType) => void;
  closeModal: () => void;
}

export { TaskType, TagType, TaskFormProps, TaskProps, NavBarProps };
