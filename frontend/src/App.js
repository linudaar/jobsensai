import { useEffect, useState, React } from 'react';

function App() {
  const [greeting, setGreeting] = useState();
  
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(greeting => setGreeting(greeting.message))
  }, [setGreeting]);
  
  return (
    <div><h1>Hello World</h1> greetings from the backend: {greeting} v1417</div>
  );
} 

export default App;