export function validarCorreoGmail(correo: string): boolean {
    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regexGmail.test(correo);
}