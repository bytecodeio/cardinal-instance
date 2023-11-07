import React, {useContext, useState, useEffect} from "react"
import { Button, Spinner } from "react-bootstrap"
import { ExtensionContext } from "@looker/extension-sdk-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const PrintPage = () => {
  const extensionContext = useContext(ExtensionContext)
  const sdk = extensionContext.core40SDK;

  const searchParams = useLocation().search;
  const [url, setUrl] = useState("")
  const [initialLoad, setInitialLoad] = useState(false)

    useEffect(() => {    

      const initialize = async () => {
        if (searchParams) {
          setInitialLoad(true)
          const params = new URLSearchParams(searchParams);
          let _qid = params.get('qid');
          let _type = params.get('type');
          await getUrl(_qid,_type)
        }
      }
      initialize();
    },[])

    const getUrl = async (_qid, _type) => {
      const {id} = await sdk.ok(sdk.query_for_slug(_qid));
      const res = await sdk.ok(sdk.run_query({query_id:id, result_format:_type}));
      console.log("res", res)
      let _url = URL.createObjectURL(res)
      setUrl(_url)
      setInitialLoad(false)
    }

    const handlePrint =() => {
      window.print()
    }

     return (
        <div>
            {initialLoad?            
            <LoadingSpace />
            :
            <img src={url} onLoad={handlePrint} />
            }
            
        </div>
    )
}

const LoadingSpace = (() => 
  <div className="print-space">
    <Spinner />
  </div>
)