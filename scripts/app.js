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
				let carTemplate = `<div class="car-container" data-id="${car._id}">
                            <img src="assets/images/car.jpg" alt="">
                            <input class="hidden input-year edits" type="text" name="" value="${car.year}">
                            <input class="hidden input-make edits" type="text" name="" value="${car.make}">
                            <input class="hidden input-model edits" type="text" name="" value="${car.model}">
                            <p class="make-model">${car.year} ${car.make} ${car.model}</p>
                            <p class="price">$${car.price}</p>
                            <input class="hidden input-price edits" type="text" name="" value="${car.price}">
                            <button class="hidden submit edits" type="button" name="button">Save Edits</button>
                            <button class="hidden delete" type="button" name="button">Delete</button></div>`
				$('.inventory-container').append(carTemplate);

			})
		})
};

$(document).ready(function() {
	renderCars()
	$('.inventory-container').on('click', 'div.car-container', function() {
		$(this).children('.hidden').toggleClass('hidden');
    $(this).children('p').toggleClass('hidden');
	})
	$('.inventory-container').on('click', 'button.submit', function(e) {
    $(this).toggleClass('hidden');
		$(this).siblings('.edits').toggleClass('hidden')
		let elementId = $(this).parents('.car-container').attr('data-id');
    console.log(e.target);
    let inputFinder = $(e.target).closest('div');
		let newObject = {
			make: inputFinder.find('.input-make').val(),
			model: inputFinder.find('.input-model').val(),
			price: inputFinder.find('.input-price').val(),
			year: inputFinder.find('.input-year').val()
		};
		fetch(`http://localhost:8080/cars/${elementId}`, {
				method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				body: JSON.stringify(newObject)
			})
			.then(res => {
				if (res.status === 201) {
					getData(endpointURL)
					renderCars();
          console.log('I sent the request');
				} else {
					alert('something went wrong, try again')
				}
			})

	});

})
