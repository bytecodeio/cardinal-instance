import React from "react";
import Template1 from "./pageTemplates/Template1/Template1";
import Template2 from "./pageTemplates/Template2/Template2";
import Template3 from "./pageTemplates/Template3/Template3";
import Template4 from "./pageTemplates/Template4/Template4";
import { PRODUCT_MOVEMENT_VIS_DASHBOARD_ID } from "./utils/constants2";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";

export const LayoutSelector = ({
    tabProps,
    currentNavTab,
    fields,
    properties,
    isActive,
    tabFilters}) => {
        console.log("props", properties)
        console.log("Tabprops", tabProps)
    if (tabProps.layout_name === "Template1") {
        return <Template2
            className="active"
            isActive={isActive}
            currentNavTab={currentNavTab}
            fields={fields.filter(({tab}) => tab === tabProps.title)}
            properties={properties.filter(({type}) => type == tabProps.properties[0]?.type)}
            config={tabProps.config}
            tabKey={tabProps.route}
            description={{description: <div dangerouslySetInnerHTML={{__html:tabProps.description}} />}}
            tabFilters={tabFilters.filter(({tab}) => tab === tabProps.title)}
            attributes={tabProps.attributes}
            />;
    } else if (tabProps.layout_name === "Template3") {
        return <Template3
            className="active"
            isActive={isActive}
            currentNavTab={currentNavTab}
            fields={fields.find(({tab}) => tab === tabProps.title)}
            properties={properties.filter(({type}) => type == tabProps.properties[0]?.type)}
            config={tabProps.config}
            tabKey={tabProps.route}
            description={{description: <div dangerouslySetInnerHTML={{__html:tabProps.description}} />}}
            tabFilters={tabFilters.filter(({tab}) => tab === tabProps.title)}
            attributes={tabProps.attributes}
            />;
    } else if (tabProps.layout_name === "Template4") {
        return <Template4
            className="active"
            isActive={isActive}
            currentNavTab={currentNavTab}
            fields={fields.find(({tab}) => tab === tabProps.title)}
            properties={properties.filter(({type}) => type == tabProps.properties[0]?.type)}
            config={tabProps.config}
            tabKey={tabProps.route}
            description={{description: <div dangerouslySetInnerHTML={{__html:tabProps.description}} />}}
            tabFilters={tabFilters.filter(({tab}) => tab === tabProps.title)}
            attributes={tabProps.attributes}
            />;
    }
    // switch (tabProps.layout_name) {
    //     case 'Template1':
    //         return <Template2
    //             currentNavTab={currentNavTab}
    //             filters={filters}
    //             fields={fields.find(({tab}) => tab === "Product Movement Report")}
    //             properties={properties}
    //             updateAppProperties={updateAppProperties}
    //             isFetchingLookmlFields={isFetchingLookmlFields}
    //             config={tabProps.config}
    //             tabKey={tabProps.route}
    //             showMenu={showMenu}
    //             setShowMenu={setShowMenu}
    //             description={{description: <div dangerouslySetInnerHTML={{__html:tabProps.description}} />}}
    //             selectedFilters={selectedFilters}
    //             setSelectedFilters={setSelectedFilters}
    //             initialLoad={initialLoad}
    //             setInitialLoad={setInitialLoad}/>;
    //         break;
    //     case 'Template2':
    //         return <Template2 />;
    //         break;
    //     case 'Template3':
    //         return <Template3 />;
    //         break;
    //     default:
    //         return null;
    // }
}
