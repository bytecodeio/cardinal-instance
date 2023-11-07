import React, {Fragment, useEffect, useState} from 'react'
import { getLandingPageApplications } from '../../utils/writebackService'
import { useContext } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { ButtonGroup, Button, InputGroup, Form, Container, Tooltip, OverlayTrigger, } from 'react-bootstrap';
import ToTopButton from "../../components/ToTopButton.js";

export const LandingPage = ( {description} ) => {
    const extensionContext = useContext(ExtensionContext)
    const sdk = extensionContext.core40SDK;
    const { hostUrl } = extensionContext.extensionSDK.lookerHostData;

    const [apps, setApps] = useState([])
    const [allApps, setAllApps] = useState([])
    const [selectedButton, setSelectedButton] = useState("grid")
    const [searchTerm, setSearchTerm] = useState("")


    useEffect(() => {
        const initialize = async () => {
            let _apps = await getLandingPageApplications(sdk)
            setApps(_apps)
            setAllApps(_apps)
        }
        initialize();
    },[])

    const handleClick = (app) => {
        let url = `${hostUrl}/embed/extensions/${app.model}::${app.route}`
        console.log(url)
        extensionContext.extensionSDK.openBrowserWindow(url)
    }

    const handleButtonGroupClick = (v) => {
        setSelectedButton(v)
    }

    const handleSearchTerm =(e) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchButton = () => {
        const data = [...allApps];
        let _apps = searchTerm.replace(" ") != ""? data.filter(d => d.name.toUpperCase().includes(searchTerm.toUpperCase())):data;
        setApps(_apps)
    }

console.log(apps, "elizabeth")






    return(
        <Fragment>
        <div className='landing-page-action'>
            <ButtonGroup size="sm"  className='landing-page-button-group'>
                <Button onClick={() => handleButtonGroupClick("grid")} active={selectedButton == "grid"} value={"grid"}>
                    <i className="far fa-th"></i>
                </Button>
                <Button onClick={() => handleButtonGroupClick("list")} active={selectedButton == "list"} value={"list"}>
                    <i className='far fa-list'></i>
                </Button>
            </ButtonGroup>
            <InputGroup className='landing-page-search'>
                <Form.Control id='search' placeholder='Search' onChange={handleSearchTerm} onKeyDown={(e) => e.keyCode == "13"? handleSearchButton():''}>
                </Form.Control>
                <Button onClick={handleSearchButton}>Go</Button>
            </InputGroup>
        </div>
        <Container fluid>
        <div className='landing-page-container' id="squares">
            {apps?.map(a =>
            selectedButton == "grid"?
            <OverlayTrigger
              placement="right"
              overlay=<Tooltip>{a.tooltip_description}</Tooltip>
              className="tooltipHover"
            >
                <a className='landing-page-content' href={`#`} onClick={() => handleClick(a)}>
                    <div className='landing-page-item'>
                        {a.thumbnail_base64 != null?
                        <img className='looker-thumbnail' src={a.thumbnail_base64} onError={(e) => {e.target.onError=null; e.target.src="/"}} />
                        :<div className='looker-thumbnail not-available'>Preview Not Available</div>
                        }
                        <div className='landing-page-item-detail'>{a.name}</div>
                    </div>
                </a>
              </OverlayTrigger>
                :
                <a href={`#`} className={`landing-page-row ${apps.indexOf(a) % 2? 'even':'odd'}`} onClick={() => handleClick(a)}>
                    <div>
                        <h6>{a.name}</h6>
                    </div>
                </a>
            )}
        </div>
        </Container>
       <ToTopButton />
      </Fragment>
    )
}
