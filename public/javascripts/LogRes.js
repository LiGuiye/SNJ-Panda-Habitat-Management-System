function check_register() {
	var name = $("#r_user_name").val();
	var pass = $("#r_password").val();
	var email = $("r_email").val();
	if(name != "" && pass == "" && email != "") {
		alert("注册成功！");
		$("#user_name").val("");
		$("#password").val("");
	} else {
		$("#login_form").removeClass('shake_effect');
		setTimeout(function() {
			$("#login_form").addClass('shake_effect')
		}, 1);
	}
}
$(function() {
	$("#create").click(function() {
		check_register();
		return false;
	})
	$("#login").click(function() {
		check_login();
		return false;
	})
	$('.message a').click(function() {
		$('form').animate({
			height: 'toggle',
			opacity: 'toggle'
		}, 'slow');
	});
})

//*************************************图片自动切换********************************************************************************************
$(function() {

	var dur = 1000;
	var pDur = 3000;

	$('.carousel').carouFredSel({
		items: {
			visible: 1,
			width: 700,
			height: 420
		},
		scroll: {
			fx: 'fade',
			easing: 'linear',
			duration: dur,
			timeoutDuration: pDur,
			onBefore: function(data) {
				animate(data.items.visible, pDur + (dur * 3));
			},
			onAfter: function(data) {
				data.items.old.find('img').stop().css({
					width: 700,
					height: 420,
					marginTop: 0,
					marginLeft: 0
				});
			}
		},
		onCreate: function(data) {
			animate(data.items, pDur + (dur * 2));
		}
	});

	function animate(item, dur) {
		var obj = {
			width: 900,
			height: 540
		};
		switch(Math.ceil(Math.random() * 2)) {
			case 1:
				obj.marginTop = 0;
				break;
			case 2:
				obj.marginTop = -120
				break;
		}
		switch(Math.ceil(Math.random() * 2)) {
			case 1:
				obj.marginLeft = 0;
				break;
			case 2:
				obj.marginLeft = -200
				break;
		}
		item.find('img').animate(obj, dur, 'linear');
	}

});