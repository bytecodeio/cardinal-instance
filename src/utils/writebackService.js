import {connection, scratch_schema} from './writebackConfig'

export const getApplication = async (path,sdk) => {
    const asyncFunction = async (path,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `SELECT * from ${scratch_schema}.cms_application where route = '${path}'`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(path,sdk);
}

export const getApplicationTags = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `SELECT * from ${scratch_schema}.cms_application_tag where application_id = ${id}`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(id,sdk);
}


export const getApplicationTabs = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `select t.*, template.layout_name
                from ${scratch_schema}.cms_tab t
                INNER JOIN ${scratch_schema}.cms_template template on template.id = t.template_id where t.application_id = ${id}
                ORDER BY t.sort_order ASC`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(id,sdk);
}

export const getTabTags = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `select tt.*,t.title  from ${scratch_schema}.cms_tab_tag tt
                LEFT JOIN ${scratch_schema}.cms_tab t ON tt.tab_id = t.id where tab_id = ${id};`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(id,sdk);
}

export const getTabVisualizations = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `select * from ${scratch_schema}.cms_tab_visualization
                where tab_id = ${id};`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(id,sdk);
}

export const getSavedFilterService = async (app,user,sdk) => {
    const asyncFunction = async (app,user,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `SELECT * FROM ${scratch_schema}.cms_bookmarks where global = true AND application_id = ${app} AND deleted=false AND filter_string != ''
                    UNION ALL
                    SELECT * FROM ${scratch_schema}.cms_bookmarks where user_id = ${user} AND global = false AND application_id = ${app} AND deleted=false AND filter_string != ''`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(app,user,sdk);
}

export const removeSavedFilterService = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `UPDATE ${scratch_schema}.cms_bookmarks SET deleted=true where id = '${id}'`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));

        return response
    }
    return asyncFunction(id,sdk);
}

export const insertSavedFilterService = async (user,app,filters,title,global,sdk) => {
    const asyncFunction = async (user,app,filters,title,global,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `insert into ${scratch_schema}.cms_bookmarks values (GENERATE_UUID(),${user},${app},${global},'${filters}','${title}',false);`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));
        console.log("response", response)
        return response
    }
    return asyncFunction(user,app,filters,title,global,sdk);
}

export const updateSavedFilterService = async (id,title,global,sdk) => {
    const asyncFunction = async (id,title,global,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `UPDATE ${scratch_schema}.cms_bookmarks SET title='${title}', global=${global} WHERE id='${id}';`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));
        console.log("response", response)
        return response
    }
    return asyncFunction(id,title,global,sdk);
}

export const getApplications = async (sdk) => {
    const asyncFunction = async (sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `select * from ${scratch_schema}.cms_application a
                    WHERE a.show_in_nav = true
                    ORDER BY a.sort_order;`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));
        console.log("response", response)
        return response
    }
    return asyncFunction(sdk);
}

export const getTabAttributes = async (id,sdk) => {
    const asyncFunction = async (id,sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `SELECT * FROM ${scratch_schema}.cms_tab_attribute_relationship r
                LEFT JOIN ${scratch_schema}.cms_tab_attribute a ON a.id = r.attribute_id
                WHERE r.tab_id = ${id}`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));
        console.log("response", response)
        return response
    }
    return asyncFunction(id,sdk);
}

export const getLandingPageApplications = async (sdk) => {
    const asyncFunction = async (sdk) => {
        const slugResponse = await sdk
            .ok(
            sdk.create_sql_query({
                connection_name: connection,
                sql: `SELECT a.*, v.* FROM ${scratch_schema}.cms_application a
                LEFT JOIN ${scratch_schema}.cms_tab t ON t.application_id = a.id
                LEFT JOIN ${scratch_schema}.cms_tab_visualization v ON v.tab_id = t.id AND v.sort_order = 1
                WHERE t.sort_order = 1 AND a.show_in_nav=true
                ORDER BY a.sort_order;`,
            })
            )
        const response = await sdk.ok(sdk.run_sql_query(slugResponse.slug, "inline_json"));
        console.log("response", response)
        return response
    }
    return asyncFunction(sdk);
}
