const STATE_NAMES = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapa', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceara', DF: 'Distrito Federal',
  ES: 'Espirito Santo', GO: 'Goias', MA: 'Maranhao', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Para', PB: 'Paraiba', PR: 'Parana', PE: 'Pernambuco', PI: 'Piaui', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondonia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'Sao Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

function normalize(value = '') {
  return String(value).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function sameName(expected, actual) {
  const first = normalize(expected);
  const second = normalize(actual);
  return Boolean(first && second && (first === second || first.startsWith(`${second} `) || second.startsWith(`${first} `)));
}

function normalizeStreet(value) {
  return normalize(value).replace(/^(rua|r|avenida|av|estrada|rodovia|rod|travessa|tv)\s+/, '');
}

// A geocodificação pode devolver apenas o centro da cidade para um endereço vago.
// Compara rua, cidade e estado com a resposta reversa para evitar salvar esse resultado.
export function confirmsAddress(input, address) {
  if (!address?.street || !address?.region) return false;

  const requestedStreet = normalizeStreet(input.street);
  const locatedStreet = normalizeStreet(address.street);
  const streetMatches = requestedStreet && locatedStreet &&
    (requestedStreet === locatedStreet || requestedStreet.includes(locatedStreet) || locatedStreet.includes(requestedStreet));
  if (!streetMatches) return false;

  const locatedCity = [address.city, address.subregion].some((part) => sameName(input.city, part));
  if (!locatedCity) return false;

  const requestedStates = [input.state, STATE_NAMES[String(input.state || '').trim().toUpperCase()]];
  const locatedState = requestedStates.some((expected) => sameName(expected, address.region));
  if (!locatedState) return false;

  const requestedNumber = normalize(input.number);
  const locatedNumber = normalize(address.streetNumber);
  return !locatedNumber || requestedNumber === locatedNumber;
}
