import { useSession } from "@clerk/clerk-react";
import { useState } from "react"

const useFetch = (cb,options={})=>{

    const [data,setData]=useState(undefined);
     const [loading,setLoading]=useState(undefined);
      const [error,setError]=useState(null);

    const {session}= useSession()

    const fn= async(...args)=>{
        setLoading(true)
        setError(null)

        try{
             const supabaseAccessToken= await session.getToken({
                template:"supabase",
        })
        const response =await cb(supabaseAccessToken,options,...args)
        setData(response)
        setError(null)
        return response; // Return response for .then() blocks
    }catch(error){
        setError(error)
        throw error; // Re-throw so .then() doesn't fire on failure
    }finally{
        setLoading(false)
    }
};
 return{fn, data , loading, error}
}
export default useFetch;