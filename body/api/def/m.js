import {El} from '../../../base/class/m.js';
import {default as Tenor} from '../tenor/m.js';
import {default as Main} from '../../main.js';

export default (that, o) => class extends Main(o) {
  _ = {
    lang: {
      en: {
        ['address-bar']: {
          items: {
            home: ['Home', 'Home', 'H', 'Home']
          }
        }
      }
    },
    api: {
      tenor: Tenor
    },
    menu: {
      home: () => {
        const name = ['home', 'def'];
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [name];
        that.address.get.all();
        this.El('div', {
          path: that.el.menu,
          class: 'header menu-header flx',
          func: (h) => {
            this.El('div', {
              path: h,
              class: 'item',
              // attrs: [['api', name[1]]],
              text: name[0].toUpperCase()
            });
          }
        });
        this.El('div', {
          path: that.el.menu,
          class: 'menu-items-list',
          func: (h) => {
            o.cfg.api.list.forEach(api => {
              this.El('button', {
                path: h,
                classes: ['api', 'n-'+api],
                text: api.toUpperCase(),
                onclick: () => {
                  that.el.menu.replaceChildren();
                  console.log('AAA', this.api)
                  new (this._.api[api]({el:that.el, history:that.history, address:that.address}, o))()._.menu[name[0]]()
                }
              });
            })
          }
        });
      }
    }
  }
};
