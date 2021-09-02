/*
    ioBroker.starline Widget-Set
    version: "0.1.0"
    Copyright 10.2015-2016 instalator <vvvalt@mail.ru>
*/
"use strict";
// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "Date_on":          {"en": "Date on",       "de": "mainColor",  "ru": "Данные на"},
        "myColor_tooltip":  {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
        "group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"}
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Date_on":          {"en": "Date on",       "de": "mainColor",  "ru": "Данные на"}
});

// this code can be placed directly in template.html
vis.binds.starline = {
    version: "0.1.0",
    showVersion: function () {
        if (vis.binds.starline.version) {
            console.log('Version starline: ' + vis.binds.starline.version);
            vis.binds.starline.version = null;
        }
    },
	states: {
		oid_alias:					{val: undefined, selector: '.alias_value',			blink: false, objName: 'alias'},
		oid_ctemp:					{val: undefined, selector: '',						blink: false, objName: 'ctemp'},
		oid_etemp:					{val: undefined, selector: '',						blink: false, objName: 'etemp'},
		oid_balance:				{val: undefined, selector: '',						blink: false, objName: 'balance'},
		oid_battery:				{val: undefined, selector: '',						blink: false, objName: 'battery'},
		oid_gsm_lvl:				{val: undefined, selector: '.gsm-status',			blink: false, objName: 'gsm_lvl'},
		oid_gps_lvl: 				{val: undefined, selector: '.gps-status',	    	blink: false, objName: 'gps_lvl'},
		oid_status: 				{val: undefined, selector: '.menu-status',			blink: false, objName: 'status'},
		oid_position_sat_qty: 		{val: undefined, selector: '.gps-status',			blink: false, objName: 'position.sat_qty'},
		
		//
		oid_car_state_arm:			{val: undefined, selector: '.car-arm > .s1, .car-arm > .s2, .car-arm > .s3, .car-arm > .s4, .car-arm > .s5', blink: false, objName: 'car_state.arm'},
		oid_car_state_door:			{val: undefined, selector: '.car-doors',			blink: false, objName: 'car_state.door'},
		oid_car_state_hijack:		{val: undefined, selector: '.hijack-border',		blink: false, objName: 'car_state.hijack'},
		oid_car_state_valet:		{val: undefined, selector: '.valet-border',			blink: false, objName: 'car_state.valet'},
		oid_car_state_hood:			{val: undefined, selector: '.car-hood',				blink: false, objName: 'car_state.hood'},
		oid_car_state_ign:			{val: undefined, selector: '.car-ign > .s1, .car-arm > .s2, .car-arm > .s3', blink: false, objName: 'car_state.ign'},
		oid_car_state_trunk:		{val: undefined, selector: '.car-trunk',			blink: false, objName: 'car_state.trunk'},
		oid_car_state_hbrake: 		{val: undefined, selector: '',						blink: false, objName: 'car_state.hbrake'},
		oid_car_state_pbrake: 		{val: undefined, selector: '',						blink: false, objName: 'car_state.pbrake'},
		oid_car_state_run: 			{val: undefined, selector: '.car-run',				blink: false, objName: 'car_state.run'},
		//
		oid_alr_state_door:			{val: undefined, selector: '.car-doors-red',		blink: false, objName: 'car_alr_state.door'},
		oid_alr_state_add_h:		{val: undefined, selector: '',						blink: false, objName: 'car_alr_state.add_h'},
		oid_alr_state_add_l:		{val: undefined, selector: '',						blink: false, objName: 'car_alr_state.add_l'},
		oid_alr_state_hbrake:		{val: undefined, selector: '',						blink: false, objName: 'car_alr_state.hbrake'},
		oid_alr_state_hood:			{val: undefined, selector: '.car-hood-red',			blink: false, objName: 'car_alr_state.hood'},
		oid_alr_state_ign:			{val: undefined, selector: '.car-key-red',			blink: false, objName: 'car_alr_state.ign'},
		oid_alr_state_pbrake:		{val: undefined, selector: '',						blink: false, objName: 'car_alr_state.pbrake'},
		oid_alr_state_shock_h:		{val: undefined, selector: '.car-hammer2-red',		blink: false, objName: 'car_alr_state.shock_h'},
		oid_alr_state_shock_l:		{val: undefined, selector: '.car-hammer1-red',		blink: false, objName: 'car_alr_state.shock_l'},
		oid_alr_state_tilt:			{val: undefined, selector: '.car-tiltsensor-red',	blink: false, objName: 'car_alr_state.tilt'},
		oid_alr_state_trunk:		{val: undefined, selector: '.car-trunk-red',		blink: false, objName: 'car_alr_state.trunk'},
		oid_alr_state_hijack:		{val: undefined, selector: '',						blink: false, objName: 'car_alr_state.hijack'},
		//
		oid_checkballance: 			{val: undefined, selector: '',						blink: false, objName: 'control.checkballance'},
		oid_checktemp: 				{val: undefined, selector: '',						blink: false, objName: 'control.checktemp'}
	},
	control: {
		oid_alias: 						{val: undefined, selector: '',		blink: false, objName: 'alias'},
		oid_car_state_arm:				{val: undefined, selector: '',		blink: false, objName: 'car_state.arm'},
		oid_car_state_valet:			{val: undefined, selector: '',		blink: false, objName: 'car_state.valet'},
		oid_car_state_run:				{val: undefined, selector: '',		blink: false, objName: 'car_state.run'},
		oid_car_state_ign:				{val: undefined, selector: '',		blink: false, objName: 'car_state.ign'},
		oid_car_state_hijack:			{val: undefined, selector: '',		blink: false, objName: 'car_state.hijack'},
		oid_car_state_webasto:			{val: undefined, selector: '',		blink: false, objName: 'car_state.webasto'},
		oid_car_state_shock_bpass:		{val: undefined, selector: '',		blink: false, objName: 'car_state.shock_bpass'},
		oid_car_state_tilt_bpass:		{val: undefined, selector: '',		blink: false, objName: 'car_state.tilt_bpass'},
		//
		oid_control_hijack:				{val: undefined, selector: '',		blink: false, objName: 'control.hijack'},
		oid_control_arm:				{val: undefined, selector: '',		blink: false, objName: 'control.arm'},
		oid_control_ign:				{val: undefined, selector: '',		blink: false, objName: 'control.ign'},
		oid_control_poke:				{val: undefined, selector: '',		blink: false, objName: 'control.poke'},
		oid_control_webasto:			{val: undefined, selector: '',		blink: false, objName: 'control.webasto'},
		oid_control_shock_bpass:		{val: undefined, selector: '',		blink: false, objName: 'control.shock_bpass'},
		oid_control_tilt_bpass:			{val: undefined, selector: '',		blink: false, objName: 'control.tilt_bpass'},
		oid_control_valet:				{val: undefined, selector: '',		blink: false, objName: 'control.valet'},
		oid_control_update_position:	{val: undefined, selector: '',		blink: false, objName: 'control.update_position'},
		oid_control_out:				{val: undefined, selector: '',		blink: false, objName: 'control.out'}
	},

/********************createWidgetStatus****************************/

	createWidgetStatus: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		// if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.starline.createWidgetStatus(widgetID, view, data, style);
            }, 100);
        }

		function setVisible(selector, isVisible, isBlink) {
			if (isVisible) {
				$(selector).show();
			} else {
				$(selector).hide();
			}
			if (isBlink) {
				$(selector).addClass('blink_me');
			} else {
				$(selector).removeClass('blink_me');
			}
		}
			//***************
			function Visible(selector){
				$(selector).attr('style', 'opacity: 1');
				if (arm) {$(selector).addClass("blink_me");}
			}
			function UnVisible(selector){
				$(selector).attr('style', 'opacity: 0');
				$(selector).removeClass("blink_me");
			}
			//*******************
		function updateStates() {
			var states = JSON.parse(JSON.stringify(vis.binds.starline.states));
			var gsm = 0; 
			var gps = 0;
			var arm = null;

			// read all states
			for (var s in states) {
				if (data[s] && data[s] !== 'nothing_selected') { states[s].val = vis.states[data[s] + '.val']; }
			}

			// convert time
			if (states.oid_alias) {
				var date = new Date(1000 * vis.states[data.oid_alias + '.ts']).toGMTString();
				$div.find('.datedata').html('Данные на ' + date);
			}

			// convert gsm
			if 		(states.oid_gsm_lvl.val >= 1  && states.oid_gsm_lvl.val <= 7)  {gsm = 1;}
			else if (states.oid_gsm_lvl.val >= 7  && states.oid_gsm_lvl.val <  14) {gsm = 2;} 
			else if (states.oid_gsm_lvl.val >= 14 && states.oid_gsm_lvl.val <  21) {gsm = 3;} 
			else if (states.oid_gsm_lvl.val >= 21 && states.oid_gsm_lvl.val <  28) {gsm = 4;} 
			else if (states.oid_gsm_lvl.val >= 28 && states.oid_gsm_lvl.val <= 30) {gsm = 5;}
			// convert gps
			if 		(states.oid_gps_lvl.val >= 1  && states.oid_gps_lvl.val <= 7) {gps = 1;}
			else if (states.oid_gps_lvl.val >= 7  && states.oid_gps_lvl.val < 14) {gps = 2;} 
			else if (states.oid_gps_lvl.val >= 14 && states.oid_gps_lvl.val < 21) {gps = 3;}
			
			if (states.oid_gsm_lvl){$('.gsm-status').attr('data-level', gsm);}
			if (states.oid_gsm_lvl){
				$('.gps-status').attr('data-level', gps);
				$('.gps-status').attr('title', 'Уровень сигнала GPS. ' + states.oid_position_sat_qty.val + ' спутников');
				}

			if (states.oid_status.val == 1){
				$('.menu-status').removeClass('off').addClass('on');
				$('.menu-status').attr('title', 'В сети');
			} else {
				$('.menu-status').removeClass('on').addClass('off');
				$('.menu-status').attr('title', 'Не в сети');
			}
			
			if (states.oid_car_state_valet.val == 1){
				$('.valet-border, .valet-content').show();
			} else {
				$('.valet-border, .valet-content').hide();
			}
			if (states.oid_car_state_hijack.val == 1){
				$('.hijack-border').show();
			} else {
				$('.hijack-border').hide();
			}

				if (states.oid_car_state_arm.val == 1){
					$('.car-arm').addClass("on");
					arm = true;
				} else if (states.oid_car_state_arm.val != 1){
					$('.car-arm').removeClass("on");
					arm = false;
				}
				if (states.oid_alr_state_ign.val == 1 && arm){Visible('.car-key-red');
				} else {UnVisible('.car-key-red');}
				if (states.oid_alr_state_shock_l.val == 1 && arm){Visible('.car-hammer1-red');
				} else {UnVisible('.car-hammer1-red');}
				if (states.oid_alr_state_shock_h.val == 1 && arm){Visible('.car-hammer2-red');
				} else {UnVisible('.car-hammer2-red');}
				if (states.oid_alr_state_tilt.val == 1 && arm){Visible('.car-tiltsensor-red');
				} else {UnVisible('.car-tiltsensor-red');}
				if (states.oid_alr_state_trunk.val == 1 && arm){Visible('.car-trunk-red');
				} else {UnVisible('.car-trunk-red');}
				if (states.oid_alr_state_door.val == 1 && arm){Visible('.car-doors-red');
				} else {UnVisible('.car-doors-red');}
				if (states.oid_alr_state_ign.val == 1 && arm){Visible('.car-doors-red');
				} else {UnVisible('.car-doors-red');}
				if (states.oid_alr_state_hood.val == 1 && arm){Visible('.car-hood-red');
				} else {UnVisible('.car-hood-red');}
				if ((states.oid_alr_state_pbrake.val == 1 || states.oid_alr_state_hbrake.val == 1) && arm){Visible('.car-parking-red');
				} else {UnVisible('.car-parking-red');}
			
			//******************************
			if (states.oid_car_state_trunk.val == 1 && !arm){Visible('.car-trunk');
			} else {UnVisible('.car-trunk');}
			if (states.oid_car_state_door.val == 1 && !arm){Visible('.car-doors');
			} else {UnVisible('.car-doors');}
			if (states.oid_car_state_ign.val == 1 && !arm){Visible('.car-key');
			} else {UnVisible('.car-key');}
			if (states.oid_car_state_run.val == 1){
				Visible('.car-run');
				if (arm){
					$('.car-ign > .light').attr('style', 'opacity: 1');
					$('.car-ign > .light').addClass("blink_me");
				}
				else {
					$('.car-ign > .light').attr('style', 'opacity: 0');
					$('.car-ign > .light').removeClass("blink_me");
				}
			} else {
				UnVisible('.car-run');
				UnVisible('.car-ign > .light');
			}
			if (states.oid_car_state_hood.val == 1 && !arm){Visible('.car-hood');$('.car-hood').addClass("blink_me");
			} else {$('.car-hood').removeClass("blink_me"); /*UnVisible('.car-hood');*/}
			if ((states.oid_car_state_pbrake.val == 1 || states.oid_car_state_hbrake.val == 1) && !arm){Visible('.car-parking');
			} else {UnVisible('.car-parking');}
				
			if (states.oid_balance.val <=60){
				$('.balance_icon').addClass("blink_me");
			} else {$('.balance_icon').removeClass("blink_me");}

		/*	if (neutral == 1){$('.car-neutral').attr('style', 'opacity: 1');}
			if (hfree == 1){$('.car-hfree').attr('style', 'opacity: 1');}
		*/
			/*	for (var s in states) {
					if (states[s].selector) setVisible(states[s].selector, states[s].val, states[s].blink && states[s].val);
				}
			*/
			//setVisible('.car-doors',    oid_car_state_door);
			$('.ctemp_value').html(states.oid_ctemp.val);
			$('.etemp_value').html(states.oid_etemp.val);
			$('.balance_value').html(states.oid_balance.val);
			$('.battery_value').html(states.oid_battery.val);
		}
		// on click button
		if (data.oid_checkballance && data.oid_checkballance !== 'nothing_selected') {
			$("li.balance").click(function () {
				vis.setValue(data.oid_checkballance, 1);
			});
		}
		if (data.oid_checktemp && data.oid_checktemp !== 'nothing_selected') {
			$("li.ctemp, li.etemp").click(function () {
				vis.setValue(data.oid_checktemp, 1);
			});
		}

		//debugger;
        // subscribe on updates of values
		for (var s in vis.binds.starline.states) {
			if (!data[s] || data[s] == 'nothing_selected') continue;
			vis.states.bind(data[s] + '.val', function () {
				updateStates();
			});
		}
		// initial update
		updateStates();
    },
	
/********************createWidgetControl****************************/

	createWidgetControl: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		var control;
		// if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.starline.createWidgetControl(widgetID, view, data, style);
            }, 100);
        }
		
		function updateStatesControl() {
			control = JSON.parse(JSON.stringify(vis.binds.starline.control));

			// read all states
			for (var s in control) {
				if (data[s] && data[s] !== 'nothing_selected') {control[s].val = vis.states[data[s] + '.val'];}
			}
			//set icon button
			if (control.oid_car_state_hijack.val == 1){$('.control-icon-hijack').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat 0px -35px;');
			} else {$('.control-icon-hijack').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat 0px 0px;');}
			if (control.oid_car_state_arm.val == 1){$('.control-icon-arm').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -72px -35px;');
			} else {$('.control-icon-arm').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -72px 0px;');}
			if (control.oid_car_state_run.val == 1){$('.control-icon-ign').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -36px -35px;');
			} else {$('.control-icon-ign').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -36px 0px;');}
			if (control.oid_car_state_webasto.val == 1){$('.control-icon-webasto').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -108px -35px;');
			} else {$('.control-icon-webasto').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -108px 0px;');}
			if (control.oid_car_state_shock_bpass.val == 1){$('.control-icon-shock_bpass').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) -252px -35px no-repeat;');
			} else {$('.control-icon-shock_bpass').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -252px 0px;');}
			if (control.oid_car_state_tilt_bpass.val == 1){$('.control-icon-tilt_bpass').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) -324px -35px no-repeat;');
			} else {$('.control-icon-tilt_bpass').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -324px 0px;');}
			if (control.oid_car_state_valet.val == 1){$('.control-icon-valet').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) -288px -35px no-repeat;');
			} else {$('.control-icon-valet').attr('style', 'background:url(./widgets/starline/img/buttons-icon-set_white.png) no-repeat -288px 0px;');}
		}
			
			// on click button
			$(".control-icon-hijack").click(function () {
				vis.setValue(data.oid_control_hijack, 1);
			});
			
			$(".control-icon-arm").click(function () {
				if (control.oid_car_state_arm.val == 0 || control.oid_car_state_arm.val == 2){
					vis.setValue(data.oid_control_arm, 1);
				} else {vis.setValue(data.oid_control_arm, 0);}
			});
			
			$(".control-icon-ign").click(function () {
				if (control.oid_car_state_run.val == 0 || control.oid_car_state_run.val == 2){
					vis.setValue(data.oid_control_ign, 1);
				} else {vis.setValue(data.oid_control_ign, 0);}
			});
			
			$(".control-icon-poke").click(function () {
				vis.setValue(data.oid_control_poke, 1);
			});
			
			$(".control-icon-webasto").click(function () {
				vis.setValue(data.oid_control_webasto, 1);
				if (control.oid_car_state_webasto.val == 0 || control.oid_car_state_webasto.val == 2){
					vis.setValue(data.oid_control_webasto, 1);
				} else {vis.setValue(data.oid_control_webasto, 0);}
			});
			$(".control-icon-shock_bpass").click(function () {
				if (control.oid_car_state_shock_bpass.val == 0 || control.oid_car_state_shock_bpass.val == 2){
					vis.setValue(data.oid_control_shock_bpass, 1);
				} else {vis.setValue(data.oid_control_shock_bpass, 0);}
			});
			$(".control-icon-tilt_bpass").click(function () {
				if (control.oid_car_state_tilt_bpass.val == 0 || control.oid_car_state_tilt_bpass.val == 2){
					vis.setValue(data.oid_control_tilt_bpass, 1);
				} else {vis.setValue(data.oid_control_tilt_bpass, 0);}
			});
			$(".control-icon-valet").click(function () {
				if (control.oid_control_valet.val == 0 || control.oid_control_valet.val == 2){
					vis.setValue(data.oid_control_valet, 1);
				} else {vis.setValue(data.oid_control_valet, 0);}
			});
			$(".control-icon-update_position").click(function () {
				vis.setValue(data.oid_control_update_position, 1);
			});
			$(".control-icon-out").click(function () {
				vis.setValue(data.oid_control_out, 1);
			});
			
			$(".control-button-toright").click(function () {
				$('.control-items').animate({ "marginLeft": "-=267px" }, "slow" );
				$('.control-button-toleft').removeClass("off");
				$('.control-button-toright').addClass("off");
			});
			$(".control-button-toleft").click(function () {
				$('.control-items').animate({ "marginLeft": "+=267px" }, "slow" );
				$('.control-button-toright').removeClass("off");
				$('.control-button-toleft').addClass("off");
			});
				
		//debugger;
		    // subscribe on updates of values
			for (var s in vis.binds.starline.control) {
				if (!data[s] || data[s] == 'nothing_selected') continue;
					vis.states.bind(data[s] + '.val', function () {
						updateStatesControl();
					});
				}
			// initial update
			updateStatesControl();
    }
	
};

if (vis.editMode) {
 	vis.binds.starline.changeOid = function (widgetID, view, newId, attr, isCss) {
		//console.log('---------: ' + widgetID +' - '+view+' - '+newId+' - '+attr+' - '+isCss);
		newId = newId ? newId.substring(0, newId.length - attr.length + 'oid_'.length) : '';
 		var changed = [];
 		for (var s in vis.binds.starline.states) {
 			if (s === 'oid_alias' || !vis.binds.starline.states[s].objName) continue;
 			if (vis.objects[newId + vis.binds.starline.states[s].objName]) {
 				changed.push(s);
 				vis.views[view].widgets[widgetID].data[s] 	= newId + vis.binds.starline.states[s].objName;
 				vis.widgets[widgetID].data[s] 				= newId + vis.binds.starline.states[s].objName;
 			}
 		}
 		return changed;
 	};
	
	vis.binds.starline.changeOid2 = function (widgetID, view, newId, attr, isCss) {
		//console.log('---------: ' + widgetID +' - '+view+' - '+newId+' - '+attr+' - '+isCss);
		newId = newId ? newId.substring(0, newId.length - attr.length + 'oid_'.length) : '';
 		var changed2 = [];
 		for (var s in vis.binds.starline.control) {
 			if (s === 'oid_alias' || !vis.binds.starline.control[s].objName) continue;
 			if (vis.objects[newId + vis.binds.starline.control[s].objName]) {
 				changed2.push(s);
 				vis.views[view].widgets[widgetID].data[s] 	= newId + vis.binds.starline.control[s].objName;
 				vis.widgets[widgetID].data[s] 				= newId + vis.binds.starline.control[s].objName;
 			}
 		}
 		return changed2;
 	};
 }

vis.binds.starline.showVersion();
