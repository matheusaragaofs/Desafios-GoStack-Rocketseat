const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-br', {minimumFractionDigits:2,style:'currency', currency:'BRL'}).format(value); // TODO

export default formatValue;
