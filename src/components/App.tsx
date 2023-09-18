import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    List,
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { EView, ITodo } from '../interfaces/interfaces';
import Todo from './Todo';

const App = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedView, setSelectedView] = useState<EView>(EView.all);

    useEffect(() => {
        const localTodos = localStorage.getItem('todos');
        const localSelectedView = localStorage.getItem('selectedView') as EView;
        localTodos && setTodos(JSON.parse(localTodos));
        localSelectedView && setSelectedView(localSelectedView);
    }, []);
    useEffect(() => {
        setFilteredTodos(
            todos.filter((todo) =>
                selectedView === 'all'
                    ? todo
                    : selectedView === 'active'
                    ? todo.isCompleted === false
                    : todo.isCompleted === true,
            ),
        );
    }, [selectedView, todos]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleChangeView = (event: React.MouseEvent<HTMLElement>, newAlignment: EView) => {
        setSelectedView(newAlignment);
        localStorage.setItem('selectedView', newAlignment);
    };
    const addTodo = () => {
        setTodos((prev) => [{ id: Date.now(), text: inputValue, isCompleted: false }, ...prev]);
        localStorage.setItem(
            'todos',
            JSON.stringify([{ id: Date.now(), text: inputValue, isCompleted: false }, ...todos]),
        );
        setInputValue('');
    };
    const completeTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
            ),
        );
        localStorage.setItem(
            'todos',
            JSON.stringify(
                todos.map((todo) =>
                    todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
                ),
            ),
        );
    };
    const deleteCompletedTodos = () => {
        setTodos((prev) => prev.filter((todo) => todo.isCompleted !== true));
        localStorage.setItem(
            'todos',
            JSON.stringify(todos.filter((todo) => todo.isCompleted !== true)),
        );
    };
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextField
                    inputProps={{ 'data-testid': 'input' }}
                    label='Что нужно сделать?'
                    variant='outlined'
                    sx={{ width: '79%' }}
                    onChange={handleInputChange}
                    value={inputValue}
                />
                <Button
                    variant='contained'
                    sx={{ width: '20%' }}
                    disabled={inputValue.length === 0}
                    onClick={addTodo}
                >
                    Добавить
                </Button>
            </Box>
            <List>
                {filteredTodos.map((todo) => (
                    <Todo key={todo.id} todo={todo} completeTodo={completeTodo} />
                ))}
            </List>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography
                    data-testid='counter'
                    component='span'
                    variant='caption'
                    sx={{ textAlign: 'start', width: '20%' }}
                >
                    {todos.length !== 0 &&
                        `${todos.filter((todo) => todo.isCompleted).length}/${
                            todos.length
                        } выполнено`}
                </Typography>
                <ToggleButtonGroup
                    color='primary'
                    value={selectedView}
                    exclusive
                    onChange={handleChangeView}
                    aria-label='Platform'
                >
                    <ToggleButton value={EView.all}>Все</ToggleButton>
                    <ToggleButton value={EView.active}>Активные</ToggleButton>
                    <ToggleButton value={EView.completed}>Завершенные</ToggleButton>
                </ToggleButtonGroup>
                <Button
                    variant='contained'
                    sx={{ width: '20%' }}
                    disabled={!todos.some((todo) => todo.isCompleted === true)}
                    onClick={deleteCompletedTodos}
                >
                    Удалить завершенные
                </Button>
            </Box>
        </Container>
    );
};

export default App;
