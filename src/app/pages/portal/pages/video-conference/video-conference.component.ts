/* eslint-disable curly */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
import { InfoViewComponent } from './info-view/info-view.component';
import { ActionResultComponent } from './../../../../shared/modals/action-result/action-result.component';
import { NotarizedDocumentComponent } from './notarized-document/notarized-document.component';
import { DropboxService } from './../../../../services/dropbox/dropbox.service';
import { ApiService } from './../../../../services/api/api.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import html2canvas from 'html2canvas';
import { ConferenceComponent } from 'src/app/shared/component/conference/conference.component';

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.scss'],
})
export class VideoConferenceComponent implements OnInit {
  @ViewChild(ConferenceComponent) conferenceComp!: ConferenceComponent;
  today: Date = new Date();
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
  screenshot: any;
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
  remainingDocsChecker: any;

  async presentLoading(msg: any) {
    this.loadingPresent = await this.loadingController.create({
      message: `${msg}`,
    });
    await this.loadingPresent.present();
  }

  async presentModal(
    component: any,
    CssClass: string,
    componentProps: {},
    action: string
  ) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: CssClass,
      componentProps: componentProps,
      showBackdrop: true,
      animated: true,
    });

    modal.onDidDismiss().then((res: any) => {
      console.log(res);
      console.log(action);
      if (res.data !== undefined && action === 'view-details') {
        this.currentDocument.isDetailsReviewed = true;
        this.presentLoading('Loading details...');
        this.currentTransactionIndex++;

        let notaryQuery: QueryParams = {
          find: [{ field: '_notaryId', operator: '=', value: this.me._id }],
        };

        this.api.room.get(notaryQuery).subscribe((res: any) => {
          console.log(res);
          this.loadingPresent.dismiss();
          if (res && res.env.room.length) {
            this.presentLoading('Checking room details...');
            this.currentRoom = res.env.room[0]._id;
            this.api.room.delete(this.currentRoom).subscribe(
              (res: any) => {
                console.log(res);
                this.initiateTransaction();
                this.loadingPresent.dismiss();
              },
              (err) => {
                console.log(err);
                this.loadingPresent.dismiss();
              }
            );
          }
        });
      } else if (res.data !== undefined && action === 'leave') {
        this.leaveMeeting();
      }
    });

    return await modal.present();
  }

  async presentAlertConfirm(msg: string, method: any) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {},
        },
        {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            if (method === 'Skip') this.proceedSkipping(this.currentDocument);
          },
        },
      ],
    });

    await alert.present();
  }
  constructor(
    private auth: AuthService,
    private api: ApiService,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private dbx: DropboxService,
    private ac: AlertController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loading = true;
    this.presentLoading('Loading conferences...');
    this.auth.me().subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.me = res.env.user;
        this.getParticipants();
        this.loading = false;
      }
    });
    this.remainingDocsChecker = setInterval(() => {
      this.checkRemainingDocuments();
    }, 1000);
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
    this.api.conference.getScheduled(query).subscribe(
      (res: any) => {
        console.log(res);
        this.schedules = res.env.schedules;
        this.loadingPresent.dismiss();
      },
      (error) => {
        this.loadingPresent.dismiss();
      }
    );
  }

  checkRemainingDocuments() {
    if (this.joinRoom) {
      let transactionsTemp: any = this.transactions.filter(
        (o: any) =>
          o._documents[0].documentStatus === 'Pending for Notary' ||
          o._documents[0].documentStatus === 'Skipped'
      );
      // console.log(this.currentTransaction);

      if (!transactionsTemp.length) {
        clearInterval(this.remainingDocsChecker);
        let componentProps = {
          success: true,
          message: `You have been successfully finished notarizing/unnotarizing documents. Click Leave Now button to end this meeting`,
          button: 'Leave Now',
        };
        this.presentModal(
          ActionResultComponent,
          'my-modal',
          componentProps,
          'leave'
        );
      }
    }
  }

  takeScreenshot() {
    html2canvas(document.getElementById('toScreenShot') || document.body).then(
      (canvas) => {
        // Convert the canvas to blob
        this.screenshot = canvas.toDataURL('image/png');
        console.log(this.screenshot);
        // this.util.stopLoading(loader);
        this.notarizeDocument('Notarized');
      }
    );
  }

  async notarizeDocument(type: string) {
    const modal = await this.modalController.create({
      component: NotarizedDocumentComponent,
      cssClass: '',
      showBackdrop: true,
      componentProps: {
        document: this.currentDocument,
        screenshot: this.screenshot,
        type: type,
      },
    });
    modal.onDidDismiss().then((res: any) => {
      console.log(res.data);
      this.currentDocument.documentStatus = res.data;
    });

    return await modal.present();
  }

  skipDocument() {
    console.log(this.currentDocument);
    this.presentAlertConfirm(
      'Are you sure you want to skip this document?',
      'Skip'
    );
  }

  proceedSkipping(event: any) {
    console.log(event);
    this.api.document.skip({}, event._id).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.currentDocument.documentStatus = res.env.document.documentStatus;
          console.log(this.currentDocument);
          let componentProps = {
            success: true,
            message: `${event.refCode} successfully skipped!`,
            button: 'Okay',
          };
          this.presentModal(
            ActionResultComponent,
            'my-modal',
            componentProps,
            'Skip'
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
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

  openUserDetails(event?: any) {
    let transactionAdvance: any;
    let tempStatus: any = ['Notarized', 'Unnotarized'];
    console.log(this.currentTransactionIndex);
    if (this.currentTransactionIndex !== this.transactions.length - 1)
      transactionAdvance = this.transactions[this.currentTransactionIndex + 1];
    console.log(transactionAdvance);
    console.log(transactionAdvance?._documents[0]?.documentStatus);
    // console.log(this.transactions);
    console.log(this.currentTransactionIndex);
    console.log(this.currentTransaction);
    if (
      this.currentTransactionIndex === this.transactions.length - 1 &&
      event !== 'view'
    ) {
      this.currentTransactionIndex = -1;
    }
    if (
      tempStatus.includes(
        this.transactions[this.currentTransactionIndex + 1]?._documents[0]
          ?.documentStatus
      ) &&
      event !== 'view'
    ) {
      console.log('tapos na to poooooootang inaaaaaaaaaaaaa');
      this.nextTransaction();
    } else {
      let componentProps = {
        details:
          this.transactions[
            event === 'view'
              ? this.currentTransactionIndex
              : this.currentTransactionIndex + 1
          ].sender,
        document:
          this.transactions[
            event === 'view'
              ? this.currentTransactionIndex
              : this.currentTransactionIndex + 1
          ]._documents[0],
        video:
          this.transactions[
            event === 'view'
              ? this.currentTransactionIndex
              : this.currentTransactionIndex + 1
          ].videoOfSignature,
      };
      console.log(this.currentTransactionIndex);
      let toDo: any;
      event === 'view' ? (toDo = '') : (toDo = 'view-details');
      this.presentModal(InfoViewComponent, '', componentProps, toDo);
    }
  }

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
        if (
          this.currentDocument.queue === '1' &&
          this.currentDocument.documentStatus === 'Pending for Notary'
        )
          this.openUserDetails('view');

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

  checkDocumentStatus() {
    let filtPending: any = this.currentTransaction?._documents.filter(
      (o: any) => o.documentStatus === 'Pending for Notary'
    );
    if (filtPending?.length) return true;
    else return false;
  }

  checkDocumentStatus2() {
    let filtPending: any = this.currentTransaction?._documents.filter(
      (o: any) => o.documentStatus === 'Pending for Notary'
    );
    let filtSkip: any = this.currentTransaction?._documents.filter(
      (o: any) => o.documentStatus === 'Skipped'
    );
    if (filtPending?.length || filtSkip?.length) return true;
    else return false;
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

  leaveMeeting(event?: any) {
    console.log(event);
    this.presentLoading('Leaving...');
    this.api.room.delete(this.currentRoom).subscribe(
      (res: any) => {
        console.log(res);
        this.joinRoom = false;
        this.loadingPresent.dismiss();
        this.getParticipants();
      },
      (err) => {
        let componentProps = {
          success: false,
          message: err.error.message || `Server Error Please try again`,
          button: 'Okay',
        };
        this.loadingPresent.dismiss();
        this.presentModal(
          ActionResultComponent,
          'my-modal',
          componentProps,
          ''
        );
      }
    );
  }
}
