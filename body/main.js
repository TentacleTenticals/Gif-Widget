import {El} from '../base/class/m.js';
import {default as Tenor} from '../api/tenor/func.js';
import {default as Fb} from '../api/firebase/func.js';

import {default as ClsTenor} from './api/tenor/m.js';
import {default as ClsDef} from './api/def/m.js';

// const A = Base => (Base ? Base = Base : Base = class {}) && class extends Base {
//   a = {};
//   mal = () => console.log('Mal');
// }

// const B = Base => (Base ? Base = Base : Base = class {}) && class extends Base {
//   b = {};
//   ani = () => console.log('Ani');
// }

// const C = Base => (Base ? Base = Base : Base = class {}) && class extends Base {
//   c = {};
// }

// class Di {
//   di = {};
// };

// const ccc = [
//   ClsTenor,
//   // B,
//   // C
// ];

// const lab = ccc.reduce((f2, f1) => x => class extends f1(f2(x)){});

// console.log('Lab', new (lab())());

export default (o) => class {
  el = {};
  history = [];
  api = {
    def: ClsDef,
    tenor: ClsTenor
  };
  interface = {
    dialogs: {
      collection: {
        item: {
          add: () => {
            ''
          }
        }
      }
    },
    tags: (path) => new Promise((resp, error) => {
      const it = (form) => {
        El.Input({
          path: form,
          class: 'it',
          label: true,
          lClass: 'itm flx',
          name: form.children.length+1,
          func: (i) => {
            El.Div({
              path: i,
              class: 'btn',
              text: 'x',
              onclick: () => {
                if(form.children.length < 2) return;
                i.remove();
              }
            });
          },
          onkeydown: (e) => {
            if(e.key === 'Enter') e.preventDefault();
          }
        })
      };

      El.Form({
        path: path,
        class: 'adder flx',
        name: 'tags',
        func: (form) => {
          if(!form.children.length) it(form);
        },
        onkeydown: (e) => {
          if(e.key !== 'Enter') return;
          it(e.currentTarget);
        }
      });
      resp()
    })
  };
  setPreview = (el, name, id) => {
    switch(o.cfg.preview.type){
      case 'gif':
      case 'gif medium':
      case 'gif tiny':
      case 'gif nano': el.preview.poster = new Tenor().formats(name, id, o.cfg.preview.type);
      break;
      case 'mp4':
      case 'mp4 tiny':
      case 'mp4 nano':
      case 'webm':
      case 'webm tiny':
      case 'webm nano':
      case 'webp':
      case 'webp tiny':
      case 'webp nano': el.preview.src = new Tenor().formats(name, id, o.cfg.preview.type);
      break;
    }
  };
  ctxMenu = (path, items) => {
    return new Promise((response, error) => {
      El.Div({
        path: path,
        class: 'item-menu flx ver',
        tab: '-1',
        func: (menu) => {
          menu.focus();
          El.Div({
            path: menu,
            class: 'header',
            text: 'MENU'
          });
          El.Div({
            path: menu,
            class: 'list flx ver',
            // rtn: true,
            func: (list) => {
              response(list);
            }
          })
        },
        onblur: (e) => {
          // console.log('YO!', document.activeElement);
          e.target.removeAttribute('menu-op');
          e.target.remove();
        }
      })
    })
  };
  address = {
    list: [o.cfg.address ? o.cfg.address : ['home', 'def']],
    get: {
      item: (api, type) => {
        const go = new (this.api[api[1]]({el:this.el, history:this.history, address:this.address, ctxMenu:this.ctxMenu}, o))();
        console.log('GO', go);
        El.Button({
          path: this.el.address,
          classes: ['address-item', !type && 'n-'+api[0], 'flx'],
          attrs: [['api', api[1]]],
          text: type ? api[0] : go._.lang[o.cfg.lang]['address-bar'].items[api[0]][0],
          onclick: (m) => {
            this.el.menu.replaceChildren();
            console.log('PAI', api, go)
            // this.menu[api[0]]();;

            go._.menu[api[0]]()
          }
        });
      },
      all: (type) => {
        this.el.address.replaceChildren();
        this.address.list.forEach((api, len) => {
          this.address.get.item(api, this.address.list.length-1 === len && type);
        })
      }
    }
  };
  lang = {
    en: {
      main: ['Gifer', 'Gifer', 'GF', 'Gifer'],
      ['address-bar']: {
        main: ['Address-bar', 'Add-bar', 'A', 'Address-bar'],
        items: {
          home: ['Home', 'Home', 'H', 'Home']
        }
      }
    }
  };
  gp = (t, path) => {
    console.log(path);
    return path.filter(e => e).map(e => e.split('.')).flat().reduce((r, k) => k ? r[k] : r, t);
  };
  main = () => El.Dialog({
    path: o.path,
    classes: ['Gif-Widget', (o.cfg.theme||'dark')+'-theme', 'flx', 'ver'],
    attr: ['theme', 'dark'],
    showM: true,
    func: async (body) => {
  
      El.Div({
        path: body,
        class: 'header flx',
        func: (h) => {
          El.Div({
            path: h,
            text: this.lang[o.cfg.lang].main[0]
          });
        }
      });
      El.Div({
        path: body,
        class: 'address-bar flx',
        func: (a) => {
          this.el.address = a;
          this.address.get.all();
        }
      });
      El.Div({
        path: body,
        class: 'menu flx ver',
        func: (m) => this.el.menu = m
      });

      // if(!this.address.current) this.address.current = 'home';
      // console.log('Res', new (this.api[this.address?.current?.[1]||'def']({el:this.el, history:this.history, address:this.address}, o))().menu[this.address?.current?.[0]||'home'] )

      new (this.api[this.address?.current?.[1]||'def']({
        el:this.el,
        history:this.history,
        address:this.address,
        ctxMenu:this.ctxMenu
      }, o))()._.menu[this.address?.current?.[0]||'home']();
    }
  });
};
