import React from 'react';

interface MyTasksWidgetProps {
  widgetId: string;
}

const MyTasksWidget: React.FC<MyTasksWidgetProps> = ({ widgetId }) => {
  const tasks = [
    { id: 't1', name: 'Enviar informe mensual', completed: true },
    { id: 't2', name: 'Crear informe mensual', completed: true },
    { id: 't3', name: 'Crear disñin Glassmobrim...', completed: true },
    { id: 't4', name: 'Investigar nuevas APIS', completed: false },
  ];

  return (
    <div className="flex flex-col h-full text-white p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-blue-200">Mis Tareas</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m7.5-15v15m-13.5 0H15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015 4.5H3.75z" />
        </svg>
      </div>

      <ul className="space-y-2 flex-grow overflow-y-auto custom-scrollbar">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center text-sm">
            <div className="relative flex items-center">
              <input
                type="radio" // Using radio to simulate the circular unselected state
                id={`task-${widgetId}-${task.id}`}
                checked={task.completed}
                readOnly
                className="sr-only" // Hide native radio button
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200
                  ${task.completed ? 'bg-green-500 border-green-500' : 'border-white/50'}
                `}
                aria-hidden="true" // Hide from screen readers as native input is present
              >
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>
            <label htmlFor={`task-${widgetId}-${task.id}`} className={task.completed ? 'line-through text-white/60' : 'text-white/90'}>
              {task.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTasksWidget;