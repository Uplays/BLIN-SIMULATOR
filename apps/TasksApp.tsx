import React from 'react';
import GlassCard from '../components/GlassCard';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress?: number; // For in-progress tasks
}

const tasks: Task[] = [
  { id: '1', name: 'Refinar Mockups UI', status: 'pending' },
  { id: '2', name: 'Investigar APIs Cloud', status: 'pending' },
  { id: '3', name: 'Planificar Reunión Stakeholders', status: 'pending' },
  { id: '4', name: 'Planificar Reunión', status: 'pending' },
  { id: '5', name: 'Implementar Módulo de Autenticación', status: 'in-progress', progress: 60 },
];

interface TasksAppProps {
  windowId: string;
  onClose: () => void;
}

const TasksApp: React.FC<TasksAppProps> = ({ windowId, onClose }) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');

  return (
    <div className="flex flex-col h-full text-white p-4">
      <h1 className="text-2xl font-bold text-center text-blue-300 drop-shadow-lg mb-6 flex-shrink-0">BLIN Tareas</h1>
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden gap-4">
        {/* Pending Tasks */}
        <GlassCard className="flex-1 p-4 flex flex-col overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-semibold mb-4 text-blue-200">Pendiente</h2>
          <ul className="space-y-3">
            {pendingTasks.map(task => (
              <li key={task.id} className="flex items-center text-lg text-white/90">
                <input type="radio" name="pending-task" className="form-radio text-blue-500 bg-white/10 border-white/30 mr-3" />
                <span>{task.name}</span>
              </li>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-white/60">No pending tasks.</p>
            )}
          </ul>
        </GlassCard>

        {/* In Progress Tasks */}
        <GlassCard className="flex-1 p-4 flex flex-col overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-semibold mb-4 text-blue-200">En Progreso</h2>
          <ul className="space-y-4">
            {inProgressTasks.map(task => (
              <li key={task.id} className="flex flex-col text-white/90">
                <div className="flex items-center justify-between text-lg mb-2">
                  <span>{task.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </div>
                {task.progress !== undefined && (
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div
                      className="bg-blue-400 h-2.5 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                )}
                {task.progress !== undefined && <span className="text-sm text-white/70 mt-1">{task.progress}%</span>}
              </li>
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-white/60">No tasks in progress.</p>
            )}
          </ul>
        </GlassCard>
      </div>

      {/* Example BLIN notification, as seen in images */}
      <div className="flex justify-end mt-6 flex-shrink-0">
        <GlassCard className="p-4 bg-green-800/30 border-green-500">
          <p className="text-sm font-medium text-white">BLIN: "Implementarlo" require 3 libs. ¿Auto-instaltar dependencias?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-green-400 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default TasksApp;