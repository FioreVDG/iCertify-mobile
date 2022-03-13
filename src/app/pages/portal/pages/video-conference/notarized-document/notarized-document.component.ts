import { ActionResultComponent } from './../../../../../shared/modals/action-result/action-result.component';
import { ApiService } from 'src/app/services/api/api.service';
import { DropboxService } from './../../../../../services/dropbox/dropbox.service';
import {
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notarized-document',
  templateUrl: './notarized-document.component.html',
  styleUrls: ['./notarized-document.component.scss'],
})
export class NotarizedDocumentComponent implements OnInit {
  @Input() document;
  @Input() screenshot;
  @Input() type;

  status: string = '';
  remark: string = '';
  remarksArr: Array<string> = [
    'Principal Nonappearance',
    'Failed KYC',
    'Others',
  ];
  others: string = '';
  path: string = '/ICertify/INDIGENT/Screenshots/';
  loading: any;
  toasting: any;
  backdropView: boolean = false;

  async presentLoading(msg: any) {
    this.loading = await this.lc.create({
      message: `${msg}`,
    });
    await this.loading.present();
  }

  async presentToast(msg: any) {
    this.toasting = await this.toast.create({
      message: `${msg}`,
      duration: 1500,
    });
    await this.toasting.present();
  }

  async presentModal(
    component: any,
    CssClass: string,
    componentProps: {},
    action: string
  ) {
    const modal = await this.mc.create({
      component: component,
      cssClass: CssClass,
      componentProps: componentProps,
      showBackdrop: true,
      animated: true,
    });

    this.backdropView = true;

    modal.onDidDismiss().then((res: any) => {
      console.log(res);
      if (res && action === 'Notarized') {
        this.mc.dismiss({ data: 'Notarized' });
        this.backdropView = false;
      } else {
        this.mc.dismiss({ data: 'Unnotarized' });
        this.backdropView = false;
      }
    });

    return await modal.present();
  }

  constructor(
    public mc: ModalController,
    private alert: AlertController,
    private lc: LoadingController,
    private dbx: DropboxService,
    private toast: ToastController,
    private api: ApiService
  ) {}

  ngOnInit() {
    console.log(this.document, this.screenshot, this.type);
  }

  async presentAlertConfirm(event: any) {
    let msg =
      this.type === 'Notarized'
        ? `Are you sure you want to notarized ${event.refCode}`
        : `Are you sure you want to mark as unnotarized ${event.refCode}`;
    const alert = await this.alert.create({
      cssClass: '',
      header: 'Before you proceed!',
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
            this.changeDocumentStatus(event);
          },
        },
      ],
    });

    await alert.present();
  }

  changeDocumentStatus(event: any) {
    console.log(event);
    if (this.type === 'Notarized') {
      this.document.documentStatus = 'Notarized';
      // const loader = this.util.startLoading('Confirming Please wait...');
      this.presentLoading('Confirming please wait...');
      //UPLOADING TO DBX
      console.log(this.screenshot);
      let imgBlob = this.dataURItoBlob(this.screenshot.split(',')[1]);
      console.log(imgBlob);
      let fileName: any = event.refCode + '-' + event._id;
      this.dbx.uploadFile(this.path, fileName + '.png', imgBlob).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            this.presentToast('File Successfully Uploaded!');
            event.screenShots = [res.result];
            console.log(event);
            this.api.document
              .notarize(event, event._id)
              .subscribe((res: any) => {
                console.log(res);
                if (res) {
                  let docLogs: any = {};
                  let docIds: any = [];
                  docLogs.docDetails = this.document;
                  docLogs.message = 'Marked as Notarized';
                  docLogs._barangay = this.document._barangay;
                  docIds.push(this.document._id);
                  this.api.documentlogs.createDocumentLogs(docLogs).subscribe(
                    (res: any) => {
                      console.log(res);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                  let apiQueries = docIds.map((id: any) => {
                    return this.api.document.update(
                      {
                        documentLogStatus: 'Marked as Notarized',
                      },
                      id
                    );
                  });
                  forkJoin(apiQueries).subscribe(
                    (res: any) => {
                      console.log(res);
                    },
                    (err: any) => {
                      console.log(err);
                    }
                  );
                  this.loading.dismiss();

                  let componentProps = {
                    success: true,
                    message: `${event.refCode} Document successfully marked as notarized!`,
                    button: 'Okay',
                  };
                  this.presentModal(
                    ActionResultComponent,
                    'my-modal',
                    componentProps,
                    'Notarized'
                  );
                }
              });
          }
        },
        (err) => {
          console.log(err);
          this.presentToast('Failed to Upload File.');
          this.loading.dismiss();
        }
      );
    } else {
      this.presentLoading('Confirming please wait...');
      event.remark = this.others ? this.others : this.remark;

      this.document.documentStatus = 'Unnotarized';
      this.api.document.unnotarize(event, event._id).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let docLogs: any = {};
            let docIds: any = [];
            docLogs.docDetails = this.document;
            docLogs.message = 'Marked as Unnotarized';
            docLogs._barangay = this.document._barangay;
            docIds.push(this.document._id);
            console.log(docLogs);
            this.api.documentlogs.createDocumentLogs(docLogs).subscribe(
              (res: any) => {
                console.log(res);
              },
              (err) => {
                console.log(err);
              }
            );
            let apiQueries = docIds.map((id: any) => {
              return this.api.document.update(
                {
                  documentLogStatus: 'Marked as Unnotarized',
                },
                id
              );
            });
            forkJoin(apiQueries).subscribe(
              (res: any) => {
                console.log(res);
              },
              (err) => {
                console.log(err);
              }
            );
            this.loading.dismiss();
            let componentProps = {
              success: true,
              message: `${event.refCode} Document successfully marked as Unnotarized!`,
              button: 'Okay',
            };
            this.presentModal(
              ActionResultComponent,
              'my-modal',
              componentProps,
              'Unnotarized'
            );
          }
        },
        (err) => {
          this.loading.dismiss();
          let componentProps = {
            success: false,
            message: err.error.message || 'Server error, Please try again!',
            button: 'Okay',
          };
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

  //CONVERT BASE 64 to blob
  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
}
