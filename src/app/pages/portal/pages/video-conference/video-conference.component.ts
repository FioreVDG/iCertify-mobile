/* eslint-disable curly */
import { DropboxService } from './../../../../services/dropbox/dropbox.service';
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
import { LoadingController } from '@ionic/angular';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ConferenceRoomComponent } from './conference-room/conference-room.component';
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
import { ApiService } from './../../../../services/api/api.service';
/* eslint-disable no-underscore-dangle */
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryParams } from 'src/app/models/queryparams.iterface';

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.scss'],
})
export class VideoConferenceComponent implements OnInit {
  me: any;
  schedules: any;
  currentSchedule: any;
  transactions: Array<any> = [];
  transactionCount: any;
  joinRoom: boolean = false;
  loading: boolean = false;
  currentTransaction: any;
  currentTransactionIndex: number = -1;
  currentDocument: any;
  loadingPresent: any;
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
  currentRoom: any;
  remoteCallDetails: any;

  async presentLoading(msg: any) {
    this.loadingPresent = await this.loadingController.create({
      message: `${msg}`,
    });
    await this.loadingPresent.present();
  }
  constructor(
    private auth: AuthService,
    private api: ApiService,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private dbx: DropboxService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loading = true;
    this.auth.me().subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.me = res.env.user;
        this.getParticipants();
        this.loading = false;
      }
    });
  }

  getParticipants() {
    const query: any = {
      find: [
        {
          field: '_notaryId',
          operator: '=',
          value: this.me._notaryId,
        },
      ],
    };
    this.api.conference.getScheduled(query).subscribe((res: any) => {
      console.log(res);
      this.schedules = res.env.schedules;
    });
  }

  async openRoom(sched: any) {
    const modal = await this.modalController.create({
      component: ConferenceRoomComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        schedule: sched,
        me: this.me,
      },
    });
    return await modal.present();
  }

  joinMeeting(sched: any) {
    this.presentLoading('Joining...');
    this.currentSchedule = sched;
    this.transactions = [];
    this.currentSchedule._folderIds.forEach((folder: any) => {
      folder._transactions.forEach((transaction: any) => {
        this.transactions.push(transaction);
      });
    });
    console.log(this.transactions);
    this.transactionCount = this.transactions.length;
    setTimeout(() => {
      this.joinRoom = true;
      this.loadingPresent.dismiss();
      this.nextTransaction();
    }, 1000);
  }

  nextTransaction() {
    this.currentTransactionIndex++;
    this.initiateTransaction();
  }

  openUserDetails() {}

  selectDocumentToview(event: any) {
    console.log(event);
    this.currentDocument = event;
  }

  initiateTransaction() {
    this.presentLoading('Initiating room details...');
    this.currentTransaction = this.transactions[this.currentTransactionIndex];
    console.log(this.currentTransaction);
    this.selectDocumentToview(this.currentTransaction._documents[0]);
    this.getImages();

    let notaryQuery: QueryParams = {
      find: [{ field: '_notaryId', operator: '=', value: this.me._id }],
    };

    this.api.room.get(notaryQuery).subscribe((res: any) => {
      console.log(res);
      if (res) {
        if (res.env.room.length) {
          this.remoteCallDetails = res.env.room[0].currentTransaction.sender;
          this.currentRoom = res.env.room[0]._id;
        }
        console.log('ITO YUNG EXISTING ROOM', res.env.room);
        this.loadingPresent.dismiss();
        if (!res.env.room.length) {
          console.log('WALA PANG EXISTING ROOM');
          console.log(this.remoteCallDetails);
          let roomToAdd: any = {};
          roomToAdd.que = this.currentTransaction.que;
          roomToAdd.currentTransaction = this.currentTransaction;
          roomToAdd.currentSchedId = this.currentSchedule._id;

          this.api.room.create(roomToAdd).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                this.currentRoom = res.env.room._id;
                this.remoteCallDetails = res.env.room.currentTransaction.sender;
                console.log(this.remoteCallDetails);
                this.loadingPresent.dismiss();

                console.log(res);
                console.log('ITO YUNG BAGONG EXISTING ROOM', res.env.room);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
    });
  }

  async getImages() {
    this._images.forEach(async (image: any) => {
      if (
        this.currentTransaction.sender.images &&
        this.currentTransaction.sender.images[image.fcname]
      ) {
        image.url = await this.getTempLink(
          this.currentTransaction.sender.images[image.fcname].path_display
        );
      } else delete image.url;

      console.log(this._images);
    });

    if (this.currentTransaction.videoOfSignature.path_display)
      this.currentTransaction.vidURL = await this.getTempLink(
        this.currentTransaction.videoOfSignature.path_display
      );
    else delete this.currentTransaction.vidURL;
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

  leaveMeeting(event: any) {
    console.log(event);
    this.presentLoading('Leaving...');
    this.api.room.delete(this.currentRoom).subscribe((res: any) => {
      console.log(res);
      this.modalController.dismiss();
      this.loadingPresent.dismiss();
    });
  }
}
