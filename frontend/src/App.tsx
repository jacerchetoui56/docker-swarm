import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<{ title: string; content: string }[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000");
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setData(result);
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>An Error occured</div>;
  }
  return (
    <div>
      {data?.map((item, index) => (
        <div key={index}>
          <h2>{item.title}</h2>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
