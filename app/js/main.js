$(function () {
	$('.comment__list').slick({
		dots: true,
		prevArrow: '<button class="slick-prev slick-arrow active" type="button"><svg class="slick-arrow__svg"><use xlink:href="images/sprite.svg#arrow"></use></svg></button>',
		nextArrow: '<button class="slick-next slick-arrow" type="button"><svg class="slick-arrow__svg"><use xlink:href="images/sprite.svg#arrow"></use></svg></button>',
	})
	var mixer = mixitup('.popular__content');
});