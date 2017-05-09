const endpointURL = 'http://localhost:8080/cars';

function getData(query) {
  return fetch(query)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
}
function renderCars() {
  getData(endpointURL);
  carsArray.forEach(car => {
    `<p data-id="${car.id}"> Something`
  })

}
$(document).ready(function() {
  getData(endpointURL);
  $(.submit).on('click', function() {
    let elementId = this.findClosest('.parent-container').attr('data-id');
    let newObject = {};
    fetch(query/id, {
      method: 'PUT',
      body: newObject
    })
    .then(res => {
      if(res.status === 201) {
        getData(endpointURL)
        renderCars();
      }
    })
  })

})
