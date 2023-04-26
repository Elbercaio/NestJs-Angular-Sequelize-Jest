import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsCpf', async: false })
export class IsCpf implements ValidatorConstraintInterface {
  private readonly BLACKLIST: Array<string> = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '12345678909',
  ];

  isValid(cpf: string): boolean {
    let sum = 0;
    let rest = 0;

    if (!cpf) {
      return false;
    }
    if (cpf.length !== 11) {
      return false;
    }
    if (this.BLACKLIST.includes(cpf)) {
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }
    rest = (sum * 10) % 11;

    if (rest > 9) {
      rest = 0;
    }
    if (rest !== parseInt(cpf.substring(9, 10), 10)) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }
    rest = (sum * 10) % 11;

    if (rest > 9) {
      rest = 0;
    }
    if (rest !== parseInt(cpf.substring(10, 11), 10)) {
      return false;
    }

    return true;
  }

  validate(cpf: string): Promise<boolean> | boolean {
    return this.isValid(cpf);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!validationArguments?.value) {
      return 'Campo CPF é obrigatório.';
    }

    if (validationArguments?.value.length !== 11) {
      return 'Campo CPF deve ser igual a 11 caracteres.';
    }

    return 'O valor ($value) não é um CPF valido.';
  }
}
