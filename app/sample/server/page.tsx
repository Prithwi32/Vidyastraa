import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function page() {
  // server side usage
  const session = await getServerSession(NEXT_AUTH);

  if (session === null) return <div>Not logged in</div>;

  console.log(session.user); // session.user.id will give database user id
  return <div>{JSON.stringify(session.user)}</div>;
}

export default page;
