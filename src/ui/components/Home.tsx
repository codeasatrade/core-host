import { useEffect, useState } from "react";

function Home() {
  const [setupStatus, setSetupStatus] = useState("");

  const fetchSetupStatus = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect,
      };

      const response = await fetch(
        "http://localhost:3000/initsetup",
        requestOptions
      );
      const data = await response.json();
      console.log("*****Data fetched from API:*****", data["message"]);
      setSetupStatus(data["message"]);
    } catch (error) {
      console.error("*****Error fetching setup status:*****", error);
      setSetupStatus("Error fetching setup status");
    }
  };

  useEffect(() => {
    fetchSetupStatus();
  }, []);

  return (
    <div>
      <button onClick={fetchSetupStatus}>Fetch Setup Status</button>
      <br />
      {setupStatus}
    </div>
  );
}

export default Home;
