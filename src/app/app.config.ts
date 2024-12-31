import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { errorsInterceptor } from './core/interceptors/errors.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor, errorsInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      easeTime: 300,
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: true,
    }),
    importProvidersFrom(NgxSpinnerModule)

  ]
};
