/*
 ** Realm Data base Schema Declaration
 */
export const TO_DO_LIST = 'ToDoList';
export const ToDoListSchema = {
  name: TO_DO_LIST,
  primaryKey: 'id',
  properties: {
    id: 'int', // primary key
    title: 'string',
    detail: 'string',
    done: 'bool',
    date: 'date',
  },
};
