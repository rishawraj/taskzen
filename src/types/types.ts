interface TaskType {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
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
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

interface TaskProps {
  index: number;
  task: TaskType;
  handleToggle: (ID: string) => void;
  handleDelete: (ID: string) => void;
  handleEdit: (ID: string, task: TaskType) => void;
  openSideModal: () => void;
}

interface TaskFormProps {
  index: number;
  task: TaskType;
  handleEdit: (ID: string, task: TaskType) => void;
  closeModal: () => void;
}
