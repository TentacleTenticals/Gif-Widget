export default class {
  getType = (o) => o && o.constructor.toString().split(/[\(\) ]/)[1];
  log = function(text, col, val){
    function color() {
      switch(col){
        case 'green': return 'bada55';
        case 'red': return 'ff4500';
        case 'cyan': return '00ffff';
        case 'dodger': return '1e90ff';
        case 'orchid': return 'da70d6';
      }
    }
    console.log('%c '+text, 'background: #222; color: '+'#'+color(), val||'');
  };
  ProxyHandler = (upd, e) => {
    return {
      set(target, key, value) {
        // if (value !== target[key]) {
          // console.log(`Setting ${key} to ${value}`);
          target[key] = value;
          upd(key, value, e);
          return true;
        // }
        // return true;
      }
    }
  };
  css = {
    check: (name, path) => {
      for(let i = 0, arr = (path||document).querySelectorAll(`style`); i < arr.length; i++){
        if(!arr[i].getAttribute('stylename')) continue;
        if(arr[i].getAttribute('stylename') === name) return true;
      }
    },
    add: (name, css, path, check) => {
      if(check && this.css.check(name)) return;
      const main= document.createElement('style');
      main.textContent = css;
      if(name) main.setAttribute('stylename', name);
      (path||document.body).appendChild(main);
    }
  };
  Obs = ({obs, target, cfg, mode, check, type, search, name, msg, func}) => {
    if(!target) return;
    if(mode === 'start'){
      this.callback = (mutationList, o) => {
        for(const mutation of mutationList){
          if(mutation.type === 'childList'){
            // console.log(mutation.target);
            if(check){
              if(!mutation.target.classList.length > 0) return;
              if(!mutation.target.classList.value.match(search)) return;
            }
            if(type){
              func(mutation.target);
            }else{
              for(let i = 0, arr = mutation.addedNodes; i < arr.length; i++){
                func(arr[i]);
              }
            }
          }
        }
      };
      obs[name] = new MutationObserver(this.callback);
      obs[name].observe(target, cfg);
      console.log(`[OBS ${name}] запущен`);
    }else
    if(mode === 'restart'){
      if(obs[name]){
        obs[name].disconnect();
        obs[name].observe(target, cfg);
        console.log(`[OBS ${name}] перезапущен`);
      }
    }
  };
  object = {
    length: (obj) => Object.keys(obj).length
  };
  MyError = (n, options) => {
    class MyError extends Error {
      constructor(){
        super(n[1]);
        this.name = 'MyError:' + n[0] && ' ' + n[1];
        if(n[2]){
          if(n[2].type === 'log'){
            console.group('ERR ' + n[0]+' ' + ':'+n[1]);
            console.error(this);
            if(options) for(const o in options){
              console.log(o, options[o]);
            }
            console.groupEnd();
          }
        }
        return {error: this, name:this.name, message:this.message, stack:this.stack, options};
      }
    };
    return new MyError();
  };
  fetch = {
    dataConverter: (o) => {
      if(!o.data) return;
      if(o.method === 'get') return;
      if(!o.headers['Content-Type']) return;
      switch(o.headers['Content-Type']){
        case 'application/json': return JSON.stringify(o.data);
        case 'application/text': return JSON.stringify(o.data);
        case 'text/html': return o.data;
        case 'application/x-www-form-urlencoded': return new URLSearchParams(o.data);
        default: return o.data;
      }
    },
    run: (o, text) => {
      console.log('OO', o);
      if(o.proxyUrl){
        o.proxyUrl = new URL(o.proxyUrl);
        for(const i in o.proxyParams){
          o.proxyUrl.searchParams.set(i, o.proxyParams[i]);
        }
      }
      if(o.url){
        o.url = new URL(o.url);
        for(const i in o.urlParams){
          o.url.searchParams.set(i, o.urlParams[i]);
        }
      }
      return fetch(o.proxyUrl||o.url, {
        method: o.method||'GET',
        headers: {
          ...o.headers,
          ...(o.proxyUrl) && {url: o.url}
        },
        ...(o.data) && {body: this.fetch.dataConverter(o)}
      }).then(
        r => this.fetch.return(r, text)
      )
    },
    return: (r, text) => {
      if(!text) text = '[Fetch]';
      const contentType = r.headers.get('content-type');
      if(contentType && contentType.match('application/json')) return r.json().then(
        res => {
          if(res && res.error) throw this.MyError([text, 'Wrong response', {type:'log'}], {response:res});
          else return res;
        },
        err => {
          throw this.MyError([text, 'Err', {type:'log'}], {err:err});
        }
      )
      else return r.text()
    }
  };
  date = {
    seconds: {
      toMS: (sec) => {
        if(!sec) return;
        return sec * 1000;
      }
    },
    ms: {
      toTimePer: (ms) => {
        if(!ms) return;
        if(ms < 1000) return;
        const units = [
          { label: 'years', mss: 31536000000 },
          { label: 'months', mss: 2592000000 },
          { label: 'weeks', mss: 604800000 },
          { label: 'days', mss: 86400000 },
          { label: 'hours', mss: 3600000 },
          { label: 'minutes', mss: 60000 },
          { label: 'seconds', mss: 1000 }
        ];
      
        let result = {};
      
        for(const {label, mss} of units){
          const value = Math.floor(ms / mss);
          if(value < 0) continue;
          result[label] = value;
          ms -= value * mss;
        }
      
        return result;
      }
    },
    get: (time, format) => {
      if(time === null){
        const d = new Date();
        const ms = Date.parse(d);

        if(!format) return d;
  
        switch(format){
          case 'ms': return Date.now()//Math.floor(ms);
        }
      }
      if(!time) return;
      const ms = Date.parse(time);
      const d = new Date(time);
      const check = (u) => (u > 9) ? u : '0'+u;
      const month = {
        0: ['Январь', 'Янв'],
        1: ['Февраль', 'Фев'],
        2: ['Март', 'Мар'],
        3: ['Апрель', 'Апр'],
        4: ['Май', 'Май'],
        5: ['Июнь', 'Июн'],
        6: ['Июль', 'Июл'],
        7: ['Август', 'Авг'],
        8: ['Сентябрь', 'Сен'],
        9: ['Октябрь', 'Окт'],
        10: ['Ноябрь', 'Ноя'],
        11: ['Декабрь', 'Дек']
      };
      const day = {
        1: ['Понедельник', 'Пн'],
        2: ['Вторник', 'Вт'],
        3: ['Среда', 'Ср'],
        4: ['Четверг', 'Чт'],
        5: ['Пятница', 'Пт'],
        6: ['Суббота', 'Сб'],
        0: ['Воскресенье', 'Вс']
      };
      
      switch(format){
        case 'string': return {time: d.toString()};
        case 'ms': return {time: ms};
        case 'full': return {
          time: `${check(d.getHours())}:${check(d.getMinutes())}:${check(d.getSeconds())}`,
          date: `${check(d.getFullYear())}/${check(d.getMonth()+1)}/${check(d.getDate())}`
        }
        case 'fullWords': return {
          time: `${check(d.getHours())}:${check(d.getMinutes())}:${check(d.getSeconds())}`,
          date: `${check(d.getFullYear())}/${check(d.getMonth()+1)}|${month[d.getMonth()][0]}/${check(d.getDate())}|${day[d.getDay()][0]}`
        }
        case 'fullShortWords': return {
          time: `${check(d.getHours())}:${check(d.getMinutes())}:${check(d.getSeconds())}`,
          date: `${check(d.getFullYear())}/${check(d.getMonth()+1)} ${month[d.getMonth()][1]}/${check(d.getDate())} ${day[d.getDay()][1]}`
        }
        default: return {time: `${check(d.getHours())}:${check(d.getMinutes())}:${check(d.getSeconds())}`,
          date: `${check(d.getFullYear())}/${check(d.getMonth()+1)}/${check(d.getDate())}`
        }
      }
    },
    secToMS: (sec) => {
      if(!sec) return;
      return sec * 1000;
    },
    math: (ms) => {
      const d = {
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hours: Math.floor(ms / (1000 * 60 * 60)),
        minutes: Math.floor(ms / (1000 * 60)),
        seconds: Math.floor(ms / 1000)
      };
      
      switch(true){
        case d.hours <= 24: return [d.hours, 'hours'];
        case d.minutes <= 60: return [d.minutes, 'minutes'];
        case d.seconds <= 60: return [d.seconds, 'seconds'];
        default: return [d.days, 'days'];
      }
    },
    unitToMs: (u, format) => {
      if(!u && !format) return;
      const units = {
        year: 31536000000,
        month: 2592000000,
        week: 604800000,
        day: 86400000,
        hour: 3600000,
        minute: 60000,
        second: 1000
      };

      console.log('q', u * units[format])

      return u * units[format];
    },
    msToTimePer: (ms, format) => {
      if(!ms) return;
      if(ms < 1000) return;
      const units = [
        { label: 'years', mss: 31536000000 },
        { label: 'months', mss: 2592000000 },
        { label: 'weeks', mss: 604800000 },
        { label: 'days', mss: 86400000 },
        { label: 'hours', mss: 3600000 },
        { label: 'minutes', mss: 60000 },
        { label: 'seconds', mss: 1000 }
      ];
    
      let output = {};
    
      for(const { label, mss } of units){
        const value = Math.floor(ms / mss);
        if(value > 0){
          // console.log(value, label);
          output[label] = value;
          ms -= value * mss;
        }
      }
    
      return output;
    },
    msToUnit: (ms, type) => {
      console.log('YY', Math.floor(ms / (1000 * 60 * 60 * 24)))
      const units = {
        days: Math.floor(ms / (1000 * 60 * 60 * 24))
      }
      if(!ms && !type) return;
      return units[type]
    },
    length: (a, b, format) => {
      const res = a - b;
      
      switch(format){
        case '+': return Math.abs(res);
        default: return res;
      }
    }
  };
  token = {
    jwt: {
      info: (token) => {
        if(!token) return;
        if(!token.split('.').length) return;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        console.log('R', window.atob(base64));
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
      },
      time: (o) => {
        const data = this.token.jwt.info(o);
        if(!data && !data.exp) return;
        const time = this.date.get(null, 'ms');
        const tokenMs = this.date.secToMS(data.exp);

        const res = this.date.length(time, tokenMs, '+');
        console.log('T', data, time, tokenMs, res);
        return this.date.msToUnit(res, 'days');
      }
    },
    // jwt: (o) => fetch(o.url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   ...(o.data) && {body: JSON.stringify(o.data)}
    // }).then(r => this.fetch.return(r, '[JWT]')),
    date: (a, b, format) => {
      const res = a - b;
      
      switch(format){
        case '+': return Math.abs(res);
        default: return res;
      }
    },
    days: (ms) => {
      return Math.floor(ms / (1000 * 60 * 60 * 24));
      
      // return days;
    },
    parseJwt(token){
      if(!token) return;
      if(!token.split('.').length) return;
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    },
    keyLength: (ms, daysLimit) => {
      if(!ms) return;
      const _ = {
        ms: {}
      };
      const currTimeMS = this.date.get(null, 'ms');
      if(daysLimit > 1){
        _.ms.daysLimit = this.date.unitToMs(daysLimit, 'day');
      }
      // console.log('MAX', _.ms.daysLimit);
      _.ms.tokenLength = this.token.date(ms, currTimeMS) - _.ms.daysLimit||0;
      // console.log('M', _.ms.tokenLength);

      const result = (isOk, negative) => {
        // negative && (_.tokenLength = -_.tokenLength) || _.tokenLength;
        return {
          ok: isOk,
          needUpd: _.tokenLength <= daysLimit,
          needNew:  _.tokenLength > daysLimit,
          token: {
            timer: _.tokenLength,
            date: this.date.msToTimePer(_.ms.tokenLength)
          }
        };
      }
      
      if(_.ms.tokenLength < 0){
        // _.ms.tokenLength = Math.abs(_.ms.tokenLength);
        _.tokenLength = this.token.days(_.ms.tokenLength);
        const status = result();

        console.log('[Tokens] need upd/new tokens!!!', _.tokenLength);

        if(status.needUpd) console.log('[Tokens] need upd tokens!!!', _.tokenLength);
        if(status.needNew) console.log('[Tokens] need new tokens!!!', _.tokenLength);

        return status;
      }else{
        _.tokenLength = this.token.days(_.ms.tokenLength);
        const status = result(true);
      
        switch(true){
          case _.tokenLength >= 30: console.log('[Tokens] 30 ok', status);
          return status;
          break;
          case _.tokenLength >= 20: console.log('[Tokens] ok', status);
          return status;
          break;
          case _.tokenLength >= 10: console.log('[Tokens] ...update?', status);
          return status;
          break;
          case _.tokenLength >= 5: console.log('[Tokens] update!!!', status);
          return status;
          break;
          case _.tokenLength >= 1: console.log('[Tokens] update!!! 1', status);
          return status;
          break;
        }
      }
      
      console.log('days', _.tokenLength);

      // return status;
    }
  };
  textMatcher = {
    m(arr, title, o, full){
      // console.log('M', arr, title, o)
      // if(!arr && !o.matcher && !title) return;
      const results = [];
      arr.forEach((e, ind) => {
        // result.ind = ind;
        results.push({
          item: {title:e.iTitle, ind:ind},
          result: this[o.textMatch.matcher](e.iTitle, title)
        })
        // this.search(e.iTitle, results, {ind:ind, text:title, textMatch: o.textMatch, matching});
      });
      console.log('RESULTS', results);
      const sort = results.reduce((a, b) => +a.result.percents.diff > +b.result.percents.diff ? a : b);
      console.log('SORT', sort);
      
      return {results:results, sorted:sort};
      // else
      // if(sort.result.percents.match) return sort.item;
      // else if(o.textMatch.returnFalse) return sort.item;
    },
    search(text, text2, name){
      // console.log('SS', text, o);
      // if(!arr && !matcher) return;
      // const result = {};
      const match = this[name](text, text2);
      if(match) return match;
    },
    lev(text, text2){
      // console.log('LEV', arguments);
      function removeSym(text){
        const filter = /([\W]+)/gm;
        const norm = /[\u0300-\u036F]/g;
        const fixer = (text) => text.normalize('NFKD').replace(norm, '').replace(filter, '').toLowerCase();
        
        return fixer(text);
      };
      text = removeSym(text);
      text2 = removeSym(text2);
      function levenshtein(s, t){
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++){
          arr[i] = [i];
          for (let j = 1; j <= s.length; j++){
            arr[i][j] = i === 0 ? j
              : Math.min(
                  arr[i - 1][j] + 1,
                  arr[i][j - 1] + 1,
                  arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                );
          }
        }
        return ((1 - arr[t.length][s.length] / Math.max(s.length, t.length)) * 100).toFixed(2);
      };
    
      const res = levenshtein(text, text2);
      const r = {
        type: 'levenshtein',
        percents: {diff: res}
      };
      // console.log('[TextMatcherLev]', r);
      return r;
    }
  };
};
