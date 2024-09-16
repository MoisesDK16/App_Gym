export function validarContraseñaSegura(contraseña: string): boolean {
    const regexContraseñaFlexible = /^(?=.*[@$!%*?&])[A-Za-z\dñÑ@$!%*?&]{8,}$/;
    return regexContraseñaFlexible.test(contraseña);
  }