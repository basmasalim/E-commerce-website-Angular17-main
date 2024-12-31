import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('userToken');

    if (token !== null) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } else {
    // If the code is running on the server or in another non-browser context,
    // you should decide on the desired behavior. Typically, you might want to deny access:
    return false;
  }
};
