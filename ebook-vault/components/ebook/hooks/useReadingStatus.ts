"use client";


import {

  useEffect,

  useState

} from "react";





export type Status =

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









  function updateStatus(


    file:string,


    status:Status


  ){



    save({


      ...statuses,


      [file]:status



    });



  }









  function toggleStatus(


    file:string


  ){



    const current =


      statuses[file]

      ??

      "unread";







    let next:Status;






    if(current==="unread"){


      next="reading";


    }


    else if(current==="reading"){


      next="completed";


    }


    else{


      next="unread";


    }







    updateStatus(

      file,

      next

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


    toggleStatus,


    getStatus,


  };



}