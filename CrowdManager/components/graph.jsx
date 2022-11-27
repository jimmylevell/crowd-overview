import { useState, useEffect, createRef } from 'react'
import { Network } from 'vis-network/standalone'

export default function Graph(props) {
  const [appRef, setAppRef] = useState(createRef())

  let options = {
    nodes: {
      color: '#ffffff',
      fixed: false,
      scaling: {
        label: true,
      },
      shape: 'circle',
      margin: 10,
    },
    edges: {
      arrows: 'to',
      color: 'black',
      shadow: true,
      scaling: {
        min: 1,
        max: 10,
      },
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
    network.stabilize()
  }, [props.data])

  return <div className="graph" ref={appRef} />
}
