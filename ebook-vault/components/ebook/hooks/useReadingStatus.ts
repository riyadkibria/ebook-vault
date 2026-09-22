"use client";


import {

  useEffect,

  useState

} from "react";





export type Status =

  | "reading";





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


      try{


        setStatuses(

          JSON.parse(saved)

        );


      }

      catch{


        localStorage.removeItem(KEY);


      }


    }



  },[]);









  function save(

    data:Record<string,Status>

  ){



    setStatuses(data);



    localStorage.setItem(

      KEY,

      JSON.stringify(data)

    );


  }









  function toggleStatus(

    file:string

  ){



    const exists =

      statuses[file];







    const updated = {


      ...statuses



    };








    if(exists){



      // remove marker

      delete updated[file];



    }

    else{



      // add marker

      updated[file]="reading";



    }







    save(updated);



  }









  function getStatus(

    file:string

  ){



    return statuses[file] ?? null;


  }








  return {


    statuses,


    toggleStatus,


    getStatus,


  };



}