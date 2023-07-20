import { useEffect, useState, React } from 'react';

function App() {
  const [access_token, setAccessToken] = useState();
  
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(response => setAccessToken(response.access_token))
  }, [setAccessToken]);
  
  return (
    <div><h1>Hello World</h1> greetings from the backend: {access_token} v1417</div>
  );
} 

export default App;