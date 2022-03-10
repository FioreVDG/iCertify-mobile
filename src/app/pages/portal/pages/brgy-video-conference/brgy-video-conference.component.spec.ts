import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrgyVideoConferenceComponent } from './brgy-video-conference.component';

describe('BrgyVideoConferenceComponent', () => {
  let component: BrgyVideoConferenceComponent;
  let fixture: ComponentFixture<BrgyVideoConferenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrgyVideoConferenceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrgyVideoConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
