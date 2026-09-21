"use client";


interface Props {

    value:number;

    onChange:(value:number)=>void;

}





const sizes = [

    500,

    1000,

    1500,

    2000,

    3000,

    5000

];





export default function ChunkSizeSelector({

    value,

    onChange

}:Props){



return (

<div

className="
flex
items-center
gap-2
"

>


<label

className="
text-sm
text-gray-600
"

>

Chunk Size

</label>





<select


value={value}


onChange={(e)=>

    onChange(

        Number(e.target.value)

    )

}


className="
border
rounded-lg
px-3
py-2
bg-white
text-sm
"

>


{

sizes.map(size=>(


<option

key={size}

value={size}

>

{size.toLocaleString()} words

</option>


))

}



</select>



</div>


);


}