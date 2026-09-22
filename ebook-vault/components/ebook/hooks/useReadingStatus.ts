"use client";


import {
  useEffect,
  useState
} from "react";



type Status =
  | "unread"
  | "reading"
  | "completed";



const KEY =
"ebook-reading-status";



export function useReadingStatus(){


  const [
    statuses,
    setStatuses
  ] = useState<Record<string,Status>>({});




  useEffect(()=>{


    const saved =
      localStorage.getItem(KEY);


    if(saved){

      setStatuses(
        JSON.parse(saved)
      );

    }


  },[]);





  function updateStatus(

    file:string,

    status:Status

  ){


    const updated = {

      ...statuses,

      [file]:status

    };



    setStatuses(updated);



    localStorage.setItem(

      KEY,

      JSON.stringify(updated)

    );


  }





  function getStatus(

    file:string

  ):Status{


    return (

      statuses[file]

      ??

      "unread"

    );


  }





  return {

    statuses,

    updateStatus,

    getStatus,

  };


}