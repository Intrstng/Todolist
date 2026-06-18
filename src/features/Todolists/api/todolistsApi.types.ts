export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type UpdateTodolistArg = {
  id: string
  title: string
}

export type AddTodolistArg = {
  title: string
}

export type DeleteTodolistArg = {
  id: string
}


// Generic for response
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};

export type DataType = {
  title: string;
};

