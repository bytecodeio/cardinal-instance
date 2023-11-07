export const LOOKER_MODEL = "rebecca_thompson_project";
export const LOOKER_EXPLORE = "sdt_all_dates";

export const PRODUCT_MOVEMENT_VIS_DASHBOARD_ID =
  // "rebecca_thompson_project::product_movement_details";
  "rebecca_thompson_project::product_movement_report_tab";

export const APP_ROUTE = '/order-express'

// export const LOOKML_FIELD_TAGS = {
//   filter: "filter: product_movement",
//   date_filter: "date filter",
//   productMovementField: "field: product_movement",
//   dateRange: "date range",
//   quick_filter: "quick_filter: product_movement",
//   totalInvoices: "total_invoices",
//   accountGroups: "account_group",
//   togglePrefix: "toggle: "
// };

export const LOOKML_FIELD_TAGS = {
  filters:[
    {
      type:'date filter',
      tag: "date filter",
      options: "fields"
    },
    {
      type:'date range',
      tag: "date range",
      options: "date range"
    },
    {
      type:'quick filter',
      tag: "quick_filter: product_movement",
      options: "values"
    },
    {
      type:'account group',
      tag: "account_group",
      options: "single_dimension_value"
    },
    {
      type:'filter',
      tag: "filter: product_movement",
      options: "values"
    }
  ],
  properties:[
    {
      type:'total invoices',
      text:'Total Invoice: ',
      tag:'total_invoices',
      options:'single_value'
    }
  ],
  fields:[
    {
      tab:'Product Movement Report',
      tag:'field: product_movement'
    }
  ],
  togglePrefix: "toggle: "
};
