import { useState, useEffect, createRef } from 'react'
import { Network } from 'vis-network/standalone'

export default function Graph(props) {
  const [appRef, setAppRef] = useState(createRef())

  const options = {
    edges: {
      arrows: {
        to: {
          enabled: true,
          type: 'arrow',
        },
      },
      length: 300, // Longer edges between nodes.
      color: {
        inherit: false,
      },
    },

    interaction: {
      dragNodes: true,
    },

    layout: {
      hierarchical: {
        direction: 'UD',
        sortMethod: 'directed',
      },
    },
  }

  useEffect(() => {
    const network = new Network(appRef.current, props?.data, options)
    network.stabilize()
  }, [props.data])

  return <div className="graph" ref={appRef} />
}
