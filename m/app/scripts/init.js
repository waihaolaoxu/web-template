var change = {
	design_width: 640,
	IsPC: function() {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad",
			"iPod"
		];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	},
	pc_type: 0,
	body: document.getElementsByTagName('html')[0],
	action_flag: true,
	action: function(num, $1) {
		change.design_width = num;
		if ($1) {
			change.pc_type = $1;
		}
		if (this.IsPC()) {
			this.view_width = document.documentElement.clientWidth > num ? num : document.documentElement.clientWidth;
			if (this.pc_type || this.pc_type == 1) {
				this.body.classList.add('pc_phone');
			} else {
				this.body.classList.add('pc');
			}

		} else {
			this.view_width = document.documentElement.clientWidth < 320 ? num / 2 : document.documentElement.clientWidth;
		}
		this.body.style.opacity = 1;
		this.body.style.fontSize = this.view_width * 100 / num + 'px';
		if (change.action_flag) {
			change.action_flag = false;
			window.addEventListener('resize', function() {
				change.action(change.design_width);
			}, false);
		}
	}
}
change.action(750);
