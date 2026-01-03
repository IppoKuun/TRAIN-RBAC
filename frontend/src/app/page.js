"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"



export default function Home(){
  const Router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(false)

  const  handleSubmit = async(e) => {
    e.preventDefault()
    try {
      setLoading(true)
    const data = {username:username, password:password}
    const res = await fetch("http://localhost:4000/auth/login",{
      method: "POST",
      body: JSON.stringify({data}) ,
      credentials:"include" ,
      headers: {'Content-Type': 'application/json'}
  })

    const JSONres = await res.json()  
    if (!res.ok){
      setMsg(JSONres.err)
      return
    }
    Router.push("/admin/AdminHome")

    } catch(e){
      setMsg(`Erreur lors de la connection avec le serveur ${e}`)
    }finally{
      setLoading(false)
    }

  }
   return (
    <main className="flex flex-col  text-black justify-center items-center min-h-screen bg-white">
      {msg && (
        <div className="w-100 h-20 bg-red-500 rounded-xl shadow text-white flex mb-15 items-center justify-center">{msg}</div>
      )}
      <form className="max-w-140  flex flex-col items-center justify-center w-full font-bold h-100 rounded-xl shadow border border-black" 
      onSubmit={handleSubmit}>
        <h1 className="text-4xl mt-5 ">Connectez-vous</h1>
        <div className="self-start mt-10 w-full px-4">
          <label className="font-light">Username</label>
          <input value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl shadow border border-gray bg-gray-100 h-10 "
          placeholder="username"
          ></input>
        </div>
        <div className="self-start w-full mt-5 px-4">
          <label className="font-light">password</label>
          <input value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl shadow border border-gray bg-gray-100 h-10 "
          placeholder="username"
          type="password"
          ></input>

          <button disabled={loading} className="py-4 w-full mt-10 text-bold bg-black text-white cursor-pointer rounded-xl">
            {loading ? "Connexion..." : "Se connectez"}
          </button>
        </div>
      </form>

    </main>
  )
}