export const getOnlyNumbers = (value: string) => {
  return value?.replace(/[^\d]+/g, "");
};

export const formatCpf = (cpf: string) => {
  cpf = getOnlyNumbers(cpf);
  if (cpf.length > 11) {
    cpf = cpf.slice(0, 11);
  }
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const isCpfValid = (cpf: string) => {
  cpf = getOnlyNumbers(cpf);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  for (let j = 9; j < 11; j++) {
    let sum = 0;
    for (let i = 0; i < j; i++) {
      sum += parseInt(cpf[i]) * (j + 1 - i);
    }
    let digit = (sum * 10) % 11;
    if (digit === 10) digit = 0;
    if (digit !== parseInt(cpf[j])) return false;
  }

  return true;
};
