import { DropboxService } from './../../../../../services/dropbox/dropbox.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-view',
  templateUrl: './info-view.component.html',
  styleUrls: ['./info-view.component.scss'],
})
export class InfoViewComponent implements OnInit {
  @Input() details: any;
  @Input() document: any;
  @Input() video: any;
  documentDisplay: any;
  _images: any = [
    {
      label: '1st Valid Government ID',
      fcname: 'government_ID_1',
    },
    {
      label: '2nd Valid Government ID',
      fcname: 'government_ID_2',
    },
    {
      label: 'Certificate of Indigency',
      fcname: 'cert_of_indigency',
    },
  ];
  step = 1;
  male = '../../../../../../assets/images/male.png';
  female = '../../../../../../assets/images/female.jpg';
  constructor(public mc: ModalController, private dbx: DropboxService) {}

  ngOnInit() {
    console.log(this.details);
    console.log(this.document);
    console.log(this.video);
  }

  async ionViewDidEnter() {
    this.getImages();
  }

  async getImages() {
    this._images.forEach(async (image: any) => {
      if (this.details.images && this.details.images[image.fcname]) {
        image.url = await this.getTempLink(
          this.details.images[image.fcname].path_display
        );
      } else delete image.url;

      console.log(this._images);
    });

    if (this.video?.path_display) {
      this.video.vidURL = await this.getTempLink(this.video?.path_display);
      console.log(this.video);
    } else delete this.video.vidURL;

    if (this.document.dropbox.path_display) {
      this.documentDisplay = await this.getTempLink(
        this.document.dropbox.path_display
      );
      console.log(this.documentDisplay);
    } else delete this.documentDisplay;
  }

  async getTempLink(data: any) {
    console.log(data);
    const response = await this.dbx
      .getTempLink(data)
      .toPromise()
      .catch((err: any) => {
        console.log(err);
      });
    console.log(response);
    return response.result.link;
  }
}
