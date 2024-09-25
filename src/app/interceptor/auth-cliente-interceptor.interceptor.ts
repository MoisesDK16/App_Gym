import { HttpInterceptorFn } from '@angular/common/http';

export const authClienteInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessTokenCliente');
  console.log('Token authCliente:', token); // Agrega esta línea para verificar el token

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token ? token : ''}`, // Verificar que el token no sea nulo
    },
  });

  return next(clonedRequest);
};
