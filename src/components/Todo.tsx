import { ListItem, Checkbox, ListItemIcon, ListItemText } from '@mui/material';
import { ITodo } from '../interfaces/interfaces';

interface TodoProps {
    todo: ITodo;
    completeTodo: (id: number) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, completeTodo }) => {
    return (
        <ListItem
            onClick={() => completeTodo(todo.id)}
            divider
            sx={{
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                backgroundColor: todo.isCompleted ? '#bdb9b9' : 'transparent',
                transition: 'all 0.4s ease',
                '&:hover': {
                    cursor: 'pointer',
                    opacity: 0.8,
                    backgroundColor: '#d4cfcf',
                },
            }}
        >
            <ListItemIcon>
                <Checkbox edge='start' checked={todo.isCompleted} disableRipple />
            </ListItemIcon>
            <ListItemText primary={todo.text} />
        </ListItem>
    );
};

export default Todo;
