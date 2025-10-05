// ==UserScript==
// @name        Gif Widget
// @description Скрипт для поиска гифок
// @namespace   TentacleTenticals
// @match       https://www.example.com/*
// @match       https://dtf.ru/*
// @match       https://discord.com/*
// @grant       none
// @noframes
// @grant       GM.setValue
// @grant       GM.getValue
// @version     1.0.10
// @author      TentacleTenticals
// @homepage    https://github.com/TentacleTenticals/-
// @updateURL   https://raw.githubusercontent.com/TentacleTenticals/Gif-Widget/refs/heads/main/script.user.js
// @downloadURL https://raw.githubusercontent.com/TentacleTenticals/Gif-Widget/refs/heads/main/script.user.js
// @description 01.10.2025, 15:45:52
// ==/UserScript==

(async () => {
  console.log('[Gif Widget]');

  const version = '1.0.10';

  const {path} = await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/path.js`);
  const El = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/base/class/mjs.js`)).default;
  const CssBase = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/base/css/base.js`)).default;
  const CssFonts = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/base/css/fonts.js`)).default;
  const CssMain = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/base/css/main.js`)).default;
  const Google = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/api/google/oauth/m.js`)).default;

  const Body = (await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/body/main.js`)).default;
  // const {def} = await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/body/api.js`);
  // const {path} = await import(`https://cdn.jsdelivr.net/gh/TentacleTenticals/Gif-Widget@${version}/path.js`);

  let secretsList;
  let shadow;

  const config = {
  cfg: {
    main: {
      hotkey: 'F1', /* Горячая клавиша вызова виджета */
      width: '370px', /* Максимальная ширина виджета */
      scroll: {
        size: 'lite', /* Размер скроллбара */
        thumb: {
          color: 'rgb(120 200 120)' /* Цвет ползунка */
        }
      },
      return: {
        format: 'mp4' /* Стандартный формат выдачи ссылки при клике по итему */
      }
    },
    theme: 'dark', /* Цветовая тема (пока одна) */
    lang: 'en', /* Язык виджета (пока один) */
    address: ['home', 'def'], /* По идее должен устанавливать дефолтный адрес. НЕ ПРОВЕРЯЛОСЬ, не советую менять. Пока в разработке */
    preview: {
      height: '200px', /* Ширина превью гифок */
      type: 'gif tiny' /* Тип превью гифок. Советую использовать gif tiny, т.к. в хромиуме видео могут ломаться. В Firefox нормально */
    },
    itemsList: {
      height: '200px' /* Максимальная высота листа итемов */
    },
    search: {
      items: {
        limit: 10, /* Максимальное кол-во итемов при поиске гифок */
        inRow: 5 /* Максимум итемов в строке. Визуальное изменение */
      }
    },
    collection: {
      items: {
        inRow: 5 /* Максимум итемов в строке. Визуальное изменение */
      }
    },
    history: {
      items: {
        inRow: 5 /* Максимум итемов в строке. Визуальное изменение */
      }
    },
    api: {
      list: ['tenor'], /* Лист API. Не трогать */
      tenor: {
        item: {
          panel: {
            buttons: ['mp4', 'gif'] /* Кнопки при наведении на заголовок итемов */
          }
        }
      }
    }
  },
  sites: [ // Список поддерживаемых сайтов
    {
      name:'example', links: [['example\.com/\\d+', 'main']], func: {
      },
      main: 'example\.com'
    },
    {
      name:'dtf', links: [['dtf\.ru/\\d+', 'main']], func: {
      },
      main: 'dtf\.ru'

    }
  ]
};

  class Func {
    El = new El().i;
    site = {
      check: () => {
        const loc = document.location.href;

        for(const site of config.sites){
          // console.log('Sites', site);
          if(!loc.match(site.main)) continue;
          return this.site.get(site);
        }
      },
      get: (site, item) => {
        console.log('Get', site);

        this.quirk(site);
      }
    };
    db = {
      init: async () => {
        const secrets = await GM.getValue('secretsList');
        if(!secrets){
          const list = {
            google: {
              oauth: {
                refToken: ''
              },
              firestore: {
                db: '',
                projectID: '',
                clientID: '',
                clientSecret: '',
                redirectUri: '',
                apiKey: '',
                proxyUrl: ''
              }
            }
          };
          await GM.setValue('secretsList', list);
          console.log('[DB]:Check', 'Варки созданы');
        }

        console.log('[DB]:Check', 'Варки в порядке', secrets);
        if(!secrets.google.oauth.refToken){
          console.log('[DB Init] No refToken!');
          const code = await this.db.code({
            secrets: secrets.google.firestore
          });
          if(code) return await this.db.get(code.code, secrets.google.firestore);
        }
        else
        return secrets;
      },
      code: (secrets) => {
        const url = new Google().code(secrets);

        return new Promise((resp, error) => {

          this.El('dialog', {
          path: document.body,
          class: 'init flx ver',
          showM: true,
          func: (dia) => {
            this.El('div', {
              path: dia,
              class: 'header',
              text: 'Get and save refToken'
            });
            this.El('button', {
              path: dia,
              text: 'Auth',
              onclick: () => {
                console.log('CLICK', url);
                const win = window.open(url);
                const receive = (msg) => {
                  console.log('MSG', msg);

                  if(!msg.data) error('No data!!!');
                  if(msg.data?.type && msg.data?.type === 'PREVIEW_INSTANTIATE_DIFF') return;
                  console.log('Message from window!', msg.data);
                  resp(msg.data);
                  // data.i = msg.data;
                  {
                    win?.postMessage({MSG:`Код получен, данная вкладка будет закрыта через 5 секунд`}, '*');
                    setTimeout(() => {
                      win && win?.postMessage({type:'close'}, '*');
                      window.removeEventListener('message', receive);
                      dia.remove();
                    }, 5000);
                  }
                };
                window.addEventListener('message', receive);
              }
            });
          }
        })

        });
      },
      get: (code, secrets) => {
        return new Google().token({
          code: code,
          secrets: secrets
        }).then(
          async res => {
            console.log('[GET]:refToken', res);
            if(!res) return;
            const secretsList = await GM.getValue('secretsList');
            secretsList.google.oauth.refToken = res.refresh_token;
            await GM.setValue('secretsList', secretsList);
            return secretsList;
          }
        )
      },
      oauth: {
        refresh: async (secrets) => {
          const data = await new Google().refresh({
            secrets: {...secretsList.google.firestore, oauth: secretsList.google.oauth}
          });
          return {
            ...secretsList.google.firestore,
            accToken: data.accToken
          }
        }
      }
    };
    init = () => {
      console.log('[Init]');

      this.El('div', {
        path: document.body,
        func: (e) => {
          shadow = e.attachShadow({ mode: "open" });
          // this.run(shadow);
        }
      });

      new El().css.add({name: 'base', css: CssBase(), path: shadow});
      new El().css.add({name: 'fonts', css: CssFonts()});
      new El().css.add({name: 'Gif Widget', css: CssMain(config.cfg), path: shadow});

      document.onkeydown = (e) => {
        // console.log(e.key, config);
        if(e.key !== config.cfg.main.hotkey) return;
        e.preventDefault();
        console.log('Yo!');
        this.run({});
      }
    };
    quirk = () => {
      console.log('[Quirk]');
      if(!shadow) this.init();

      // document.onkeydown = (e) => {
      //   if(e.key !== config.cfg.main.hotkey) return;
      //   e.preventDefault();
      //   console.log('Yo!');
      //   this.run();
      // }
    };
    run = async (site) => {
      console.log('[Runner]', site);
      if(!secretsList) secretsList = await this.db.init();
      const secrets = await this.db.oauth.refresh(secretsList);
      console.log('SECRETS', secrets);
      // if(!shadow) this.init();

      // new El.Css('base', CssBase());
      // new El.Css('Gif Widget', CssMain(config.cfg));

      // document.onkeydown = (e) => {
      //   if(e.key !== config.cfg.main.hotkey) return;
      //   e.preventDefault();
      //   console.log('Yo!');
      // }

      new (Body({
        path: shadow,
        search: {
          limit: config.cfg.search.items.limit
        },
        db: {
          db: secrets.db,
          secrets: secrets
        },
        secrets: {
          ...secretsList.tenor
        },
        cfg: config.cfg
      }))().main();
    }
  }

  new Func().site.check();
})();
