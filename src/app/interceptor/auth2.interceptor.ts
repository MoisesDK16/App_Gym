import { HttpInterceptorFn } from '@angular/common/http';

export const auth2Interceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  console.log('Token:', token); // Agrega esta línea para verificar el token

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token ? token : ''}`, // Verificar que el token no sea nulo
    },
  });

  return next(clonedRequest);
};


