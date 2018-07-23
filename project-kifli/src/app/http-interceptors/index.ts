import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { XRequestedWithInterceptor } from './x-requested-with-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: XRequestedWithInterceptor, multi: true }
];
