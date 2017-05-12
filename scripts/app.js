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
                            <img src="${car.photo}" alt="">

                            <p class="make-model">${car.year} ${car.make} ${car.model}</p>
                            <div class="price-container"><p class="price">$${car.price}</p>
														<button class="edit-button" type="button" name="button">Edit Listing</button></div>
														<div class="input-container hidden">
														<input onClick="this.select();" class="input-photo edits" type="text" name="" value="${car.photo}">
														<input onClick="this.select();" class="input-year edits" type="text" name="" value="${car.year}">
                            <input onClick="this.select();" class="input-make edits" type="text" name="" value="${car.make}">
                            <input onClick="this.select();" class="input-model edits" type="text" name="" value="${car.model}">
                            <input onClick="this.select();" class="input-price edits" type="text" name="" value="${car.price}">
														<button class="submit edits" type="button" name="button">Save Edits</button>
                            <button class="delete" type="button" name="button">Delete</button></div>
                            </div>`
				$('.inventory-container').append(carTemplate);

			})
		})
};

$(document).ready(function() {
	renderCars()
	$('.inventory-container').on('click', '.edit-button', function() {
		$(this).parents('div').siblings('.input-container').toggleClass('hidden');
		$(this).parents('div').siblings('p').toggleClass('hidden');
		$(this).parents('.price-container').toggleClass('hidden');
	})

	//PUT event listeners
	$('.inventory-container').on('click', 'button.submit', function(e) {
		e.preventDefault();
		$(this).toggleClass('hidden');
		$(e.target).closest('input-container').toggleClass('hidden');
		let elementId = $(this).parents('.car-container').attr('data-id');
		let inputFinder = $(e.target).closest('div');
		let newObject = {
			make: inputFinder.find('.input-make').val(),
			model: inputFinder.find('.input-model').val(),
			price: inputFinder.find('.input-price').val(),
			year: inputFinder.find('.input-year').val(),
			photo: inputFinder.find('.input-photo').val()
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
					renderCars();
					console.log('I sent the request');
				} else {
					alert('something went wrong, try again')
				}
			})

	});
	//delete handler
	$('.inventory-container').on('click', 'button.delete', function() {
		$(this).parents('.input-container').toggleClass('hidden')
		let elementId = $(this).parents('.car-container').attr('data-id');
		fetch(`http://localhost:8080/cars/${elementId}`, {
				method: 'DELETE'
			})
			.then(res => {
				if (res.status === 204) {
					renderCars();
				}
			})
	})
	//modal handler
	$('#create').on('click', function() {
		$('.overlay, .new-listing').toggleClass('hidden');
		$('body').css('overflow', 'hidden');

	})
	//post handler
	$('#submit-create').on('click', function(e) {
		$('.overlay, .new-listing').toggleClass('hidden');
		$('body').css('overflow', 'scroll');

		let inputFinder = $(e.target).closest('div');
		let newObject = {
			make: inputFinder.find('.submit-make').val(),
			model: inputFinder.find('.submit-model').val(),
			price: inputFinder.find('.submit-price').val(),
			year: inputFinder.find('.submit-year').val(),
			photo: inputFinder.find('.submit-photo').val()
		};
		fetch(`http://localhost:8080/cars`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newObject)
			})
			.then(res => {
				renderCars();
			})
	})

})
