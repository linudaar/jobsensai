import { useEffect, useState, React } from 'react';

function App() {
  const [greeting, setGreeting] = useState();
  
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(greeting => setGreeting(greeting.message))
  }, [setGreeting]);
  
  return (
    <div>Hello World, greetings from the backend: {greeting}</div>
  );
} 

export default App;