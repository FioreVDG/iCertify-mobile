/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  AgoraClient,
  ClientEvent,
  NgxAgoraService,
  Stream,
  StreamEvent,
} from 'ngx-agora';
import { ApiService } from 'src/app/services/api/api.service';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-conference-room',
  templateUrl: './conference-room.component.html',
  styleUrls: ['./conference-room.component.scss'],
})
export class ConferenceRoomComponent implements OnInit {
  @Input() schedule: string;
  @ViewChild('agora_local') videoContainer;
  @ViewChild('remote') remoteVideo;
  private video: HTMLVideoElement;
  private video2: HTMLVideoElement;

  localCallId = 'agora_local';
  remoteCalls: Array<any> = [];

  private client: AgoraClient;
  private localStream: Stream;
  private uid = '';
  private token = '';
  public localAudio = true;
  public localVideo = true;
  channelName: any = '123123123';

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
    private store: Store<{ user: User }>
  ) {
    this.video = document.createElement('video');
    this.video.style.width = '140%';
    this.video.style.height = '100%';
    this.video.setAttribute('autoplay', '');
    console.log(this.video);
  }

  ngOnInit() {}

  ionViewDidEnter() {
    console.log(
      navigator.mediaDevices,
      '][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]'
    );
    document.getElementById('agora_local').appendChild(this.video);
    this.initWebRTC();
  }

  initWebRTC() {
    const constraints = {
      video: true,
      audio: false,
    };

    const handleSuccess = (stream: MediaStream) => {
      (<any>window).stream = stream; // make stre  am available to browser console
      this.video.srcObject = stream;

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
        console.log(
          '][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]',
          res
        );
        if (res) {
          this.token = res.env.token;
        }
        this.store.select('user').subscribe((res: User) => {
          console.log(res);
          this.uid = res._id;
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
          // Join and publish methods added in this step
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
        });
      },
      (err: any) => {
        console.log(err);
        this.loading.dismiss();
      }
    );
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
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

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
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
        document.getElementById('remote').appendChild(this.video2);
        setTimeout(() => {
          stream.play(id);
        }, 1000);
        //
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

  private leave() {
    this.client.stopLiveStreaming;

    this.client.leave(
      () => {
        console.log('Leavel channel successfully');
      },
      (err) => {
        console.log('Leave channel failed');
      }
    );
  }

  private joinAgain() {
    console.log('5. Join & Publish Triggers');
    this.join(
      (uid) => this.publish(),
      (error) => console.error(error)
    );
  }
}
