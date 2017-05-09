function makeGenerator(randomArray) {
  randomArray = ['Ford', 'Chevy', 'Chrysler', 'Honda', 'Toyota', 'Subaru', 'BMW', 'Hyundai'];
  return randomArray[Math.floor(Math.random() * randomArray.length)]
}
function modelGenerator(randomArray) {
  randomArray = ['Civic', 'Crosstrek', '1500', 'Accord', '4Runner', 'Highlander', 'i3', 'Sonata'];
  return randomArray[Math.floor(Math.random() * randomArray.length)]
}
function yearGenerator() {
  return Math.floor(Math.random() * (2018 - 2009) + 2009);
}
function priceGenerator() {
  return Math.floor(Math.random() * (55000 - 10000) + 10000);
}

module.exports = {makeGenerator, modelGenerator, yearGenerator, priceGenerator}
