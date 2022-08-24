import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "./style.css"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    // make bootstrap js available to the app
    // @ts-ignore
    typeof document !== undefined ? require("bootstrap/dist/js/bootstrap") : null; },[]);

  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}
