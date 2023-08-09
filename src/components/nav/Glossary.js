import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
} from "react-bootstrap";
// import dictionary from "./dictionary.js";
const dictionary = [
      {
        term: '% Savings',
        definition: '% Savings = (Estimated Market Cost – Contract Purchases ) / Estimated Market Cost * 100. This field is used in Contract Value Report.',
        dataFilter: 'AA',
      },

      {
        term: '340B Purchases',
        definition: '340B Purchases refers to the purchases made against the 340B Contract. This field is used in Contract Value Report.',
        dataFilter: 'AAA',
      },
      {
        term: 'Account #',
        definition: 'A unique numeric identifier assigned by Cardinal Health to a Ship-To Customer.',
        dataFilter: 'A',
      },
      {
        term: 'Account Address',
        definition: 'The street address where product is shipped.',
        dataFilter: 'A',
      },
      {
        term: 'Account Address 2',
        definition: 'Additional address information that will not fit within the primary address field.',
        dataFilter: 'A',
      },
      {
        term: 'Account Alias',
        definition: 'Displays Account Alias as defined within Order Express',
        dataFilter: 'A',
      },
      {
        term: 'Account City',
        definition: 'The city in which a ship-to customer is located.',
        dataFilter: 'A',
      },
      {
        term: 'Account DEA #',
        definition: 'A unique, required identification license number assigned by the Federal Drug Enforcement Administration to authorize purchasing, prescribing, and dispensing of controlled substances. This license is for a fixed period and must be renewed to permit the purchase of any controlled substance.',
        dataFilter: 'A',
      },
      {
        term: 'Account Group',
        definition: 'A customer defined collection of accounts',
        dataFilter: 'A',
      },
      {
        term: 'Account Memo',
        definition: 'Displays Account Memo as defined within Order Express',
        dataFilter: 'A',
      },
      {
        term: 'Account Name',
        definition: "Name of the customer. This is what appears as the first line of postal address's Ship To Customer name.",
        dataFilter: 'A',
      },
      {
        term: 'Account State',
        definition: 'The state in which a Ship-to customer is located.',
        dataFilter: 'A',
      },
      {
        term: 'Account Zip Code',
        definition: 'The zip code in which a Ship-to customer is located.',
        dataFilter: 'A',
      },
      {
        term: 'Accounting Code',
        definition: 'It’s an administrative value set within Order Express, typically used for GL purposes',
        dataFilter: 'A',
      },
      {
        term: 'Adjusted Customer Service Level',
        definition: "Cardinal Health's service level calculated using the invoice quantity and adjusted to exclude product shorts that are generally deemed to be outside Cardinal Health's control. Short reasons Outs with Inventory Temp Outs Usage Greater than 'X' % No Usage still count against Cardinal Health.",
        dataFilter: 'A',
      },
      {
        term: 'AHFS #',
        definition: "Established, printed and distributed by the American Society of Hospital Pharmacists, Inc. In 1959, ASHP published the first edition of the American Hospital Formulary Service. Today the volume, now known as AHFS Drug Information, along with other resources produced by ASHP's Publications and Drug Information Systems Office, continues to play an essential role in providing pharmacists and other health professionals with the information needed to make the best drug therapy decisions for their patients.",
        dataFilter: 'A',
      },
      {
        term: 'AHFS Description',
        definition: 'The American Society for Health-Systems Pharmacists (ASHP) reviews drugs as they come to market and places them into a therapeutic category based upon their chemical composition and therapeutic outcome. This listing is referred to as the American Hospital Formulary Service. Each year a new version is published to assist pharmacists and clinicians in the development of formularies. Cardinal Health procures this information through third-party sources.',
        dataFilter: 'A',
      },
      {
        term: 'Alternative CIN',
        definition: 'The CIN for a product having the same active ingredients dosage forms or strengths as the product purchased',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Contract #',
        definition: 'The Contract Number in which an alternative product is contained',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Contract Cost',
        definition: 'The cost of an alternate product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Contract Name',
        definition: 'The Contract Name in which an alternative product is contained',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Dollars',
        definition: 'The purchase price of an alternative product [Ship Qty] * [Alternative Contract Cost]',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Form',
        definition: 'The form of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Manufacturer',
        definition: 'The manufacturer of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Mfr',
        definition: 'The manufacturer of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Product Availability',
        definition: 'The current availability of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Size',
        definition: 'The size of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Strength',
        definition: 'The strength of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Alternative Trade Name',
        definition: 'The Trade Name of an alternative product',
        dataFilter: 'A',
      },
      {
        term: 'Ancillary',
        definition: 'A product on contract but not on a Primary Contract portfolio. These items are either on contract as a result of negotiation between the pharmacy and a pharmaceutical manufacturer or on a backup contract negotiated by Cardinal Health with a manufacturer to protect customers if their primary contract item is not available. The savings on ancillary contracts can vary greatly from open market. However, they are usually higher priced than the Primary Contract items.',
        dataFilter: 'A',
      },
      {
        term: 'Ancillary Purchases',
        definition: 'Ancillary Purchases refers to the purchases made against the Ancillary Contract. This field is used in Contract Value Report.',
        dataFilter: 'A',
      },
      {
        term: 'Approval Date',
        definition: 'The date in which an invoice was approved',
        dataFilter: 'A',
      },
      {
        term: 'Approver Name',
        definition: 'The name of the person that approved the invoice',
        dataFilter: 'A',
      },
      {
        term: 'Available Date',
        definition: 'The date by which sufficient quantities of the item must be available for picking to begin.',
        dataFilter: 'A',
      },
      {
        term: 'Bill To Address',
        definition: 'The location to which the customer invoice is mailed.',
        dataFilter: 'B',
      },
      {
        term: 'Bill To City',
        definition: 'The city in which a bill-to customer is located.',
        dataFilter: 'B',
      },
      {
        term: 'Bill To Name',
        definition: 'The person or organization that is to receive bills and invoices on behalf of a customer-side purchaser.',
        dataFilter: 'B',
      },
      {
        term: 'Bill To State',
        definition: 'The state in which a bill-to customer is located.',
        dataFilter: 'B',
      },
      {
        term: 'Bill To Zip',
        definition: 'The zip code in which a bill-to customer is located.',
        dataFilter: 'B',
      },
      {
        term: 'Category Code 1',
        definition: 'Editable Custom Field on Product details, Multiproduct edit and shown on column customization (read only)',
        dataFilter: 'C',
      },
      {
        term: 'Category Code 2',
        definition: 'Editable Custom Field on Product details, Multiproduct edit and shown on column customization (read only)',
        dataFilter: 'C',
      },
      {
        term: 'CIN',
        definition: 'A unique numeric identifier assigned by Cardinal Health to a Product.',
        dataFilter: 'C',
      },
      {
        term: 'Container ID',
        definition: 'The identification number of a shipment container',
        dataFilter: 'C',
      },
      {
        term: 'Container Type',
        definition: 'The type of container a shipment was made in',
        dataFilter: 'C',
      },
      {
        term: 'Contract Alias',
        definition: 'The Customer Contract Alias & Priority feature allows you to assign a contract priority and visually note those priorities using color-coding. Additionally, contracts can have an alias to further specify the best contract. The Contract Priority information displays in Search Results and the Shopping Cart, as well as within the Analyze Order feature of the Shopping Cart.',
        dataFilter: 'C',
      },
      {
        term: 'Contract Cost',
        definition: 'A contractual amount determined by the supplier for which Cardinal Health is obligated to sell a product to the end customer.',
        dataFilter: 'C',
      },
      {
        term: 'Contract Expiration Date',
        definition: 'Date the contract expires',
        dataFilter: 'C',
      },
      {
        term: 'Contract Indicator',
        definition: 'Designates if a purchase was on contract',
        dataFilter: 'C',
      },
      {
        term: 'Contract Name',
        definition: 'The name of a contract a product may be purchased on',
        dataFilter: 'C',
      },
      {
        term: 'Contract Start Date',
        definition: 'The date that a customer agreement becomes effective.',
        dataFilter: 'C',
      },
      {
        term: 'Contractual Adjusted Customer Service Level',
        definition: 'Cardinal Health"s customer service level based on the customers contract (when available) or a standardized default. This is to say there can be things written into a contract with a customer than can override the basic general service level rules.',
        dataFilter: 'C',
      },
      {
        term: 'Controlled Substance',
        definition: "Regulated and controlled by the DEA based on potential or actual illegal drug trafficking or abuse. Substances are divided into five schedules (Schedule I-V). Each schedule reflects a substance's potential for abuse and physical and psychological dependence.",
        dataFilter: 'C',
      },
      {
        term: 'CSW AND DROP SHIP',
        definition: 'CSW is the order entry platform which is used by call center users. It supports both PD and Dropship ordering for customers. Other Drop Ship is started in Order Express.',
        dataFilter: 'C',
      },
      {
        term: 'Current Contract Cost',
        definition: 'A contractual amount determined by the supplier for which Cardinal Health is obligated to sell a product to the end customer as of the last close of business',
        dataFilter: 'C',
      },
      {
        term: 'Custom Stock #',
        definition: 'The customers identification number for a specific CIN. May also be referred to as CSN',
        dataFilter: 'C',
      },
      {
        term: 'Customer Service Level',
        definition: "One of the most critical metrics for any distribution business and most commonly refers to the percentage of a customer's order which actually filled and shipped. Pharmaceutical: There are a variety of different service level calculations used within Cardinal's distribution frequently defined in the customer's PVA sometimes with penalties for underperformance. Service level is commonly referred to in two ways; RAW or Unadjusted Service Level and Adjusted or Controllable Service Level. Medical: Percentage specifying what proportion of the requirement is to be covered by the warehouse stock. The system uses the service level to calculate the safety stock. The higher the service level the higher will be the safety stock calculated by the system to compensate for additional consumption or delays in delivery.",
        dataFilter: 'C',
      },
      {
        term: 'DC #',
        definition: 'Unique number for the Distribution Center',
        dataFilter: 'D',
      },
      {
        term: 'DC Name',
        definition: 'A facility that is used for receipt temporary storage and distribution of finished goods raw material and bulk material typically in large quantities.',
        dataFilter: 'D',
      },
      {
        term: 'DEA Schedule #',
        definition: 'A list of the degree of addictiveness for controlled schedule drugs.',
        dataFilter: 'D',
      },
      {
        term: 'Delivery Charge',
        definition: 'The fee associated with a transfer of possession of goods from the seller to the buyer.',
        dataFilter: 'D',
      },
      {
        term: 'Department Code',
        definition: 'This feature enables you to select departments by code or description so that the report results subtotal information by department.',
        dataFilter: 'D',
      },
      {
        term: 'Department Name',
        definition: 'Descriptive name of a department that is created for an organization. This is the value that users will see throughout the OE site when \'department\' is listed.',
        dataFilter: 'D',
      },
      {
        term: 'DISTRACK MANUAL ENTRY',
        definition: 'Manual order entry method used by warehouse users in creating orders on behalf of the customer. Typically emergency orders called into the warehouse (instead of customer service).',
        dataFilter: 'D',
      },
      {
        term: 'Due Date',
        definition: 'The date payment is required to Cardinal Health.',
        dataFilter: 'D',
      },
      {
        term: 'EDI',
        definition: 'Orders created through EDI ordering platform . These orders are placed by customers through their EDI ordering platforms – creates 850 PO to our backend system',
        dataFilter: 'E',
      },
      {
        term: 'EDI - OE',
        definition: 'Order started through EDI process, then imported to Order Express Cart, user can either make changes, submit or the order can be submitted via "auto submit"',
        dataFilter: 'E',
      },
      {
        term: 'Estimated Market Cost',
        definition: 'Estimated Market Cost is the cost of products when they are purchased Off Contract. This field is used in Contract Value Report.',
        dataFilter: 'E',
      },
      {
        term: 'FDA Therapeutic Equivalency Rating',
        definition: 'The FDA Therapeutic Equivalency Rating is a two-letter drug equivalence evaluation code based upon the FDA’s Approved Drug Products with Therapeutic Equivalence rating scale (The Orange Book rating).',
        dataFilter: 'F',
      },
      {
        term: 'Federal Upper Limit',
        definition: 'Federal Financing Participation Upper Limits, formerly Federal Mac) FFPUL is the unit price for a covered prescription drug, used by the federal government as a guideline for state Medicaid departments in order to set reimbursement for retail pharmacies dispensing medications to Medicaid beneficiaries.',
        dataFilter: 'F',
      },
      {
        term: 'Fineline #',
        definition: 'The fine line class code is an item code supplied by D. B. Hammacher of the NWDA that identifies the department of the pharmacy in which an item is stocked.',
        dataFilter: 'F',
      },
      {
        term: 'Fineline Description',
        definition: 'The fine line class description corresponds to the item code number supplied by D.B. Hammacher of the NWDA and that identifies the department of the pharmacy in which an item is stocked. Examples include cough and cold, hair care, vitamins, etc.',
        dataFilter: 'F',
      },
      {
        term: 'Form 4 character field, standardized physical format of product',
        definition: 'An item’s form is the standardized physical format of the product. Examples of an item’s form include TAB, CAP, SDV, MDV, LOT, CRM, LIQ etc. A product’s form is used in determine the generic equivalence or substitutability of a product.',
        dataFilter: 'F',
      },
      {
        term: 'GCN',
        definition: 'Acronym for First Data Bank’s Generic Code Number. The GCN is a five-digit number that describes the rough equivalence of two or more products. This data element is used as the first part of the Cardinal Key and is used to drive the distribution center system’s automatic substitution logic. Alternatives are based on this number. This is the equivalent main ingredient (same drug, different form).',
        dataFilter: 'G',
      },
      {
        term: 'Generic Indicator',
        definition: 'Indicates whether a product is generic or brand name',
        dataFilter: 'G',
      },
      {
        term: 'Generic Name',
        definition: 'The generic name is the therapeutic class name assigned to the original patented drug. The generic name of McNeil’s Tylenol is acetaminophen.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Class #',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Class Name',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Code',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Description',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories',
        dataFilter: 'G',
      },
      {
        term: 'GPI Group #',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Group Name',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Subclass #',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'GPI Subclass Name',
        definition: 'GPI Sub-Therapeutic Categories are the first three elements in a numeric-coding scheme designed to classify pharmaceutics. Due to the increased demands on pharmacies to control costs, Cardinal Health contracted with First Data Bank to use the Sub-Therapeutic components of the GPI. These levels of classifications are group, class, and sub-class and enable pharmacies to analyze purchases significantly more detailed than the AHFS Therapeutic Categories.',
        dataFilter: 'G',
      },
      {
        term: 'HCPCS',
        definition: 'HCPCS is an acronym for Healthcare Common Procedure Coding System (HCPCS). Standardized code sets, such as J-Code, are necessary for Medicare and other health insurance providers to provide healthcare claims that are managed consistently and in an orderly manner.',
        dataFilter: 'H',
      },
      {
        term: 'Historical Availability Message',
        definition: 'A message associated with a product typically when it has been unavailable',
        dataFilter: 'H',
      },
      {
        term: 'Inf %',
        definition: 'Inflation % = (Total Inflation / Compare Purchase $) * 100',
        dataFilter: 'I'
      },
      {
        term: 'INTERACTIVE VOICE RESPONSE',
        definition: '‘IVR’ or phone in orders are the ones placed by customers over the phone.',
        dataFilter: 'I'
      },
      {
        term: 'Invoice #',
        definition: 'The Cardinal Health invoice number',
        dataFilter: 'I'
      },
      {
        term: 'Invoice Approval Status',
        definition: 'The status of the invoice in the ordering platform if Invoice Approval module is used',
        dataFilter: 'I'
      },
      {
        term: 'Invoice Date',
        definition: 'The date in which an invoice is created',
        dataFilter: 'I'
      },
      {
        term: 'Invoice Number',
        definition: 'A unique numeric identifier assigned to an invoice',
        dataFilter: 'I'
      },
      {
        term: 'Invoiced Order Qty',
        definition: 'The amount originally ordered by the customer',
        dataFilter: 'I'
      },
      {
        term: 'Last Purchased Contract #',
        definition: 'The contract number in which a product was most recently purchased on',
        dataFilter: 'L'
      },
      {
        term: 'Last Purchased Contract Name',
        definition: 'The contract name in which a product was most recently purchased on',
        dataFilter: 'L'
      },
      {
        term: 'Last Purchased Date',
        definition: 'The most recent date in which a product was purchased',
        dataFilter: 'L'
      },
      {
        term: 'Last Purchased New Contract Name',
        definition: 'The new name of a contract a product was most recently purchased on.',
        dataFilter: 'L'
      },
      {
        term: 'Last Purchased Price',
        definition: 'The price paid most recently for a product',
        dataFilter: 'L'
      },
      {
        term: 'Manufacturer',
        definition: 'Person or organization that makes goods through a process involving raw materials components or assemblies usually on a large scale with different operations divided among different workers.',
        dataFilter: 'M'
      },
      {
        term: 'Manufacturer Back Order',
        definition: 'This occurs when a vendor was unable to supply an item, or the vendor shipped the item late. The customer’s order is left open until the product becomes available.',
        dataFilter: 'M'
      },
      {
        term: 'Manufacturer Discontinued',
        definition: 'This occurs when the manufacturer no longer produces an item.',
        dataFilter: 'M'
      },
      {
        term: 'Manufacturer Out',
        definition: 'This is similar to a manufacturer back order. The difference is that the customer’s order is closed because there isn’t a know date of when the manufacturer can meet the item demand.',
        dataFilter: 'M'
      },
      {
        term: 'Market Share Agreements',
        definition: 'A negotiated contractual agreement between the purchaser and the manufacturer that generates rebates or other financial incentives if the purchaser can meet specific market share targets. Most pharmaceutical manufacturers have similar competitive products that may be used for the same therapeutic outcome. The manufacturer used market share agreements to provide rebates to a customer if they move competitive purchases to the preferred manufacturer’s product.',
        dataFilter: 'M'
      },
      {
        term: 'Mfr',
        definition: 'Person or organization that makes goods through a process involving raw materials, components, or assemblies, usually on a large scale with different operations divided among different workers.',
        dataFilter: 'M'
      },
      {
        term: 'MISCELLANEOUS BILLINGS',
        definition: 'These are the service billing orders scheduled to generate billings to customers monthly and weekly',
        dataFilter: 'M'
      },
      {
        term: 'Multi-Source',
        definition: 'A pharmaceutical product that has equivalents available from multiple manufacturers.',
        dataFilter: 'M'
      },
      {
        term: 'Multi-Source Indicator',
        definition: 'An indicator that a pharmaceutical product has equivalents available from multiple manufacturers.',
        dataFilter: 'M'
      },
      {
        term: 'NDC',
        definition: 'Acronym for National Drug Code. A unique 11-digit code assigned to and stamped on each product according to specifications designated by the National Drug Code System of the Food and Drug Administration. Cardinal Distribution uses the 5-4-2 standard format. The FDA assigns a 5-digit manufacturer id number and the manufacturer assigns the 4 digit product id and package code. Unlike the UPC code, which is not registered, each NDC number is registered with the FDA and published in the public domain. When a product is reformulated, sold or manufactured by a different division a new NDC number will be assigned. The NDC number is used by some large customers as the product identifier for ordering, and extensively in EDI and system interfaces.',
        dataFilter: 'N'
      },
      {
        term: 'National Drug Code',
        definition: "Unique 11-digit code. Usually for Rx products. Cardinal has 11 digit number for every item in database - for products that don't have NDC code Cardinal creates a 11 digit number (made up of scan code and UPC)",
        dataFilter: 'N'
      },
      {
        term: 'Net Acq. Price',
        definition: 'The Net Acquisition Cost is the actual cost a customer pays to purchase an item from Cardinal Health at the time a report is created. It is typically the cost customers use to calculate their cost of goods and profit margins. Net Acquisition Cost is unique for each customer (while the AWP and WAC costs are the same for all customers).',
        dataFilter: 'N'
      },
      {
        term: 'New Account #',
        definition: 'A unique 10 digit numeric identifier assigned by Cardinal Health to a Ship-To Customer.',
        dataFilter: 'N'
      },
      {
        term: 'New Alternative Contract Name',
        definition: 'The new contract name in which an alternative product is contained.',
        dataFilter: 'N'
      },
      {
        term: 'New Contract Name',
        definition: 'The new name of a contract a product may be purchased on.',
        dataFilter: 'N'
      },
      {
        term: 'On Formulary',
        definition: 'Order Express simplifies the process of creating and maintaining a formulary by allowing administrators to flag products as "On Formulary" and save that setting to selected accounts. On Formulary is a "Narrow Your Results" search filter. An optional search column and the formulary icon displays in the Notes column. The Opportunity Analysis step within Analyze Order warns users if a non formulary product is being ordered when an in-stock, on formulary alternative is available. To ensure even greater adherence to the account’s formulary, users may be limited to only order formulary products. Using the User Management feature, user permissions can be restricted to view only on formulary items in the search results and are blocked from adding non-formulary products to the Shopping Cart.',
        dataFilter: 'O'
      },
      {
        term: 'Order Date',
        definition: 'The date a product was ordered',
        dataFilter: 'O'
      },
      {
        term: 'ORDER EXPRESS',
        definition: 'Order Started through user logging into Order Express building and placing order from Cart',
        dataFilter: 'O'
      },
      {
        term: 'Order Express Mobile App',
        definition: 'Order submitted by Users from the Mobile App straight to Cardinal backend ordering systems',
        dataFilter: 'O'
      },
      {
        term: 'Order Express Mobile Web',
        definition: 'Order submitted by Users from the Mobile App to OE , from where the Order Express Users will submit the orders',
        dataFilter: 'O'
      },
      {
        term: 'Order Qty',
        definition: 'The number of a single product ordered by a customer shown as a single line item in the purchase order.',
        dataFilter: 'O'
      },
      {
        term: 'ORDERING - PD',
        definition: 'Order Started through user logging into legacy cardinal.com building and placing order from legacy cardinal.com cart',
        dataFilter: 'O'
      },
      {
        term: 'ORDERING - PD MOBILE SOLUTIONS SENT',
        definition: 'This is the Legacy Mobile Ordering Channel through the Pharma.com website which has been decommissioned -these orders were created on MC70 devices and directly submitted',
        dataFilter: 'O'
      },
      {
        term: 'ORDERING - PD MOBILE SOLUTIONS TRANSFERRED',
        definition: 'This is the Legacy Mobile Ordering Channel through the Pharma.com website which has been decommissioned – orders were created on the MC70 devices then sync’d',
        dataFilter: 'O'
      },
      {
        term: 'ORDERING - SPD',
        definition: 'These are direct dropship orders created primarily through Specialty Online These orders are NOT started in PD Order Express.',
        dataFilter: 'O'
      },
      {
        term: 'OTC',
        definition: 'This is an acronym for Over The Counter. OTC products can be sold without a prescription or DEA license.',
        dataFilter: 'O'
      },
      {
        term: 'Package Qty',
        definition: "Number of customer retail units or hospital dispensing units per Cardinal Health's sell unit of measure.",
        dataFilter: 'P'
      },
      {
        term: 'Package Size',
        definition: 'The package size of an item is the total number of units contained within the item in the items unit of measure (UOM). The package size is a numeric field that can be used to determine the cost per unit and to interface with dispensing data that is expressed in units of measure quantities. This field is also commonly referred to as the AccuNet size. Package size (12 X 2 ML = 2 is pkg size)',
        dataFilter: 'P'
      },
      {
        term: 'Paid Date',
        definition: 'The date in which an invoice was paid to Cardinal Health',
        dataFilter: 'P'
      },
      {
        term: 'PDT ORDERS',
        definition: 'PDT is a batch order entry method currently decommissioned. These orders were created through Telxon which was device and was used for creating batch orders in the systems',
        dataFilter: 'P'
      },
      {
        term: 'PO #',
        definition: 'A number referencing a request to a vendor to deliver a certain quantity of goods or to perform certain services at a certain point in time.',
        dataFilter: 'P'
      },
      {
        term: 'Price Inf %',
        definition: 'Price Inflation % = (Price Difference / Compare Price) * 100',
        dataFilter: 'P'
      },
      {
        term: 'Primary',
        definition: 'A set of products on the group or GPO portfolio. For example, a Premier customer using the Premier portfolio would consider a product contracted by Premier to be a Primary Contract product. Any other contracted item, such as those negotiated by the hospital or Integrated Delivery Network or those on a Cardinal backup contract, would be considered an Ancillary Contract product. From a reporting perspective Cardinal uses a numeric code to define primary or ancillary product. All Primary contracts are in a range of 5000 through 5ZZZ.',
        dataFilter: 'P'
      },
      {
        term: 'Primary Purchases',
        definition: 'Primary Purchases refers to the purchases made against the Primary Contract. This field is used in Contract Value Report.',
        dataFilter: 'P'
      },
      {
        term: 'Private Label Description',
        definition: 'Private Label items belong to a group of distinguishable products that have customer-specific distribution. Cardinal Health provides distribution services to large customers for their own private labeled products.',
        dataFilter: 'P'
      },
      {
        term: 'Product Active Status',
        definition: 'Active Status is a Y or N indicator that denotes an item’s activity status across all companies of Cardinal Health, Inc.',
        dataFilter: 'P'
      },
      {
        term: 'Product Group',
        definition: 'A customer defined collection of products',
        dataFilter: 'P'
      },
      {
        term: 'Purchase Dollars',
        definition: 'The purchase price of the product multiplied by the shipped quantity. This does not include shipping costs or service fees',
        dataFilter: 'P'
      },
      {
        term: 'Purchases Inf %',
        definition: 'Purchases Inflation % = (Purchase Difference / Compare Purchase $) * 100',
        dataFilter: 'P'
      },
      {
        term: 'Raw Customer Service Level',
        definition: "Cardinal Health's customer service level calculated using the original order quantity and including all product shorts.",
        dataFilter: 'R'
      },
      {
        term: 'Received By',
        definition: 'The customer userid of the person that accepted the product delivery',
        dataFilter: 'R'
      },
      {
        term: 'Received Qty',
        definition: 'The number of a single product received by a customer',
        dataFilter: 'R'
      },
      {
        term: 'Received Time',
        definition: 'The time and date the customer received a product',
        dataFilter: 'R'
      },
      {
        term: 'RETURNS/UNKNOWN',
        definition: 'Returns are products returned by customers back to Cardinal due to issues in fulfilling the order. The items in the orders are put back into stock in the event they are not damaged or expired. Returns are typically processed through Order Express, but can be processed through other methods (labeled unknown).',
        dataFilter: 'R'
      },
      {
        term: 'Review Purchase $',
        definition: 'The Purchase Dollar total for the review period when comparison periods are selected',
        dataFilter: 'R'
      },
      {
        term: 'Sales Rep Number',
        definition: 'A unique number identifying a salesperson or agent (whether or not under the direct control of a firm) authorized to sell products and services for a firm and compensated usually through a commission or salary or a combination of both.',
        dataFilter: 'S'
      },
      {
        term: 'Savings %',
        definition: '((Actual purchase dollars - alternative purchases)/Actual purchase dollars)*100 If rebate is entered, alternative purcahases will include applied rebate.',
        dataFilter: 'S'
      },
      {
        term: 'Service Request Quantity',
        definition: 'The number of items specified in a service request',
        dataFilter: 'S'
      },
      {
        term: 'Ship Qty',
        definition: 'Quantity of product units shipped to a customer.',
        dataFilter: 'S'
      },
      {
        term: 'Short Qty',
        definition: 'A number of product units which is not delivered to the customer as a result of any one of the short reasons.',
        dataFilter: 'S'
      },
      {
        term: 'Short Reason',
        definition: 'The reason a product was not fulfilled in total',
        dataFilter: 'S'
      },
      {
        term: 'Size',
        definition: "This field contains an item's package size. Example: A size of 10X25ML means the item contains 10 vials, each containing 25ML of volume.",
        dataFilter: 'S'
      },
      {
        term: 'SOURCE',
        definition: 'Source or Cardinal Source, as it is often called, is a contract portfolio of generic products for retail, acute, alternate care, and mail order pharmacies.',
        dataFilter: 'S'
      },
      {
        term: 'Source Purchases',
        definition: 'Source Purchases refers to the purchases made against the Source Contract. This field is used in Contract Value Report.',
        dataFilter: 'S'
      },
      {
        term: 'SPDPASSTHRU',
        definition: 'This is the SPD Pass thru orders which are sent from PD to SPD and fulfilled by the SPD system. Order are submitted from Order Express',
        dataFilter: 'S'
      },
      {
        term: 'Specialty (SPD)',
        definition: 'Specialty Pharmaceutical product. Note this item ships from an alternative distribution center',
        dataFilter: 'S'
      },
      {
        term: 'Strength',
        definition: 'The amount of medication within a dosage form.',
        dataFilter: 'S'
      },
      {
        term: 'Taxes, Fees & Surcharges',
        definition: 'Taxes, Fees & Surcharges encompasses the below fees: Service Billing, Service Charge, Tax, Adjustments to Rx, Adjustments to HBC, Adjustments to Other, Rx Rebate, HBC Rebate, Other Rebates, N/A and Re-stocking fees. Taxes, Fees & Surcharges are excluded by default; To remove the filter and view the additional data, select "Include" from Current Selections panel for Taxes, Fees & Surcharges parameter or navigate to Filters > Taxes, Fees & Surcharges and select ‘Include’. To reapply the exclusion filter, navigate to the "Filters" tab.',
        dataFilter: 'T'
      },
      {
        term: 'Total Inflation',
        definition: 'Total Inflation = Review Units * Price Difference',
        dataFilter: 'T'
      },
      {
        term: 'Trade Name',
        definition: 'Name best known to the market for the item. This is assigned by the manufacturer.',
        dataFilter: 'T'
      },
      {
        term: 'UDF1',
        definition: 'User Defined Field 1 - For user defined product attributes',
        dataFilter: 'U'
      },
      {
        term: 'UDF2',
        definition: 'User Defined Field 2 - For user defined product attributes',
        dataFilter: 'U'
      },
      {
        term: 'Unadjusted Customer Service Level',
        definition: "Cardinal Health's customer service level calculated using the invoice quantity and including all products shorts.",
        dataFilter: 'U'
      },
      {
        term: 'Unfiltered Customer Service Level',
        definition: "Cardinal Health's customer service level calculated using the original quantity and including all product shorts.",
        dataFilter: 'U'
      },
      {
        term: 'Unit Dose',
        definition: 'A specially packaged item that permits the dispensing of a single dose of a pharmaceutical at a time. Unit dose packaged products are widely used in hospitals and long term care settings and are more expensive than bulk products, but more efficient to distribute. The Pyxis MEDSTATION product line uses unit dose packaged products for distribution. Unit dose packaging is also referred to as unit of use packaging in the retail market. Unit dose items are not generically equivalent or substitutable for non-unit dose items. Unit dose packaged items are more efficient than loose tablets and capsules for a hospital since they can be handled more safely and returned to inventory if unused.',
        dataFilter: 'U'
      },
      {
        term: 'UOI Cost',
        definition: 'UOI Factor * Purchase Dollars',
        dataFilter: 'U'
      },
      {
        term: 'UOI Factor',
        definition: 'The Unit of Issue number that a user can manually enter (or set at the account level) that is used in calculating the Unit of Issue Cost (UOIC)',
        dataFilter: 'U'
      },
      {
        term: 'UOM',
        definition: "Acronym for Unit of Measure. An item's unit of measure is the units in which the package size is measured. Some examples are EA, ML, and GM.",
        dataFilter: 'U'
      },
      {
        term: 'UPC',
        definition: 'Acronym for Universal Product Code. The UPC is a standardized bar code symbology used throughout the retail industry for automated product identification. The UPC-A code is a 12-digit code that is controlled by the UCC in a similar manner to the NDC number. The format of the number starts with a coding system number (0-9) followed by a ten digit product identifier and completed with a single check digit. The UCC assigns manufacturers assign a 5-digit identifier with the product id solely at the desecration of the manufacturer.',
        dataFilter: 'U'
      },
      {
        term: 'Usage Inf %',
        definition: 'Usage Inflation % = ((Review Units – Compare Units) / Compare Units) * 100',
        dataFilter: 'U'
      },
      {
        term: 'Zero Dollar Invoices',
        definition: 'Zero dollar Invoices are excluded by default; ; To remove the filter and view the additional data, select ‘Include’ from Current Selections panel for 0 Dlr Inv parameter or navigate to Filters > 0 Dlr Inv and select ‘Include’. To reapply the exclusion filter, navigate to the "Filters" tab.',
        dataFilter: 'Z'
      }
]

const Letters = [

  {
    dataFilter: "All",
    heading: "All",
    id:"currentLetter"
  },
  {
    dataFilter: "AA",
    heading: "%",

  },
  {
    dataFilter: "AAA",
    heading: "3",

  },
  {
    dataFilter: "A",
    heading: "A",

  },
  {
    dataFilter: "B",
    heading: "B",

  },
  {
    dataFilter: "C",
    heading: "C",
  },
  {
    dataFilter: "D",
    heading: "D",
  },
  {
    dataFilter: "E",
    heading: "E",
  },
  {

    dataFilter: "F",
    heading: "F",

  },
  {
    dataFilter: "G",
    heading: "G",
  },
  {
    dataFilter: "H",
    heading: "H",
  },


  {

    dataFilter: "I",
    heading: "I",

  },

  // {
  //
  //   dataFilter: "J",
  //   heading: "J",
  //
  // },
  // {
  //   dataFilter: "K",
  //   heading: "K",
  // },
  {
    dataFilter: "L",
    heading: "L",
  },
  {
    dataFilter: "M",
    heading: "M",
  },
  {

    dataFilter: "N",
    heading: "N",

  },
  {
    dataFilter: "O",
    heading: "O",
  },
  {
    dataFilter: "P",
    heading: "P",
  },
  // {
  //   dataFilter: "Q",
  //   heading: "Q",
  // },
  {
    dataFilter: "R",
    heading: "R",

  },
  {
    dataFilter: "S",
    heading: "S",
  },
  {
    dataFilter: "T",
    heading: "T",
  },

  {

    dataFilter: "U",
    heading: "U",

  },
  // {
  //
  //   dataFilter: "V",
  //   heading: "V",
  //
  // },
  // {
  //   dataFilter: "W",
  //   heading: "W",
  // },
  // {
  //   dataFilter: "X",
  //   heading: "X",
  // },
  // {
  //   dataFilter: "Y",
  //   heading: "Y",
  // },
  {
    dataFilter: "Z",
    heading: "Z",
  }

];

function Glossary() {


const [items, setItems] = useState(["All"]);
const [keyword, setKeyword] = useState("");

const handleChangeKeyword = (e) => {
  setKeyword(e.target.value);
}

const handleLetterClick = (clickedLetter) => {
  setItems([clickedLetter])
// const currentlySelected = [...items];
//
//     if(items.includes(clickedLetter)){
//       currentlySelected.splice(currentlySelected.indexOf(clickedLetter), 1);
//     }
//     else {
//       currentlySelected.push(clickedLetter);
//     }
//       setItems([...currentlySelected])
  };
  //
  // console.log("items", items)

  const filteredItems = items.includes('All') ? dictionary : dictionary.filter((img) => items.includes(img.dataFilter));
  const showItems = keyword === "" ? filteredItems : filteredItems.filter(item => item.definition.indexOf(keyword) !== -1);
  return (
    <div>

        <p className="mb-3">Please select a letter below to filter the terms and definitions, or use the search input field below to search for a keyword.</p>

        <div className="filter-attr-list" id="list">

          {Letters.map((letter, i) => (
          <div
            key={i}
            className="letter"
            id={letter.id}
            data-filter={letter.dataFilter}
            onClick={()=>handleLetterClick(letter.dataFilter)}
            className={items.includes(letter.dataFilter) ? 'letter activeLetter' : 'letter'}>

            <p key={i}>{letter.heading}</p>
          </div>
        ))}
        </div>
          <div className="position-relative mt-3 mb-5">
            <input value={keyword} onChange={handleChangeKeyword} placeholder="Search" type="search" class="form-control" />
            <i class="far fa-search absoluteSearch"></i>
          </div>
        <div className="showDef">
            {showItems.map((item) =>
            <div className="d-flex flex-column mb-3">
            <p className="strong">{item.term}</p>
            <p className="smaller">{item.definition}</p>
        </div>


)}

</div>

</div>

)

  }

  export default Glossary;
