"use client";


interface Props {

    current:number;

    total:number;

}





export default function ChunkProgress({

    current,

    total

}:Props){



if(total===0){

    return null;

}




const percentage = Math.round(

    ((current + 1) / total) * 100

);





return (


<div

className="
mb-5
"

>



<div

className="
flex
justify-between
text-xs
text-gray-500
mb-2
"

>


<span>

Reading Progress

</span>


<span>

{percentage}%

</span>


</div>






<div

className="
h-2
rounded-full
bg-gray-200
overflow-hidden
"

>



<div


className="
h-full
bg-blue-600
transition-all
duration-300
"

style={{

width:`${percentage}%`

}}


/>



</div>





</div>



);


}