import {useState, useEffect} from "react"

export const useFetch = <T,>(api: string)=>{
    const [results, setResults] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

     useEffect(()=>{
        const getUsers = async () =>{
            try {
                const res = await fetch(api)
                const data: T = await res.json()
                // console.log(data);
                setResults(data)
                setIsLoading(false)
                
            } catch (error) {
                console.log(error);
               setIsLoading(false)
                
                
            }
        }
        setTimeout(()=> getUsers(), 1000)
        },[api])

        
        return {results, isLoading}
}