import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conference-room',
  templateUrl: './conference-room.component.html',
  styleUrls: ['./conference-room.component.scss'],
})
export class ConferenceRoomComponent implements OnInit {
  @Input() schedule: string;
  constructor() {}

  ngOnInit() {
    console.log(this.schedule);
  }
}
