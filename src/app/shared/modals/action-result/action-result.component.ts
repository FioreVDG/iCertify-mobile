import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-result',
  templateUrl: './action-result.component.html',
  styleUrls: ['./action-result.component.scss'],
})
export class ActionResultComponent implements OnInit {
  @Input() success: boolean;
  @Input() message: string;
  @Input() button: string;
  constructor(public modal: ModalController) {}

  ngOnInit() {}
}
