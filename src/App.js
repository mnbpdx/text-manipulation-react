import React from 'react';
import BonoboParagraph from './text-manipulation';
function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 p-4">
        <h1 className="text-3xl font-bold text-white">Text Manipulation</h1>
      </header>
      <main className="container mx-auto mt-8">
        <BonoboParagraph />
      </main>
    </div>
  );
}

export default App;