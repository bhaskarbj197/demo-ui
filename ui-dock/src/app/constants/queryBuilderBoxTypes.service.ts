/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderBoxTypes {

  constructor() { }

  public FUNCTION: string = "Rules";
  public TABLE: string = "Tables";
  public COLUMN: string = "Columns";
  public OPERATOR: string = "Operators";
  public VALUE: string = "Value";
}
