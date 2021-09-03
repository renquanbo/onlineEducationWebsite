$(document).ready(function () {
	$(".table td").mouseenter(function () {
		$(this).find(".holder").stop(true, true).fadeIn(600);
		$(this).find(">div").addClass('hover');
		return false;
	});
	$('.table td').mouseleave(function () {
		$(this).find(".holder").stop(true, true).fadeOut(400);
		$(this).find(">div").removeClass('hover');
		return false;
	});
	$(".table td .holder").click(function () {
		$(this).stop(true, true).fadeOut(400);
		$(this).parent().parent().removeClass('hover');
		return false;
	});

	var isBrowserOs = {
		Windows: function () {
			return navigator.userAgent.match(/Win/i);
		},
		MacOS: function () {
			return navigator.userAgent.match(/Mac/i);
		},
		UNIX: function () {
			return navigator.userAgent.match(/X11/i);
		},
		Linux: function () {
			return navigator.userAgent.match(/Linux/i);
		},
		iOs: function () {
			return navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
		},
		Android: function () {
			return navigator.userAgent.match(/android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		Chrome: function () {
			return window.chrome;
		},
		Firefox: function () {
			return navigator.userAgent.match(/Firefox/i);
		},
		IE: function () {
			return navigator.userAgent.match(/MSIE/i);
		},
		Opera: function () {
			return (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0);
		},
		SeaMonkey: function () {
			return navigator.userAgent.match(/SeaMonkey/i);
		},
		Camino: function () {
			return navigator.userAgent.match(/Camino/i);
		},
		Safari: function () {
			return (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
		}
	};

	var html_class = '';
	//OS
	if (isBrowserOs.Windows())
		html_class = 'win';
	if (isBrowserOs.UNIX())
		html_class = 'unix';
	if (isBrowserOs.MacOS())
		html_class = 'mac';
	if (isBrowserOs.Linux())
		html_class = 'linux';
	if (isBrowserOs.iOs())
		html_class = 'ios mac';
	if (isBrowserOs.Android())
		html_class = 'android';
	if (isBrowserOs.BlackBerry())
		html_class = 'blackberry';

	//Browser
	if (isBrowserOs.Chrome())
		html_class = html_class + ' chrome';
	if (isBrowserOs.Firefox())
		html_class = html_class + ' firefox';
	if (isBrowserOs.IE())
		html_class = html_class + ' ie';
	if (isBrowserOs.Opera())
		html_class = html_class + ' opera';
	if (isBrowserOs.SeaMonkey())
		html_class = html_class + ' seamonkey';
	if (isBrowserOs.Camino())
		html_class = html_class + ' camino';
	if (isBrowserOs.Safari())
		html_class = html_class + ' safari';

	$("html").addClass(html_class);

	$(function () {
		var itemNum = $(".gallery-box .items .item").length;//要旋转的div的数量
		var itemDeg = 360 / itemNum;//计算平均偏移角度，后面的itemDeg*index是不同索引div的偏移角度
		$(".items>.item").each(function (index, element) {
			$(element).css({
				//给每一个item设置好位置
				//rotateY让每一个item绕着Y轴偏移，itemDeg*index是不同索引div的偏移角度
				//translateZ是控制item在角度偏移后，往他们的正上方移动的距离，数值越大旋转的范围越大
				transform: "rotateY(" + itemDeg * index + "deg) translateZ(280px)"
			});
		});
	});

});

