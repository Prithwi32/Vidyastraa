"use client"

import { sampleTest } from "@/app/actions/test";
import { useSession } from "next-auth/react"

function page() {
  // client side usage
  const session = useSession();  

  // session.status is either "authenticated" or "unauthenticated" or "loading"
  if(session.status=="loading"){
    return (
      <div>Loading...</div>
    )
  }

  const onClickHandler = async () => {
    const res = await sampleTest();
    console.log(res);
  }

  // session.data.user.id will give database user id if authenticated
  return (
    <div>{JSON.stringify(session)}
    <button className="text-white" onClick={onClickHandler}>click me</button>
    </div>
  )
}

export default page