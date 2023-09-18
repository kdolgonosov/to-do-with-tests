import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
});
describe('to do list', () => {
    test('init render', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        const counterSpan = screen.getByTestId('counter');
        const allBtn = screen.getByText('Все');
        const activeBtn = screen.getByText('Активные');
        const completedBtn = screen.getByText('Завершенные');
        const deleteBtn = screen.getByText('Удалить завершенные');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('');
        expect(addBtn).toBeInTheDocument();
        expect(addBtn).toHaveAttribute('disabled');
        expect(counterSpan).toBeInTheDocument();
        expect(allBtn).toBeInTheDocument();
        expect(allBtn).toHaveAttribute('aria-pressed', 'true');
        expect(activeBtn).toBeInTheDocument();
        expect(activeBtn).toHaveAttribute('aria-pressed', 'false');
        expect(completedBtn).toBeInTheDocument();
        expect(completedBtn).toHaveAttribute('aria-pressed', 'false');
        expect(deleteBtn).toBeInTheDocument();
        expect(deleteBtn).toHaveAttribute('disabled');
    });
    const todos = ['Задача 1', 'Задача 2', 'Задача 3', 'Задача 4', 'Задача 5'];
    test('init localstorage call (todos and tab)', () => {
        render(<App />);
        expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    });
    test('add 1 new todo by click on add button', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        fireEvent.change(input, { target: { value: todos[0] } });
        fireEvent.click(addBtn);
        screen.getByText(todos[0]);
    });
    test('add 5 new todos by click on add button', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        todos.forEach((todo) => {
            fireEvent.change(input, { target: { value: todo } });
            fireEvent.click(addBtn);
        });
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(5);
        todos.forEach((todo) => screen.getByText(todo));
    });
    test('check tabs for active todo', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        const activeBtn = screen.getByText('Активные');
        const completedBtn = screen.getByText('Завершенные');
        fireEvent.change(input, { target: { value: todos[0] } });
        fireEvent.click(addBtn);
        let todo = screen.queryAllByRole('listitem'); // all tab
        expect(todo).toHaveLength(1);
        fireEvent.click(activeBtn);
        todo = screen.queryAllByRole('listitem'); // active tab
        expect(todo).toHaveLength(1);
        fireEvent.click(completedBtn);
        todo = screen.queryAllByRole('listitem'); // completed tab
        expect(todo).toHaveLength(0);
    });
    test('check tabs for completed todo', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        const activeBtn = screen.getByText('Активные');
        const completedBtn = screen.getByText('Завершенные');
        fireEvent.change(input, { target: { value: todos[0] } });
        fireEvent.click(addBtn);
        let todo = screen.queryAllByRole('listitem'); // all tab
        expect(todo).toHaveLength(1);
        fireEvent.click(todo[0]);
        todo = screen.queryAllByRole('listitem'); // all tab
        expect(todo).toHaveLength(1);
        fireEvent.click(activeBtn);
        todo = screen.queryAllByRole('listitem'); // active tab
        expect(todo).toHaveLength(0);
        fireEvent.click(completedBtn);
        todo = screen.queryAllByRole('listitem'); // completed tab
        expect(todo).toHaveLength(1);
    });
    test('delete 1 todo by click on delete completed button', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        const deleteBtn = screen.getByText('Удалить завершенные');
        fireEvent.change(input, { target: { value: todos[0] } });
        fireEvent.click(addBtn);
        const todo = screen.getByRole('listitem'); // all tab
        fireEvent.click(todo);
        fireEvent.click(deleteBtn);
        const todoAfterDelete = screen.queryByRole('listitem');
        expect(todoAfterDelete).toBeNull();
    });
    test('delete 3 todo by click on delete completed button', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByText('Добавить');
        const deleteBtn = screen.getByText('Удалить завершенные');
        todos.forEach((todo) => {
            fireEvent.change(input, { target: { value: todo } });
            fireEvent.click(addBtn);
        });
        const todosBeforeDelete = screen.getAllByRole('listitem'); // all tab
        for (let i = 0; i < 3; i++) {
            fireEvent.click(todosBeforeDelete[i]);
        }
        fireEvent.click(deleteBtn);
        const todosAfterDelete = screen.queryAllByRole('listitem');
        expect(todosAfterDelete).toHaveLength(2);
    });
});
