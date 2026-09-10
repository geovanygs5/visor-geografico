import { setWorkerUrl } from 'maplibre-gl';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

setWorkerUrl(new URL('maplibre-gl-worker.mjs', document.baseURI).href);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));