/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export enum DownloadFileTypes {
    VALIDATION = "validation",
    FILE_DATA = "filedata",
    PROFIT_LOSS = "profitloss",
    INPUT_LOG = "inputlog",
    PROCESSED_LOG = "processedlog",
    ORIGINAL = "original"

}

export enum FileContentTypes {
    pdf = "application/pdf",
    csv = "text/csv",
    xls = "application/vnd.ms-excel",
    xlsx = "application/vnd.ms-excel",
    doc = "application/msword",
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

export enum AllowedFormats {
    pdf = ".pdf, .PDF",
    csv = ".csv",
    xls = ".xlsx,.xls",
    xlsx = ".xlsx",
    doc = ".doc",
    docx = ".docx"
}
