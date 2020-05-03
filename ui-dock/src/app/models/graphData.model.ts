/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class GraphDataModel {
    data: Array<string|number|object>; 
    labels: Array<string>; 
    colors: Array<string>;

    constructor(data: Array<string|number|object> = [], labels: Array<string> = [], colors: Array<string> = []) {
        this.data = data;
        this.labels = labels;
        this.colors = colors;
    }
}