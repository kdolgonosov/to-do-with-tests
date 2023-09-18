export interface ITodo {
    id: number;
    text: string;
    isCompleted: boolean;
}
export enum EView {
    all = 'all',
    active = 'active',
    completed = 'completed',
}
