const endpointURL = 'http://localhost:8080/cars',
      currentCars = [];

function getData(query) {
	return fetch(query)
		.then(response => {
			return response.json();
		})
}

function renderCars() {
	getData(endpointURL)
  .then(cars => {
    $('.inventory-container').html('');
    cars.forEach(car => {
      let carTemplate = `<div class="car-container">
                            <img src="assets/images/car.jpg" alt="">
                            <p class="make-model">${car.year} ${car.make} ${car.model}</p>
                            <p class="price">$${car.price}</p>
                            <button class="hidden" type="button" name="button">Save Edits</button>
                         </div>`
     $('.inventory-container').append(carTemplate);

    })
  })
};

$(document).ready(function() {
  renderCars()
  $('.inventory-container').on('click', 'div.car-container', function() {
    $(this).children('.hidden').slideToggle();
  })
	$('.submit').on('click', function() {
		let elementId = this.findClosest('.parent-container').attr('data-id');
		let newObject = {};
		fetch(query / id, {
				method: 'PUT',
				body: newObject
			})
			.then(res => {
				if (res.status === 201) {
					getData(endpointURL)
					renderCars();
				}
			})
	})

})
