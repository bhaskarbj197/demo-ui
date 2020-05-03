/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

import { Observable, Subject } from 'rxjs';

export class Broadcaster {
  private subject = new Subject<any>();

  constructor() { }

  send(name: string, data?: any) {
    this.subject.next({name: name, data: data});
  }

  clear() {
    this.subject.next();
  }

  receive(): Observable<any> {
    return this.subject.asObservable();
  }
}
