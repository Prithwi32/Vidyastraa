"use client"

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

  // session.data.user.id will give database user id if authenticated
  return (
    <div>{JSON.stringify(session)}</div>
  )
}

export default page