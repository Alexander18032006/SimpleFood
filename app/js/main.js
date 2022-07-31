$(function () {
	$('.comment__list').slick({
		dots: true,
		appendDots: $('.comment__dots'),
		appendArrows: $('.comment__arrows'),
		prevArrow: '<button class="comment__arrow-prev comment__arrow active" type="button"><svg class="comment__svg"><use xlink:href="images/sprite.svg#arrow"></use></svg><span class="sr-only">Слайдер влево</span></button>',
		nextArrow: '<button class="comment__arrow-next comment__arrow" type="button"><svg class="comment__svg"><use xlink:href="images/sprite.svg#arrow"></use><span class="sr-only">Слайдер вправо</span></svg></button>',
	});
	if (window.matchMedia("(max-width: 768px)").matches) {
		$('.filter').slick({
			arrows: false,
			slidesToShow: 2,
			slidesToScroll: 3,
		}
		);
	}
	$('.burger').on('click', function () {
		$('.mobile-menu').addClass('active');
		$('body').addClass('active');
	});
	$('.mobile-menu__burger').on('click', function () {
		$('.mobile-menu').removeClass('active');
		$('body').removeClass('active');

	});
	var mixer = mixitup('.popular__content');
});