export interface Todo {
    id: number;
    title: string,
    description: string;
    completed: boolean;
  }

export interface Column {
  id: number;
  title: string,
  todos: Todo[]
}
export interface Kanban {
  id: number;
  columns: Column[]
}