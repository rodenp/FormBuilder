import React from 'react';
import { useStore } from './store/useStore';
import { FormBuilder } from './components/FormBuilder';
import { ProjectManager } from './components/ProjectManager';

function App() {
  const { currentProject } = useStore();

  return (
    <>
      {currentProject ? (
        <FormBuilder />
      ) : (
        <ProjectManager />
      )}
    </>
  );
}

export default App;
