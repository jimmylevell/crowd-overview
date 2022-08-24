import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="profile text-right">
        Welcome, <i className="bi bi-person"></i> {session.user.email} <br />
        <button className="btn btn-outline-primary" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div className="profile text-right">
      Not signed in <br />
      <button className="btn btn-primary" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}
