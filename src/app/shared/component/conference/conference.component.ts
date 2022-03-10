/* eslint-disable @angular-eslint/no-output-on-prefix */
import { AlertController } from '@ionic/angular';
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  AgoraClient,
  ClientEvent,
  NgxAgoraService,
  StreamEvent,
  Stream,
} from 'ngx-agora';
import { User } from 'src/app/models/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import {
  DropEvent,
  DroppableDirective,
  ValidateDrop,
} from 'angular-draggable-droppable';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {
  @Input() channelName: string = '';
  @Input() me: any;
  @ViewChild('agora_local') videoContainer;
  @ViewChild('remote') remoteVideo;

  private video: HTMLVideoElement;
  private video2: HTMLVideoElement;

  localCallId = 'agora_local';
  remoteCalls: Array<any> = [];

  private client: AgoraClient;
  private localStream: Stream;
  private uid: string = '';
  private token: string = '';
  public localAudio: boolean = true;
  public localVideo: boolean = true;
  tempSrc: any;

  @Output() onLeaveMeeting: any = new EventEmitter<any>();

  loading: any;
  toasting: any;

  async presentToast(msg: any) {
    this.toasting = await this.toast.create({
      message: `${msg}`,
      duration: 3000,
    });
    await this.toasting.present();
  }
  async presentLoading(msg: any) {
    this.loading = await this.loadingController.create({
      message: `${msg}`,
    });
    await this.loading.present();
  }

  constructor(
    private ngxAgoraService: NgxAgoraService,
    private api: ApiService,
    private toast: ToastController,
    public loadingController: LoadingController,
    private store: Store<{ user: User }>,
    private alertController: AlertController
  ) {
    this.video = document.createElement('video');
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.setAttribute('autoplay', '');
    console.log(this.video);
  }

  ngOnInit() {
    document.getElementById('agora_local').appendChild(this.video);
    this.initWebRTC();
  }

  // ionViewDidEnter() {
  //   document.getElementById('agora_local').appendChild(this.video);
  //   this.initWebRTC();
  // }

  initWebRTC() {
    const constraints = {
      video: true,
      audio: false,
    };

    const handleSuccess = (stream: MediaStream) => {
      (<any>window).stream = stream;
      this.video.srcObject = stream;
      this.tempSrc = stream;
      this.startConference();
    };

    const handleError = (error: any) => {
      const p = document.createElement('p');
      p.innerHTML =
        'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
      this.videoContainer.nativeElement.appendChild(p);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  }

  startConference() {
    this.presentLoading('Entering Room...');
    this.api.agora.getToken(this.channelName).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.token = res.env.token;
          this.uid = this.me._id;
          this.client = this.ngxAgoraService.createClient({
            mode: 'rtc',
            codec: 'h264',
          });
          this.assignClientHandlers();

          this.localStream = this.ngxAgoraService.createStream({
            streamID: this.uid,
            audio: this.localAudio,
            video: this.localVideo,
            screen: false,
          });
          console.log(this.localStream);
          this.assignLocalStreamHandlers();

          this.initLocalStream(() =>
            this.join(
              (uid) => {
                this.publish();
                this.loading.dismiss();
              },
              (error) => {
                console.error(error);
                this.loading.dismiss();
              }
            )
          );
        }
      },
      (err: any) => {
        console.log(err);
        this.loading.dismiss();
      }
    );
  }

  join(
    onSuccess?: (uid: number | string) => void,
    onFailure?: (error: Error) => void
  ): void {
    this.client.join(
      this.token,
      this.channelName,
      this.uid,
      onSuccess,
      onFailure
    );
  }

  publish(): void {
    this.client.publish(this.localStream, (err) =>
      console.log('Publish local stream error: ' + err)
    );
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, (error) => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          (renewError) =>
            console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      console.log('-- Remote Stream Added');
      const stream = evt.stream;
      this.client.subscribe(stream, { audio: true, video: true }, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      console.log('-- Remote Stream Subcribed');
      const stream = evt.stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        this.video2 = document.createElement('video');
        this.video2.style.width = 'inherit';
        this.video2.style.height = 'inherit';
        this.video2.setAttribute('autoplay', '');
        this.video2.srcObject = stream.stream;
        this.video2.onloadedmetadata = () => {
          this.video2.play();
        };
        console.log(this.video2);
        setTimeout(() => {
          document.getElementById('remote')?.appendChild(this.video2);
        }, 500);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      console.log('-- Remote Stream Removed');
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call !== `${this.getRemoteId(stream)}`
        );
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) => console.error('getUserMedia failed', err)
    );
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }

  leave() {
    this.client.stopLiveStreaming;
    this.client.leave(
      () => {
        this.localStream.stop();
        this.localStream.close();
        this.onLeaveMeeting.emit();
        console.log('Leavel channel successfully');
      },
      (err) => {
        console.log('Leave channel failed');
      }
    );
  }

  toggleAudio() {
    if (this.localAudio) {
      this.localStream.muteAudio();
    } else {
      this.localStream.unmuteAudio();
    }
    this.localAudio = !this.localAudio;
    console.log(this.localAudio);
  }

  toggleVideo() {
    if (this.localVideo) {
      this.localStream.muteVideo();
      this.video.srcObject = null;
    } else {
      this.localStream.unmuteVideo();
      this.video.srcObject = this.tempSrc;
    }
    this.localVideo = !this.localVideo;
    console.log(this.localVideo);
  }

  private joinAgain() {
    console.log('5. Join & Publish Triggers');
    this.join(
      (uid) => this.publish(),
      (error) => console.error(error)
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Before you proceed!',
      message: '<strong>Are you sure you want to leave the meeting</strong>!!!',
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
            this.leave();
          },
        },
      ],
    });

    await alert.present();
  }

  droppedData: string = '';

  @ViewChild(DroppableDirective, { read: ElementRef, static: true })
  droppableElement: ElementRef;

  onDrop({ dropData }: DropEvent<string>): void {
    this.droppedData = dropData;
    console.log(this.droppedData);
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

  validateDrop: ValidateDrop = ({ target }) =>
    this.droppableElement.nativeElement.contains(target as Node);
}
