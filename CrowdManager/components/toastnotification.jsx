import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default function ToastNotification(props) {
  const [body, setBody] = useState('')

  useEffect(() => {
    if (props.body) {
      if (props.error) {
        setBody(props.body + ' ' + props.error)
        notifyError(props.body + ' ' + props.error)
      } else {
        setBody(props.body)
        notifySuccess(props.body)
      }
    }
  }, [props.body])

  const notifySuccess = (message) =>
    toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

  const notifyError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const notifyWarn = (message) => {
    toast.warn(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  return <ToastContainer />
}
