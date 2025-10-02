import {Ut} from '../../func/utils.js';

'https://tenor.googleapis.com/v2/search?q=excited&key=API_KEY&client_key=my_test_app&limit=8'

export default class {
  url = 'https://tenor.googleapis.com/v2/';
  mediaUrl = 'https://media.tenor.com/';
  urler = (type) => {
    switch(type){
      case 'search': return this.url+'search?';
    }
  };
  dataConverter = (o) => {
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
  };
  fetch = (o) => {
    return fetch(o?.url||this.url, {
      method: o.method||'GET',
      headers: {
        ...o.headers
      },
      ...(o.data) && {body: this.dataConverter(o)}
    }).then(
      r => {
        // console.log('[MAL API] R', r);
        if(!r.ok){
          new Ut().MyError(['[MAL API]', 'Err', {type:'log'}], {response:r});
        }else return r.json();
      }).then(
        res => {
          // console.log('QQQQQQ', res)
          if(res && res.error) throw new Ut().MyError(['[MAL API]', 'Wrong response', {type:'log'}], {response:res});
          else return res;
        },
        err => {
          // console.log(err, err.error);
          throw new Ut().MyError(['[MAL API]', 'Err', {type:'log'}], {err:err});
        }
      )
  };
  search = {
    gif: (o) => {
      const data = {
        q: o.search?.text,
        key: o.secrets?.accToken,
        client_key: o.secrets?.appName,
        limit: o.search?.limit,
        pos: o.search?.pos
      };
      o.url = this.urler('search')+new URLSearchParams(data);

      console.log(o)
  
      return this.fetch(o);
    }
  };
  getID = (url) => {
    const regex = /https:\/\/[^/]+\/(?<id>[^/]+)\/(?<name>[^/]+)\..+/gm;
    const data = {};
    url.replace(regex, (_, id, name) => {
      if(id){
        data.id = id.slice(0, -2);
      }
      if(name) data.name = name;
    });
    return data;
  };
  formats = (name, id, type) => {
    const lll = 'https://media.tenor.com/Vo3CcpuPFYwAAAAe/teehee-funny.png';
    const formats = {
      gif: ['gif', 'gif', 'AC'],
      img: ['gifpreview', 'png', 'Ae'],
      loopedmp4: ['loopedmp4', 'mp4', 'Pw'],
      mediumgif: ['mediumgif', 'gif', 'Ad'],
      mp4: ['mp4', 'mp4', 'Po'],
      webm: ['webm', 'webm', 'Ps'],
      webp: ['webp', 'webp', 'Ax'],
      nano: {
        gif: ['nanogif', 'gif', 'AS'],
        img: ['nanogifpreview', 'png', 'AT'],
        mp4: ['nanomp4', 'mp4', 'P2'],
        webm: ['nanowebm', 'webm', 'P4']
      },
      tiny: {
        gif: ['tinygif', 'gif', 'AM'],
        img: ['tinygifpreview', 'png', 'AN'],
        mp4: ['tinymp4', 'mp4', 'P1'],
        webm: ['tinywebm', 'webm', 'P3']
      }
    };
    // const typer = (url, type) => {
    //   const gp = (t, path) => {
    //     console.log('Path', path);
    //     return path.split('.').reduce((r, k) => k ? r[k] : r, t);
    //   };
    //   const regex = /https:\/\/[^/]+\/(?<id>[^/]+)\/(?<name>[^/]+)\..+/gm;
    //   const data = {};
    //   url.replace(regex, (_, id, name) => {
    //     if(id){
    //       data.id = id.slice(0, -2);
    //       // data.type = id.slice(id.length-2);
    //     }
    //     if(name) data.name = name;
    //   });
    //   return [this.mediaUrl, data.id, gp(formats, type)[2], '/', data.name, '.', gp(formats, type)[1]].join('');
    // };

    const typer = (type) => {
      const gp = (t, path) => {
        // console.log('Path', path);
        return path.split('.').reduce((r, k) => k ? r[k] : r, t);
      };
      return [this.mediaUrl, id, gp(formats, type)[2], '/', name, '.', gp(formats, type)[1]].join('');
    }

    switch(type){
      case 'gif': return typer('gif');
      case 'gif medium': return typer('mediumgif');
      case 'gif nano': return typer('nano.gif');
      case 'gif tiny': return typer('tiny.gif');
      break;
      case 'img': return typer('img');
      break;
      case 'img nano': return typer('nano.img');
      break;
      case 'mp4': return typer('mp4');
      case 'mp4 nano': return typer('nano.mp4');
      case 'mp4 tiny': return typer('tiny.mp4');
      case 'webm': return typer('webm');
      case 'webm nano': return typer('nano.webm');
      case 'webm tiny': return typer('tiny.webm');
      case 'webp': return typer('webp');
      case 'webp nano': return typer('nano.webp');
      case 'webp tiny': return typer('tiny.webp');
      break;
    }
  };
};
