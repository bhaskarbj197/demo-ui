import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scheduler-run-history',
  templateUrl: './scheduler-run-history.component.html',
  styleUrls: ['./scheduler-run-history.component.scss']
})
export class SchedulerRunHistoryComponent implements OnInit {

  @Input() heading: string = "";
  
  constructor() { }

  ngOnInit() {
  }

}
