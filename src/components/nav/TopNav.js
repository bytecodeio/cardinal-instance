import React,{useContext} from "react";

import { Accordion, Button } from "react-bootstrap";
import { getApplicationTabs, getApplications } from "../../utils/writebackService";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { groupBy } from "../../utils/globalFunctions";
import { useState } from "react";

function TopNav(props) {
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;
  const [show5, setShow5] = React.useState();

  const [navList, setNavList] = useState([])

  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const initialize = async () => {
      let applications = await getApplications(sdk)
      setNavList(applications)
      if (applications.length > 0) {
        let appList = []
        for await (let apps of applications) {
          let tabs = await getApplicationTabs(apps['id'], sdk)
          apps['tabs'] = tabs
          appList.push(apps)
        }
        console.log("sitemap",appList)
        setNavList(appList);
      }
    }    
    initialize()
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };

  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow5(false);
    }
  };

  const handleClick = (app, tab) => {
    let host = extensionContext.extensionSDK.lookerHostData;
    let type = host.hostType == "spartan"? "spartan":"extensions"
    let url = `${host.hostUrl}/${type}/order_express::${app['route']}/${tab['route']}`
    console.log(url)
    extensionContext.extensionSDK.openBrowserWindow(url)
  }

  return (
    <div>
      <div id="slideOut5" className={show5 ? "show" : ""} ref={wrapperRef}>
        <div className="back">
          <div
            id="one5"
            className=""
            role="button"
            tabIndex="0"
            onClick={() => setShow5(true)}
          >
            <p>
              <i aria-hidden="true" className="far fa-arrow-left"></i> View All
              Reports
            </p>
          </div>
        </div>

        <div className="modal-content mt-1">
          <div className="modal-header">
            <p className="strong">All Reports</p>
            <div className="closeThisPlease" id="close1">
              <Button
                role="button"
                className="close"
                data-dismiss="modal"
                id="closeThisPlease1"
                onClick={() => setShow5(false)}
              >
                <i className="fal fa-angle-double-left"></i>
              </Button>
            </div>
          </div>
          <div className="modal-body">
            <Accordion defaultActiveKey={0} className="square">
            {navList?.map(n => (
              <Accordion.Item eventKey={n['sort_order']}>
                <Accordion.Header>{n['name']}</Accordion.Header>
                <Accordion.Body>
                  {n['tabs']?.map(tab => (
                    <a className="blue" onClick={() => handleClick(n,tab)}>{tab['title']}</a>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
            </Accordion>
              {/* <Accordion.Item eventKey="1">
                <Accordion.Header>Functional Build</Accordion.Header>
                <Accordion.Body>
                  <a className="blue">Tab 1</a>
                  <a className="blue">Tab 2</a>
                  <a className="blue">Tab 3</a>
                  <a className="blue">Tab 4</a>
                </Accordion.Body>
              </Accordion.Item> */}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
