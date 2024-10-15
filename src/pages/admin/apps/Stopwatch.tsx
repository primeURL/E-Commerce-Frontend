import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";


const formatTime = (timeInSeconds:number)=>{
  const hours = String(Math.floor(timeInSeconds / 3600));
  const minutes = String(Math.floor((timeInSeconds % 3600)/60));
  const seconds = String(timeInSeconds % 60);

  return `${hours.padStart(2,"0")}:${minutes.padStart(2,"0")}:${seconds.padStart(2,"0")}`
}

const Stopwatch = () => {
  const [time,setTime] = useState<number>(0)
  const [isRunning,setIsRunning] = useState<boolean>(false)

  useEffect(()=>{
    let intervalId : any;
    if(isRunning){
      intervalId = setInterval(()=>{
        setTime((prev)=> prev + 1);
      },1000)
    }

    return () => clearInterval(intervalId)
  },[isRunning])

  function resetHandler(){
    setTime(0)
    setIsRunning(false)
  }
  return (
    <div className="adminContainer">
      {/* AdminSideBar */}
      <AdminSidebar />
      {/* Main Content */}
      <main className="dashboardAppContainer">
        <h1>Stopwatch</h1>
        <section>
          <div className="stopwatch">
            <h2>{formatTime(time)}</h2>
            <button onClick={()=>setIsRunning((prev)=>!prev)}>{isRunning ? "Stop" : "Start"}</button>
            <button onClick={resetHandler}>Reset</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Stopwatch;
