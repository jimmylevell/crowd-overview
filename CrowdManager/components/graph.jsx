import { useState, useEffect, createRef } from 'react'
import { Network } from 'vis-network/standalone'

export default function Graph(props) {
  const [appRef, setAppRef] = useState(createRef())

  let options = {
    nodes: {
      color: '#ffffff',
      fixed: false,
      font: '12px arial black',
      scaling: {
        label: true,
      },
      shadow: true,
      shape: 'circle',
      margin: 10,
    },
    edges: {
      arrows: 'to',
      color: 'black',
      scaling: {
        label: true,
      },
      shadow: true,
    },
    interaction: {
      dragNodes: true,
    },
    physics: {
      enabled: false,
    },
  }

  useEffect(() => {
    const network = new Network(appRef.current, props?.data, options)
  }, [props.data])

  return <div className="graph" ref={appRef} />
}
