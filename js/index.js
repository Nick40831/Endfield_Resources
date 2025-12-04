document.addEventListener("DOMContentLoaded", () => {
	const carousel = document.getElementById("tools-carousel");
	const btnLeft = document.getElementById("carousel-left");
	const btnRight = document.getElementById("carousel-right");

	const scrollAmount = 200; 

	btnLeft.addEventListener("click", () => {
		carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
	});

	btnRight.addEventListener("click", () => {
		carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
	});
});

document.getElementById('simulator-button').addEventListener('click', function() {
	window.location.href = './simulator';  
});