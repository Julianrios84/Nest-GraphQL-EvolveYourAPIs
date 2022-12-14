import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/inputs/create-todo.input';
import { UpdateTodoInput } from './dto/inputs/update-todo.input';
import { Todo } from './entity/todo.entity';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {

  private todos: Todo[] = [
    { id: 1, description: 'Piedra del Alma', done: false },
    { id: 2, description: 'Piedra del Tiempo', done: false },
    { id: 3, description: 'Piedra del Espacio', done: true },
  ];

  get totalTodos(): number {
    return this.todos.length
  }

  get pendingTodos(): number {
    return this.todos.filter(todo => todo.done === false).length;
  }

  get completedTodos(): number {
    return this.todos.filter(todo => todo.done === true).length;
  }

  findAll({ status }: StatusArgs): Todo[] {
    if(status !== undefined) return this.todos.filter(todo => todo.done === status)
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) throw new NotFoundException(`TODO with #${id} not found.`);
    return todo;
  }

  create({ description }: CreateTodoInput): Todo {
    const todo = new Todo();
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1;
    todo.description = description;
    this.todos.push(todo);
    return todo;
  }

  update({ id, description, done }: UpdateTodoInput): Todo {
    const todo = this.findOne(id);
    if (done !== undefined) todo.done = done;
    if (description) todo.description = description;

    this.todos = this.todos.map((item) => {
      return (item.id === id) ? todo: item;
    });

    return todo;
  }

  remove(id: number) {
    this.findOne(id);
    this.todos = this.todos.filter(todo => todo.id !== id)
    return `This action removes a #${id} todo`;
  }


}
