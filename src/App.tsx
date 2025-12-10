import React from 'react';
import { useStore } from './store/useStore';
import { FormBuilder } from './components/FormBuilder';
import { ProjectManager } from './components/ProjectManager';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const { currentProject } = useStore();

  return (
    <ThemeProvider>
      {currentProject ? (
        <FormBuilder />
      ) : (
        <ProjectManager />
      )}
    </ThemeProvider>
  );
}

export default App;
