import { PortalComponent } from './portal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (r) => r.DashboardModule
          ),
      },
      {
        path: 'video-conference',
        loadChildren: () =>
          import('./pages/video-conference/video-conference.module').then(
            (r) => r.VideoConferenceModule
          ),
      },
      {
        path: 'brgy-video-conference',
        loadChildren: () =>
          import(
            './pages/brgy-video-conference/brgy-video-conference.module'
          ).then((r) => r.BrgyVideoConferenceModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
