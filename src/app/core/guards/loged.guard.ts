import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('userToken');

    if (token !== null) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }

  // If not in the browser, return true to allow the route to activate
  return true;
};
