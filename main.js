"use strict";
const utils = require('@iobroker/adapter-core');
let https = require('https');
let querystring = require('querystring');
let adapter, sesId, userAgentId, header, data = '', flag_subscribe = false, reload_data, reAuth_TimeOut, timePool = 10000;
let control_action = {
    'valet':           {val: false, name: "Режим валет", role: "command", type: "boolean", read: false, write: true},
    'hijack':          {val: false, name: "Режим антиаграбление", role: "command", type: "boolean", read: false, write: true},
    'update_position': {val: false, name: "Обновить местоположение авто", role: "command", type: "boolean", read: false, write: true},
    'shock_bpass':     {val: false, name: "Отключение датчика удара", role: "command", type: "boolean", read: false, write: true},
    'tilt_bpass':      {val: false, name: "Отключение датчика наклона", role: "command", type: "boolean", read: false, write: true},
    'webasto':         {val: false, name: "Управление webasto", role: "command", type: "boolean", read: false, write: true},
    'ign':             {val: false, name: "Автозапуск", role: "command", type: "boolean", read: false, write: true},
    'arm':             {val: false, name: "Установливаемый статус охраны устройства", role: "command", type: "boolean", read: false, write: true},
    'poke':            {val: false, name: "Сигнал", role: "command", type: "boolean", read: false, write: true},
    'add_sens_bpass':  {val: false, name: "Выключение доп. датчика", role: "command", type: "boolean", read: false, write: true},
    'out':             {val: false, name: "Управление доп. каналом", role: "command", type: "boolean", read: false, write: true},
    'checkballance':   {val: false, name: "Запросить балланс", role: "button", type: "boolean", read: false, write: true},
    'checktemp':       {val: false, name: "Запрос температуры", role: "button", type: "boolean", read: false, write: true},
};

let states = {
    'alias':               {val: '', name: 'Имя устройства заданное пользователем при его добавлении или после эксплуатации', role: "state", type: "string", read: true, write: false},
    'skey':                {val: false, name: false, role: "state", type: "string", read: true, write: false},
    'balance':             {val: '', name: 'Баланс SIM-карты', role: "state", type: "number", read: true, write: false},
    'battery':             {val: '', name: 'Напряжение АКБ охранно-телематического комплекса ( вольты ) или заряд батареи маяка ( в процентах )', role: "state", type: "number", read: true, write: false},
    'device_id':           {val: '', name: 'Идентификатор устройства в SLNet', role: "state", type: "number", read: true, write: false},
    'fw_version':          {val: '', name: 'Версия ПО устройства', role: "state", type: "string", read: true, write: false},
    'imei':                {val: '', name: 'IMEI GSM-модуля устройства', role: "state", type: "string", read: true, write: false},
    'mayak_temp':          {val: '', name: 'Температура маяка', role: "state", type: "number", read: true, write: false},
    'mon_type':            {val: '', name: 'Тип режима мониторинга', role: "state", type: "number", read: true, write: false},
    'type':                {val: '', name: 'Тип устройства', role: "state", type: "number", read: true, write: false},
    '_controls':           {val: false, name: false, role: "state", type: "string", read: true, write: false},
    'reg':                 {val: '', name: 'Уникальный идентификатор устройства', role: "state", type: "string", read: true, write: false},
    'rpl_channel':         {val: '', name: 'Идентификатор канала Realplexor', role: "state", type: "string", read: true, write: false},
    'sn':                  {val: '', name: 'Серийный номер устройства', role: "state", type: "string", read: true, write: false},
    'ts_activity':         {val: '', name: 'Время последней активности устройства, число секунд прошедших с 01.01.1970 по UTC', role: "state", type: "number", read: true, write: false},
    'shortParking':        {val: '', name: 'Длительность короткой стоянки, мин', role: "state", type: "number", read: true, write: false},
    'longParking':         {val: '', name: 'Длительность долгой стоянки, мин', role: "state", type: "number", read: true, write: false},
    'shared_for_me':       {val: false, name: false, role: "state", type: "boolean", read: true, write: false},
    'showInsuranceEvents': {val: false, name: false, role: "state", type: "boolean", read: true, write: false},
    'ctemp':               {val: '', name: 'Температура салона', role: "state", type: "number", read: true, write: false},
    'etemp':               {val: '', name: 'Температура двигателя', role: "state", type: "number", read: true, write: false},
    'gps_lvl':             {val: '', name: 'Уровень приёма GPS сигнала, соответвует числу спутников GPS', role: "state", type: "number", read: true, write: false},
    'gsm_lvl':             {val: '', name: 'Уровень приёма GSM сигнала, соответвует числу спутников GSM', role: "state", type: "number", read: true, write: false},
    'phone':               {val: '', name: 'Телефонный номер SIM-карты устройства', role: "state", type: "string", read: true, write: false},
    'status':              {val: '', name: 'Статус соединения с сервером ( 1 - Online, 2 - Offline )', role: "state", type: "number", read: true, write: false},

    'car_state.add_sens_bpass': {val: false, name: 'Состояние дополнительного датчика', role: "state", type: "boolean", read: true, write: false},
    'car_state.alarm':          {val: false, name: 'Статус тревоги охранно-телематического комплекса', role: "state", type: "boolean", read: true, write: false},
    'car_state.arm':            {val: false, name: 'Состояние режима охраны', role: "state", type: "boolean", read: true, write: false},
    'car_state.door':           {val: false, name: 'Состояние дверей', role: "state", type: "boolean", read: true, write: false},
    'car_state.hbrake':         {val: false, name: 'Состояние ручного тормоза', role: "state", type: "boolean", read: true, write: false},
    'car_state.hijack':         {val: false, name: 'Состояние режима "Антиограбление"', role: "state", type: "boolean", read: true, write: false},
    'car_state.hood':           {val: false, name: 'Состояние капота', role: "state", type: "boolean", read: true, write: false},
    'car_state.ign':            {val: false, name: 'Состояние двигателя', role: "state", type: "boolean", read: true, write: false},
    'car_state.out':            {val: false, name: 'Состояние доп. канала', role: "state", type: "boolean", read: true, write: false},
    'car_state.pbrake':         {val: false, name: 'Состояние педали тормоза', role: "state", type: "boolean", read: true, write: false},
    'car_state.r_start':        {val: false, name: 'Статус дистанционного запуска', role: "state", type: "boolean", read: true, write: false},
    'car_state.run':            {val: false, name: 'Состояние зажигания', role: "state", type: "boolean", read: true, write: false},
    'car_state.shock_bpass':    {val: false, name: 'Состояние датчика удара', role: "state", type: "boolean", read: true, write: false},
    'car_state.tilt_bpass':     {val: false, name: 'Состояние датчика наклона', role: "state", type: "boolean", read: true, write: false},
    'car_state.trunk':          {val: false, name: 'Состояние багажника', role: "state", type: "boolean", read: true, write: false},
    'car_state.valet':          {val: false, name: 'Статус сервисного режима', role: "state", type: "boolean", read: true, write: false},
    'car_state.webasto':        {val: false, name: 'Состояние предпускового подогревателя', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.add_h':      {val: false, name: 'Состояние тревожного уровня дополнительного датчика', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.add_l':      {val: false, name: 'Состояние предупредительного уровня дополнительного датчика', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.door':       {val: false, name: 'Состояние зоны дверей', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.hbrake':     {val: false, name: 'Состояние ручного тормоза', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.hijack':     {val: false, name: 'Состояние режима "Антиограбление"', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.hood':       {val: false, name: 'Состояние зоны капота', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.ign':        {val: false, name: 'Состояние зажигания', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.pbrake':     {val: false, name: 'Состояние педали тормоза', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.shock_h':    {val: false, name: 'Состояние тревожного уровня датчика удара', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.shock_l':    {val: false, name: 'Состояние предупредительного уровня датчика удара', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.tilt':       {val: false, name: 'Состояние датчика наклона', role: "state", type: "boolean", read: true, write: false},
    'car_alr_state.trunk':      {val: false, name: 'Состояние зоны багажника', role: "state", type: "boolean", read: true, write: false},

    'services.control':  {val: false, name: false, role: "state", type: "string", read: true, write: true},
    'services.settings': {val: false, name: false, role: "state", type: "string", read: true, write: true},

    'position.dir':       {val: '', name: 'Данные о направлении движения в градусах ( 0 - Север, 180 - Юг )', role: "state", type: "number", read: true, write: true},
    'position.s':         {val: '', name: 'Скорость устройства, км/ч', role: "state", type: "number", read: true, write: true},
    'position.sat_qty':   {val: '', name: 'Число принимаемых спутников GPS', role: "state", type: "number", read: true, write: true},
    'position.ts':        {val: '', name: 'Метка времени фиксации координат, число секунд прошедших с 01.01.1970 по UTC', role: "state", type: "number", read: true, write: true},
    'position.longitude': {val: '', name: 'Координаты широты', role: "value.gps.longitude", type: "number", read: true, write: true},
    'position.latitude':  {val: '', name: 'Координаты долготы', role: "value.gps.longitude", type: "number", read: true, write: true},
};

function startAdapter(options){
    return adapter = utils.adapter(Object.assign({}, options, {
        systemConfig: true,
        name:         'starline',
        ready:        main,
        unload:       callback => {
            reload_data && clearTimeout(reload_data);
            reAuth_TimeOut && clearTimeout(reAuth_TimeOut);
            try {
                debug('cleaned everything up...');
                callback();
            } catch (e) {
                callback();
            }
        },
        stateChange:  (id, state) => {
            if (id && state && !state.ack){
                //debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                let StateArray = id.split('.');
                let action = '';
                if (StateArray[3] === 'control'){
                    let alias = StateArray[2];
                    let value_command = state.val;
                    action = StateArray[4];
                    adapter.getState(alias + '.device_id', (err, state) => {
                        if (err || !state){
                        } else {
                            let deviceId = parseInt(state.val);
                            adapter.setState(alias + '.control.' + action, {ack: true});
                            if (action === 'ign' && value_command){
                                value_command = 1;
                            }
                            send_command(deviceId, action, value_command);
                        }
                    });
                    adapter.log.info('stateChange ' + id + ' - ' + JSON.stringify(state));
                }
            }
        },
    }));
}

function goto_web(){
    let options = {
        hostname: 'starline-online.ru',
        port:     443,
        path:     '/',
        method:   'GET'
    };
    options.headers = {
        'Host':            'starline-online.ru',
        'User-Agent':      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Connection':      'keep-alive'
    };
    let req = https.request(options, (res) => {
        //res.setEncoding('utf8');
        adapter.log.debug('goto_web - response from the server statusCode: ' + res.statusCode);
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            getSesId(res.headers, 'notoken', () => {
                adapter.log.debug('goto_web-cookie: ' + header);
                adapter.log.debug('auth_web (sesId)' + sesId);
                auth_web();
            });
        });
    });
    req.end();
    req.on('error', (err) => {
        adapter.log.error('Error: goto_web - ' + err);
        reAuth();
    });
}

function auth_web(){
    let post_data = {
        'username':   adapter.config.login,
        'rememberMe': true,
        'password':   adapter.config.password
    };
    let options = {
        hostname: 'starline-online.ru',
        port:     443,
        path:     '/rest/security/login',
        method:   'POST'
    };
    options.headers = {
        'user-Agent':       'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
        'accept':           'application/json, text/javascript, */*; q=0.01',
        'origin':           'https://starline-online.ru',
        'accept-Language':  'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6',
        'content-type':     'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'referer':          'https://starline-online.ru/',
        'cookie':           'PHPSESSID=' + sesId + '; lang=ru;',
        'content-Length':   JSON.stringify(post_data).length
    };
    let req = https.request(options, (res) => {
        //res.setEncoding('utf8');
        adapter.log.debug('auth_web - response from the server statusCode: ' + res.statusCode);
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            getSesId(res.headers, null, () => {
                if (userAgentId && sesId){
                    adapter.log.debug('auth_web-cookie: ' + header);
                    adapter.log.debug('get_data (phpsesid) ' + sesId);
                    adapter.log.debug('get_data (token) ' + userAgentId);
                    adapter.setState('info.connection', true, true);
                    get_data();
                }
            });
        });
    });
    req.on('error', (err) => {
        adapter.log.error('Error: auth_web - ' + err);
        reAuth();
    });
    req.write(JSON.stringify(post_data));
    req.end();
}

function get_data(){
    let getdata = '';
    let eS = new Date().getTime() / 1000;
    eS = eS.toString().replace(".", "");
    let options = {
        hostname: 'starline-online.ru',
        port:     443,
        path:     '/device?tz=360&_=' + eS, //list
        method:   'GET'
    };
    options.headers = {
        'Host':            'starline-online.ru',
        'User-Agent':      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Referer':         'https://starline-online.ru/site/map',
        'Cookie':          'PHPSESSID=' + sesId + '; userAgentId=' + userAgentId + '; lang=ru;',
        'Connection':      'keep-alive'
    };
    let req = https.request(options, (res) => {
        //res.setEncoding('utf8');
        adapter.log.debug('get_data - response from the server statusCode: ' + res.statusCode);

        res.on('data', (chunk) => {
            getdata += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200){
                adapter.log.debug('Received data:' + getdata);
                parse_data(getdata);
            } else {
                adapter.log.error('get_data - response statusCode: ' + res.statusCode);
                reAuth();
            }
        });
    });
    req.end();
    req.on('error', (err) => {
        adapter.log.error('Error: get_data - ' + err);
        reAuth();
    });
}

function parse_data(getdata){
    let result;
    let device = [];
    try {
        adapter.log.debug('Attempting to parse data: ' + getdata.substring(0, 200) + '...');
        result = JSON.parse(getdata);
        if (result.result){
            let numdevice = result.answer.devices.length;
            adapter.log.debug('Processing ' + numdevice + ' devices');
            for (let t = 0; t < numdevice; t++) {
                let deviceData = result.answer.devices[t];
                device[t] = deviceData.alias;
                adapter.log.debug('device- ' + device[t]);
                
                // Basic device information - only set if available
                setObjectfun(device[t] + '.alias', deviceData.alias, device[t]);
                setObjectfun(device[t] + '.device_id', deviceData.device_id);
                setObjectfun(device[t] + '.status', deviceData.status);
                setObjectfun(device[t] + '.shared_for_me', deviceData.shared_for_me);
                
                // Handle position data - check both pos and position objects
                let positionData = deviceData.position || deviceData.pos || {};
                if (positionData.sat_qty !== undefined) {
                    setObjectfun(device[t] + '.position.sat_qty', positionData.sat_qty);
                }
                if (positionData.ts !== undefined) {
                    setObjectfun(device[t] + '.position.ts', positionData.ts);
                }
                if (positionData.x !== undefined) {
                    setObjectfun(device[t] + '.position.longitude', positionData.x);
                }
                if (positionData.y !== undefined) {
                    setObjectfun(device[t] + '.position.latitude', positionData.y);
                }
                
                // Set default values for missing fields to prevent errors
                setObjectfun(device[t] + '.skey', deviceData.skey || '');
                setObjectfun(device[t] + '.balance', (deviceData.balance && deviceData.balance.active && deviceData.balance.active.value) || 0);
                setObjectfun(device[t] + '.battery', deviceData.battery || 0);
                setObjectfun(device[t] + '.fw_version', deviceData.fw_version || '');
                setObjectfun(device[t] + '.imei', deviceData.imei || '');
                setObjectfun(device[t] + '.mayak_temp', deviceData.mayak_temp || 0);
                setObjectfun(device[t] + '.mon_type', deviceData.mon_type || 0);
                setObjectfun(device[t] + '.type', deviceData.type || 0);
                setObjectfun(device[t] + '._controls', deviceData._controls || '');
                setObjectfun(device[t] + '.reg', deviceData.reg || '');
                setObjectfun(device[t] + '.rpl_channel', deviceData.rpl_channel || '');
                setObjectfun(device[t] + '.sn', deviceData.sn || '');
                setObjectfun(device[t] + '.ts_activity', deviceData.ts_activity || 0);
                setObjectfun(device[t] + '.shortParking', deviceData.shortParking || 0);
                setObjectfun(device[t] + '.longParking', deviceData.longParking || 0);
                setObjectfun(device[t] + '.showInsuranceEvents', deviceData.showInsuranceEvents || false);
                setObjectfun(device[t] + '.ctemp', deviceData.ctemp || 0);
                setObjectfun(device[t] + '.etemp', deviceData.etemp || 0);
                setObjectfun(device[t] + '.gps_lvl', deviceData.gps_lvl || 0);
                setObjectfun(device[t] + '.gsm_lvl', deviceData.gsm_lvl || 0);
                setObjectfun(device[t] + '.phone', deviceData.phone || '');
                
                // Car state - set defaults for missing fields
                let carState = deviceData.car_state || {};
                setObjectfun(device[t] + '.car_state.add_sens_bpass', carState.add_sens_bpass || false);
                setObjectfun(device[t] + '.car_state.alarm', carState.alarm || false);
                setObjectfun(device[t] + '.car_state.arm', carState.arm || false);
                setObjectfun(device[t] + '.car_state.door', carState.door || false);
                setObjectfun(device[t] + '.car_state.hbrake', carState.hbrake || false);
                setObjectfun(device[t] + '.car_state.hijack', carState.hijack || false);
                setObjectfun(device[t] + '.car_state.hood', carState.hood || false);
                setObjectfun(device[t] + '.car_state.ign', carState.ign || false);
                setObjectfun(device[t] + '.car_state.out', carState.out || false);
                setObjectfun(device[t] + '.car_state.pbrake', carState.pbrake || false);
                setObjectfun(device[t] + '.car_state.r_start', carState.r_start || false);
                setObjectfun(device[t] + '.car_state.run', carState.run || false);
                setObjectfun(device[t] + '.car_state.shock_bpass', carState.shock_bpass || false);
                setObjectfun(device[t] + '.car_state.tilt_bpass', carState.tilt_bpass || false);
                setObjectfun(device[t] + '.car_state.trunk', carState.trunk || false);
                setObjectfun(device[t] + '.car_state.valet', carState.valet || false);
                setObjectfun(device[t] + '.car_state.webasto', carState.webasto || false);
                
                // Car alarm state - set defaults for missing fields
                let carAlrState = deviceData.car_alr_state || {};
                setObjectfun(device[t] + '.car_alr_state.add_h', carAlrState.add_h || false);
                setObjectfun(device[t] + '.car_alr_state.add_l', carAlrState.add_l || false);
                setObjectfun(device[t] + '.car_alr_state.door', carAlrState.door || false);
                setObjectfun(device[t] + '.car_alr_state.hbrake', carAlrState.hbrake || false);
                setObjectfun(device[t] + '.car_alr_state.hijack', carAlrState.hijack || false);
                setObjectfun(device[t] + '.car_alr_state.hood', carAlrState.hood || false);
                setObjectfun(device[t] + '.car_alr_state.ign', carAlrState.ign || false);
                setObjectfun(device[t] + '.car_alr_state.pbrake', carAlrState.pbrake || false);
                setObjectfun(device[t] + '.car_alr_state.shock_h', carAlrState.shock_h || false);
                setObjectfun(device[t] + '.car_alr_state.shock_l', carAlrState.shock_l || false);
                setObjectfun(device[t] + '.car_alr_state.tilt', carAlrState.tilt || false);
                setObjectfun(device[t] + '.car_alr_state.trunk', carAlrState.trunk || false);
                
                // Services - set defaults for missing fields
                let services = deviceData.services || {};
                setObjectfun(device[t] + '.services.control', services.control || '');
                setObjectfun(device[t] + '.services.settings', services.settings || '');
                
                // Position additional fields - set defaults
                setObjectfun(device[t] + '.position.dir', positionData.dir || 0);
                setObjectfun(device[t] + '.position.s', positionData.s || 0);
            }
            adapter.log.info('Data received restart in ' + timePool / 1000 + ' sec.');
            reload_data = setTimeout(() => {
                get_data();
            }, timePool);
        }
        if (result.result === 0){
            error('Error get Parse Data:' + result.answer.error);
            //adapter.log.error('Error get Parse Data:' + result.answer.error);
            //CONSTRUCTION - Тех работы на сайте.
            reAuth();
        }
    } catch (e) {
        adapter.log.error('Parse error DATA' + JSON.stringify(getdata));
        adapter.log.error('Parse error details: ' + e.message);
        reAuth();
    }
}

function reAuth(){
    adapter.setState('info.connection', false, true);
    adapter.log.error('Re-authorization, and receiving data in 10 minutes.');
    reAuth_TimeOut = setTimeout(() => {
        reload_data && clearTimeout(reload_data);
        goto_web();
    }, 600000);
}

function getSesId(head, notoken, cb){
    header = JSON.stringify(head);
    let pos = header.indexOf('PHPSESSID=');
    let pos_t = header.indexOf('userAgentId=');
    if (pos !== -1){
        sesId = header.substring(pos + 'PHPSESSID='.length);
        pos = sesId.indexOf(';');
        if (pos !== -1){
            sesId = sesId.substring(0, pos);
            cb && cb();
        } else {
            error('failed to get PHPSESSID');
            return;
        }
        adapter.log.debug('PHPSESSID=' + sesId);
    } else {
        error('failed to get PHPSESSID');
        return;
    }
    if (notoken !== 'notoken'){
        if (pos_t !== -1){
            userAgentId = header.substring(pos_t + 'userAgentId='.length);
            pos_t = userAgentId.indexOf(';');
            if (pos_t !== -1){
                userAgentId = userAgentId.substring(0, pos_t);
                cb && cb();
            } else {
                error('failed to get userAgentId');
                return;
            }
            adapter.log.debug('userAgentId=' + userAgentId);
        } else {
            error('failed to get userAgentId');
        }
    }
    //return;
}

function setObjectfun(name, state, device){
    let role = 'indicator';
    adapter.getObject(device + '.alias', (err, state) => {
        if ((err || !state) && device){
            for (let key in control_action) {
                adapter.setObject(device + '.control.' + key, {
                    type:   'state',
                    common: {
                        name:  control_action[key].name,
                        type:  control_action[key].type,
                        role:  control_action[key].role,
                        read:  control_action[key].read,
                        write: control_action[key].write
                    },
                    native: {}
                });
                adapter.setState(device + '.control.' + key, {val: false, ack: true});
            }
        } else {
            if (!flag_subscribe && device){
                adapter.subscribeStates(device + '.control.' + '*');
                flag_subscribe = true;
            }
        }
    });
    let _name = name.split('.');
    let name_obj = '';
    if (_name.length === 2){
        name_obj = _name[_name.length - 1];
    } else {
        name_obj = _name[_name.length - 2] + '.' + _name[_name.length - 1];
    }
    
    // Check if the state definition exists, if not use defaults
    let stateDef = states[name_obj] || {
        name: name,
        type: 'string',
        role: 'state',
        read: true,
        write: false
    };
    
    adapter.setObject(name, {
        type:   'state',
        common: {
            name:  stateDef.name ? stateDef.name : name,
            type:  stateDef.type,
            role:  stateDef.role,
            read:  stateDef.read,
            write: stateDef.write
        },
        native: {}
    });
    adapter.setState(name, {val: state, ack: true});
}

/******************************************************************/
function send_command(device_id, action, value){
    data = '';
    let path = '/device/' + device_id + '/executeCommand';
    let post_data;
    switch (action) {
        case 'checkballance':
            path = '/device/balance';
            post_data = querystring.stringify({
                'device_id': device_id
            });
            adapter.log.debug('Balance check command - Path: ' + path + ', Data: ' + post_data);
            break;
        case 'checktemp':
            path = '/device/batteryTemperature';
            post_data = querystring.stringify({
                'device_id': device_id
            });
            adapter.log.debug('Temperature check command - Path: ' + path + ', Data: ' + post_data);
            break;
        case 'arm':
            // Arm command - just arm/disarm the security system
            let armValue = value === true ? 1 : (value === false ? 0 : value);
            post_data = querystring.stringify({
                'value':    armValue,
                'action':   action
            });
            adapter.log.debug('Arm command - Path: ' + path + ', Data: ' + post_data);
            break;
        default:
            // Convert boolean values to 1/0 for API compatibility
            let apiValue = value === true ? 1 : (value === false ? 0 : value);
            post_data = querystring.stringify({
                'value':    apiValue,
                'action':   action
            });
            adapter.log.debug('Default command - Path: ' + path + ', Action: ' + action + ', Data: ' + post_data);
    }
    let options = {
        hostname: 'starline-online.ru',
        port:     443,
        path:     path,
        method:   'POST'
    };
    options.headers = {
        'Host':             'starline-online.ru',
        'User-Agent':       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0',
        'Accept':           'application/json, text/javascript, */*; q=0.01',
        'Accept-Language':  'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer':          'https://starline-online.ru/site/map',
        'Content-Length':   post_data.length,
        'Cookie':           'PHPSESSID=' + sesId + '; userAgentId=' + userAgentId + '; lang=ru;',
        'Connection':       'keep-alive'
    };
    let req = https.request(options, (res) => {
        //res.setEncoding('utf8');
        adapter.log.debug('send_command - Request URL: https://starline-online.ru' + path);
        adapter.log.debug('send_command - Request method: ' + options.method);
        adapter.log.debug('send_command - Request headers: ' + JSON.stringify(options.headers));
        adapter.log.debug('send_command - Response statusCode: ' + res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            adapter.log.debug('send_command - Response data: ' + JSON.stringify(data));
            
            // Handle 204 No Content and 202 Accepted (success) responses
            if (res.statusCode === 204 || res.statusCode === 202) {
                adapter.log.info('Command executed successfully (' + res.statusCode + ' ' + (res.statusCode === 204 ? 'No Content' : 'Accepted') + '): Device ' + device_id + ' * Command ' + action + ' * Value ' + value);
                setTimeout(() => {
                    clearTimeout(reload_data);
                    get_data();
                }, 10000);
                return;
            }
            
            // Handle other responses with JSON parsing
            let result;
            try {
                result = JSON.parse(data);
                
                // Handle different response formats
                if (result.state === true || result.state === 'true') {
                    adapter.log.info('Command executed successfully: Device ' + device_id + ' * Command ' + action + ' * Value ' + value);
                } else if (result.status === 400) {
                    // Handle API error responses
                    let errorMsg = result.message || 'Unknown error';
                    if (result.message === 'device.command.execFailed') {
                        errorMsg = 'Command execution failed. This might be due to vehicle state or ignition requirements.';
                        if (result.minIgnTimer && result.maxIgnTimer) {
                            errorMsg += ` Ignition timer range: ${result.minIgnTimer}-${result.maxIgnTimer} seconds.`;
                        }
                    }
                    adapter.log.warn('Command failed: ' + errorMsg + ' (Device: ' + device_id + ', Command: ' + action + ', Value: ' + value + ')');
                } else if (result.desc && result.desc.action) {
                    adapter.log.warn('Command error: ' + result.desc.action[0] + ' (Device: ' + device_id + ', Command: ' + action + ', Value: ' + value + ')');
                } else {
                    adapter.log.info('Command response received: ' + JSON.stringify(result) + ' (Device: ' + device_id + ', Command: ' + action + ', Value: ' + value + ')');
                }
            } catch (e) {
                adapter.log.error('Send command. Parsing error: ' + e.message + '. Incoming data: ' + JSON.stringify(data));
            }
            setTimeout(() => {
                clearTimeout(reload_data);
                get_data();
            }, 10000);
        });
    });
    req.on('error', (err) => {
        adapter.log.error('Error: send_command - ' + err);
    });
    req.write(post_data);
    req.end();

}

function error(error){
    adapter.log.error('ERROR ' + error);
    reAuth();
}

/*******************************************************************/
function main(){
    if (adapter.config.login && adapter.config.password){
        timePool = adapter.config.interval;
        goto_web();
        //test();
    } else {
        adapter.log.error('Error! Is not set LOGIN and PASSWORD!');
    }
}


if (module.parent){
    module.exports = startAdapter;
} else {
    startAdapter();
}
