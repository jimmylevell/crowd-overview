import { useState, useEffect, createRef } from 'react';
import { Network, parseDOTNetwork } from "vis-network/standalone";

export default function Graph(props) {
    const [data, setData] = useState([]);
    const [appRef, setAppRef] = useState(createRef());

    const options = {
        edges: {
          arrows: {
            to: {
              enabled: true,
              type: 'arrow'
            }
          },
          length: 300, // Longer edges between nodes.
          color: {
            inherit: false
          }
        },
        physics: {
          stabilization: false,
            barnesHut: {
              springLength: 200,
            },
        },
        interaction: {
          dragNodes: true
        },
        /*
        layout: {
          hierarchical: {
              direction: "UD",
              sortMethod: "directed"
          }
        },
        */
      };

    useEffect(() => {
        const object = parseDOTNetwork(props.data)
        setData(object)
    }, [props.data]);

    useEffect(() => {
      const network = new Network(appRef.current, data, options)
      network.stabilize();
    } , [data]);

    return (
        <div className='graph' ref={ appRef } />
    )
}
