import {El} from '../../../base/class/m.js';
import {default as Tenor} from '../../../api/tenor/func.js';
import {default as Fb} from '../../../api/tenor/db/m.js';
import {default as Main} from '../../main.js';

export default (that, o) => class extends Main(o) {
  writeUrl = (name, id, format) => navigator.clipboard.writeText(new Tenor().formats(name, id, format));
  _ = {
    lang: {
      en: {
        ['address-bar']: {
          items: {
            home: ['Home', 'Home', 'H', 'Home'],
            search: ['Search', 'Srch', 'S', 'Search'],
            history: ['History', 'Hist', 'H', 'History'],
            collections: ['Collections', 'Coll', 'C', 'Collections'],
          }
        },
        search: {
          main: ['Search', 'Srch', 'S', 'Search'],
          bar: ['Search', 'Srch', 'S', 'Search'],
          go: ['Search', 'Srch', 'S', 'Search'],
          prev: ['Prev', 'Prv', 'P', 'Prev'],
          next: ['Next', 'Nxt', 'N', 'Next'],
          menu: {
            addToCol: ['Add to Collection', 'Add to Col', 'Add tocol', 'Add to Collection']
          }
        },
        collections: {
          main: ['Collections', 'Coll', 'C', 'Collections'],
          collection: {
            dialogs: {
              remove: {
                header: ['Collection deleter', 'Col deleter', 'CD', 'Collection Deleter']
              }
            }
          }
        },
        history: {
          main: ['History', 'His', 'H', 'History']
        }
      }
    },
    interface: {
      dialogs: {
        collection: {
          item: {
            add: (item) => {
              console.log('yyys')
              this.El('dialog', {
                path: document.body,
                class: 'dialogus flx ver',
                attr: ['theme', o.cfg.theme],
                showM: true,
                func: (dia) => {
                  this.El('div', {
                    path: dia,
                    class: 'header',
                    text: 'HEAD'
                  });
                  this.El('form', {
                    path: dia,
                    class: 'form-list flx ver',
                    func: async (list) => {
                      const collections = await new Fb().collections.get.ids(o.db);
                      console.log('coco', collections.map(e => [e, e]))
                      this.El('input', {
                        path: list,
                        label: true,
                        classL: 'gap5 flx',
                        textL: 'Group name',
                        name: 'name',
                        placeholder: 'New group name'
                      });
                      this.El('select', {
                        path: list,
                        label: true,
                        classL: 'gap5 flx',
                        textL: 'Group',
                        // class: 'label',
                        name: 'group',
                        options: collections.map(e => ({values:[e, e]}))
                      });
                      await this.interface.tags(list);
                      this.El('input', {
                        path: list,
                        class: 'btn',
                        value: 'Add/Update item',
                        type: 'submit',
                        onclick: async (e) => {
                          const results = {};
                          const result = {};
                          const form = new FormData(list, e.target);
                          for(const key of form.entries()){
                            results[key[0]] = key[1];
                          }

                          for(const i of list.children){
                            console.log('I', i);
                            if(i.localName !== 'form') continue;
                            result[i.name] = {};
                            const form = new FormData(i);
                            for(const key of form.entries()){
                              console.log('yoyo', key)
                              result[i.name][key[0]] = key[1];
                            }
                            // console.log('SS', results);
                            results[i.name] = Object.values(result[i.name]).map(e => ({stringValue: e}));
                          }
                          console.log('Form', results);
                          if(!(results.name||results.group)) return;
    
                          await new Fb().collections.add.item({
                            ...o.db,
                            group: results.group||results.name,
                            name: item.realID,
                            doc: {
                              name: item.realName,
                              id: item.realID,
                              tags: results.tags
                            }
                          });
                          dia.remove();
                        }
                      })
                    }
                  });
                }
              })
            }
          }
        }
      }
    },
    dialogs: {
      add: {
        item: (item) => {
          El.Dialog({
            path: document.body,
            class: 'dialogus flx ver',
            attr: ['theme', o.cfg.theme],
            showM: true,
            func: (dia) => {
              this.El('div', {
                path: dia,
                class: 'header',
                text: 'HEAD'
              });
              this.El('form', {
                path: dia,
                class: 'list flx ver',
                func: (list) => {
                  El.Input({
                    path: list,
                    class: 'label',
                    label: 'Name',
                    lClass: '',
                    name: 'name'
                  });
                  El.Input({
                    path: list,
                    class: 'btn',
                    value: 'Test',
                    type: 'submit',
                    onclick: async (e) => {
                      const results = {};
                      const form = new FormData(list, e.target);
                      for(const key of form.entries()){
                        results[key[0]] = key[1];
                      }
                      // console.log('Form', results);
                      if(!results.name) return;

                      await new Fb().collections.add.item({
                        ...o.db,
                        group: results.name,
                        name: item.realID,
                        doc: {
                          name: item.realName,
                          id: item.realID
                        }
                      });
                      dia.remove();
                    }
                  })
                }
              });
            }
          })
        }
      },
      remove: {
        collection: (item) => {
          El.Dialog({
            path: document.body,
            class: 'dialogus flx ver',
            attr: ['theme', o.cfg.theme],
            showM: true,
            func: (dia) => {
              this.El('div', {
                path: dia,
                class: 'header',
                text: this._.lang[o.cfg.lang].collections.collection.dialogs.remove.header[0]
              });
              this.El('form', {
                path: dia,
                class: 'list flx ver',
                func: (list) => {
                  this.El('div', {
                    path: list,
                    class: 'r',
                    text: item
                  });
                  El.Input({
                    path: list,
                    class: 'btn',
                    value: 'Delete',
                    type: 'submit',
                    onclick: async (e) => {

                      const res = await new Fb().collections.remove.collection({
                        ...o.db,
                        collections: [item]
                      });
                      console.log('[Deleting]:Collection', res);
                      dia.remove();
                    }
                  })
                }
              });
            }
          })
        }
      }
    },
    menu: {
      home: () => {
        console.log('TENOR')
        const name = ['home', 'tenor'];
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [['home', 'def'], name];
        that.address.get.all();
        // this._.address.list = ['home'];
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
          attr: ['scroll', o.cfg.main.scroll.size],
          func: (h) => {
            this.El('button', {
              path: h,
              classes: ['api', 'n-'+name[1]],
              text: this._.lang[o.cfg.lang].search.main[0],
              onclick: () => {
                that.el.menu.replaceChildren();
                this._.menu.search();
              }
            });
            this.El('button', {
              path: h,
              classes: ['api', 'n-'+name[1]],
              text: this._.lang[o.cfg.lang].collections.main[0],
              onclick: () => {
                that.el.menu.replaceChildren();
                this._.menu.collections();
              }
            });
            this.El('button', {
              path: h,
              classes: ['api', 'n-'+name[1]],
              text: this._.lang[o.cfg.lang].history.main[0],
              onclick: () => {
                that.el.menu.replaceChildren();
                this._.menu.history();
              }
            });
          }
        });
      },
      search: async () => {
        console.log('TENOR Search');
        const name = ['search', 'tenor'];
        // this._.collections = (await new Fb()._.collections.getAll(o.db)).filter(e => e !== 'history');
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [['home', 'def'], ['home', 'tenor'], name];
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
          class: 'menu-items-list flx',
          attr: ['scroll', o.cfg.main.scroll.size],
          func: (h) => {
            this.El('div', {
              path: h,
              class: 'main-list flx ver',
              func: (l) => {
                let prev, next, items;
                const his = [];
                const find = () => his[his.findIndex(e => e === items.next)-1];
                El.Input({
                  path: l,
                  label: true, //this._.lang[o.cfg.lang].search.bar[0],
                  lClass: 'search-panel flx',
                  func: (e) => that.el.search = e,
                  onkeydown: async (e) => {
                    if(e.key !== 'Enter') return;
                    if(!e.target.value) return;
                    that.el.items.replaceChildren();
                    items = await new Tenor()._.search.gif({
                      search: {
                        ...o.search,
                        text: e.target.value
                      },
                      secrets: o.secrets
                    });
                    console.log('ITEMS', items);
  
                    // el.items.replaceChildren();
                    if(!items||!items.data) return;
                    next = items.next;
                    his.push(items.next);
                    items.data.forEach(e => {
                      this._.menu.items.search(that.el.items, that.el, e);
                    });
                  },
                  func: (i) => {
                    this.El('div', {
                      path: i,
                      class: 'btns flx',
                      func: (p) => {
                        this.El('button', {
                          path: p,
                          class: 'n-upd btn',
                          text: this._.lang[o.cfg.lang].search.go[0],
                          onclick: async () => {
                            console.log('V', that.el);
                            console.log('Find', i.value)
                            items = await new Tenor()._.search.gif({
                              search: {
                                ...o.search,
                                text: i.children[0].value,
                                // pos: find()
                              },
                              secrets: o.secrets
                            });
                            console.log('ITEMS', items);
          
                            // el.items.replaceChildren();
                            if(!items||!items.data) return;
                            // prev = items.prev;
                            that.el.items.replaceChildren();
                            that.el.preview.src = '';
                            items.data.forEach(e => {
                              this._.menu.items.search(that.el.items, that.el, e);
                            });
                          }
                        })
                        this.El('button', {
                          path: p,
                          class: 'n-upd btn',
                          text: this._.lang[o.cfg.lang].search.next[0],
                          onclick: async () => {
                            console.log('V', that.el);
                            items = await new Tenor()._.search.gif({
                              search: {
                                ...o.search,
                                text: i.children[0].value,
                                pos: next
                              },
                              secrets: o.secrets
                            });
                            console.log('ITEMS', items);
          
                            // el.items.replaceChildren();
                            if(!items||!items.data) return;
                            next = items.next;
                            his.push(items.next);
                            that.el.items.replaceChildren();
                            that.el.preview.src = '';
                            items.data.forEach(e => {
                              this._.menu.items.search(that.el.items, that.el, e);
                            });
                          }
                        });
                      }
                    });
                  }
                });
                this.El('div', {
                  path: l,
                  class: 'preview flx',
                  func: (p) => {
                    El.Video({
                      path: p,
                      class: 'media',
                      preload: 'metadata',
                      autoplay: true,
                      loop: true,
                      // pIp: true,
                      // type: 'video/mp4',
                      func: (e) => that.el.preview = e
                    });
                  }
                });
                this.El('div', {
                  path: l,
                  attrs: [name, ['scroll', o.cfg.main.scroll.size]],
                  classes: ['list', 'items-list'],
                  func: (e) => that.el.items = e
                });
              }
            });
          }
        });
      },
      history: async () => {
        console.log('TENOR History');
        const name = ['history', 'tenor'];
        // this._.collections = (await new Fb()._.collections.getAll(o.db)).filter(e => e !== 'history');
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [['home', 'def'], ['home', 'tenor'], name];
        that.address.get.all();
        const history = await new Fb().history.get.all(o.db);
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
          class: 'menu-items-list flx',
          attr: ['scroll', o.cfg.main.scroll.size],
          func: (h) => {
            this.El('div', {
              path: h,
              class: 'main-list flx ver',
              func: (l) => {
                this.El('div', {
                  path: l,
                  class: 'preview flx',
                  func: (p) => {
                    El.Video({
                      path: p,
                      class: 'media',
                      preload: 'metadata',
                      autoplay: true,
                      loop: true,
                      pIp: true,
                      type: 'video/mp4',
                      func: (e) => {
                        that.el.preview = e;
                      }
                    });
                  }
                });
                this.El('div', {
                  path: l,
                  class: 'list items-list',
                  attrs: [name, ['scroll', o.cfg.main.scroll.size]],
                  func: (e) => {
                    that.el.items = e;
                    if(history) history.forEach(item => {
                        console.log('H', item);
                        this._.menu.items.history(e, that.el, item.fields);
                      });
                    }
                });
              }
            });
          }
        });
      },
      collections: async () => {
        console.log('TENOR Collections');
        const name = ['collections', 'tenor'];
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [['home', 'def'], ['home', 'tenor'], name];
        that.address.get.all();
        const collections = await new Fb().collections.get.ids(o.db);
        console.log('COLLECTIONS', collections);
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
          attrs: [name, ['scroll', o.cfg.main.scroll.size]],
          func: (h) => {
            collections.forEach(item => {
              this._.menu.items.collections(h, item);
            });
          }
        });
      },
      collection: async (colName) => {
        console.log('TENOR Collection');
        const name = [colName, 'tenor'];
        if(that.address.current === name) return;
        that.address.current = name;
        that.address.list = [['home', 'def'], ['home', 'tenor'], ['collections', 'tenor'], name];
        that.address.get.all(true);
        const collection = await new Fb().collections.get.item({
          ...o.db,
          name: colName
        });
        console.log('collection', collection);

        El.Input({
          path: that.el.menu,
          label: true, //this._.lang[o.cfg.lang].search.bar[0],
          lClass: 'search-panel flx',
          func: (e) => that.el.search = e,
          onkeydown: async (e) => {
            if(e.key !== 'Enter') return;
            if(!e.target.value) return;
            that.el.items.replaceChildren();
            const items = await new Fb().collections.get.filter.where.field.op.array({
              ...o.db,
              run: {
                collection: colName,
                path: 'tags',
                values: e.target.value.split('//').map(e => ({stringValue:e}))
              },
              // name: colName
            });
            console.log('ITEMS', items);
            that.el.items.replaceChildren();
            items.map(e => e.document).forEach(it => {
              this._.menu.items.collection(that.el.items, colName, it.fields);
            })

            // el.items.replaceChildren();
            // if(!items||!items.data) return;
            // next = items.next;
            // his.push(items.next);
            // items.data.forEach(e => {
            //   this._.menu.items.search(that.el.items, that.el, e);
            // });
          },
          func: (i) => {
            this.El('div', {
              path: i.parentElement,
              class: 'btns flx',
              func: (p) => {
                this.El('button', {
                  path: p,
                  class: 'n-upd btn',
                  text: this._.lang[o.cfg.lang].search.go[0],
                  onclick: async () => {
                    console.log('V', that.el);
                    console.log('Find', find())
                    items = await new Tenor()._.search.gif({
                      search: {
                        ...o.search,
                        text: i.value,
                        // pos: find()
                      },
                      secrets: o.secrets
                    });
                    console.log('ITEMS', items);
  
                    // el.items.replaceChildren();
                    if(!items||!items.data) return;
                    // prev = items.prev;
                    that.el.items.replaceChildren();
                    that.el.preview.src = '';
                    items.data.forEach(e => {
                      this._.menu.items.search(that.el.items, that.el, e);
                    });
                  }
                });
              }
            });
          }
        });
  
        this.El('div', {
          path: that.el.menu,
          class: 'preview flx',
          func: (p) => {
            El.Video({
              path: p,
              class: 'media',
              preload: 'metadata',
              autoplay: true,
              loop: true,
              pIp: true,
              // type: 'video/mp4',
              func: (e) => {
                that.el.preview = e
              }
            });
          }
        });
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
          class: 'list items-list',
          attrs: [['collection', 'tenor'], ['scroll', o.cfg.main.scroll.size]],
          func: (e) => {
            that.el.items = e;
            if(collection) collection.forEach(item => {
                console.log('H', item);
                this._.menu.items.collection(e, colName, item.fields);
              });
            }
        });
      },
      items: {
        search: (path, el, item) => {
          this.El('div', {
            path: path,
            class: 'mask flx',
            attr: ['item-id', item.id],
            func: (m) => {
              this.El('div', {
                path: m,
                class: 'panel flx',
                func: (p) => {
                  o.cfg.api.tenor.item.panel.buttons.forEach(btn => {
                    this.El('button', {
                      path: p,
                      text: btn,
                      class: 'btn',
                      onclick: async () => {
                        console.log('Yo!', new Tenor().formats(item.realName, item.realID, btn));
                        window.focus();
                        this.writeUrl(item.realName, item.realID, btn);
                        const history = await new Fb().history.get.all(o.db);
                        if(history.length+1 > o.cfg.history.items.limit) await new Fb().history.remove.item({
                          ...o.db,
                          name: this.getOldest(history).fields.id.stringValue
                        });
                        new Fb().history.add.item({
                          ...o.db,
                          name: item.realID,
                          doc: {
                            name: item.realName,
                            id: item.realID
                          }
                        });
                        // navigator.clipboard.writeText(new Tenor().formats(item.realName, item.realID, btn));
                      }
                    });
                  });
                }
              });
              El.Image({
                path: m,
                class: 'media img',
                url: item.media_formats.gifpreview.url,
                onclick: async () => {
                  // console.log('RRRRRR');
                  const history = await new Fb().history.get.all(o.db);
                  // console.log('His', history, history.length+1 > o.cfg.history.limit);

                  this.writeUrl(item.realName, item.realID, o.cfg.main.return.format);

                  // navigator.clipboard.writeText(new Tenor().formats(item.realName, item.realID, o.cfg.main.return.format));
                  if(history.length+1 > o.cfg.history.items.limit) await new Fb().history.remove.item({
                    ...o.db,
                    name: this.getOldest(history).fields.id.stringValue
                  });
                  new Fb().history.add.item({
                    ...o.db,
                    name: item.realID,
                    doc: {
                      name: item.realName,
                      id: item.realID
                    }
                  });
                }
              });
            },
            onmouseenter: () => {
              // if(el.preview.src === item.media_formats.mp4.url) return;
              // el.preview.src = item.media_formats.mp4.url;
              this.setPreview(that.el, item.realName, item.realID);
            },
            onrclick: async (e) => {
              e.preventDefault();
              if(e.currentTarget.getAttribute('menu-op')) return;
              e.target.setAttribute('menu-op', true);
              // const collection = await new Fb().collections.get.ids(o.db);
              // console.log('CL', collection);
              const test = await this.ctxMenu(e.target.parentNode);

              // this.El('button', {
              //   path: test,
              //   text: 'new +',
              //   class: 'btn',
              //   onclick: () => {
              //     this._.dialogs.add.item(item);
              //   }
              // });
              this.El('button', {
                path: test,
                text: this._.lang[o.cfg.lang].search.menu.addToCol[0],   //collection.dialogs.addToCol[0],
                class: 'btn',
                onclick: () => {
                  // console.log('TH', this.interfaces)
                  this._.interface.dialogs.collection.item.add(item); //dialogs.collection.item.add(item);
                }
              });
              // collection.forEach(c => {
              //   this.El('button', {
              //     path: test,
              //     text: c,
              //     class: 'btn',
              //     onclick: () => {
              //       new Fb().collections.add.item({
              //         ...o.db,
              //         group: c,
              //         name: item.realID,
              //         doc: {
              //           name: item.realName,
              //           id: item.realID
              //         }
              //       });
              //     }
              //   });
              // });
              // console.log('TEST', test);
            }
            // onclick: async () => {
            //   // const check = await new Fb()._.history.get({
            //   //   ...o.db,
            //   //   name: item.realID
            //   // });
            //   // console.log('Check', check);
            //   new Fb()._.history.add({
            //     ...o.db,
            //     name: item.realID,
            //     doc: {
            //       name: item.realName,
            //       id: item.realID
            //     }
            //   });
            // }
          });
        },
        history: (path, el, item) => {
          this.El('div', {
            path: path,
            class: 'mask flx',
            attr: ['item-id', item.id.stringValue],
            func: (m) => {
              this.El('div', {
                path: m,
                class: 'panel flx',
                func: (p) => {
                  o.cfg.api.tenor.item.panel.buttons.forEach(btn => {
                    this.El('button', {
                      path: p,
                      text: btn,
                      class: 'btn',
                      onclick: () => {
                        // console.log('Yo!', new Tenor().formats(item.name.stringValue, item.id.stringValue, btn));
                        window.focus();
                        navigator.clipboard.writeText(new Tenor().formats(item.name.stringValue, item.id.stringValue, btn));
                      }
                    });
                  });
                }
              });
              El.Image({
                path: m,
                class: 'media img',
                url: new Tenor().formats(item.name.stringValue, item.id.stringValue, 'img')
              });
            },
            onmouseenter: () => {
              // console.log('ENTER', item, that);
              // if(that.el.preview.src.match(item.id.stringValue)) return;
              // that.el.preview.src = new Tenor().formats(item.name.stringValue, item.id.stringValue, 'mp4');
              this.setPreview(that.el, item.name.stringValue, item.id.stringValue);
            },
            // onclick: () => {
            //   new Fb()._.history.add({
            //     ...o.db,
            //     name: item.realID,
            //     id: item.realID
            //   });
            //   // this._.history.push(item);
            //   // console.log('History', this._.history);
            // }
          });
        },
        collections: (path, item) => {
          this.El('button', {
            path: path,
            class: 'api n-tenor',
            text: item,
            onclick: (it) => {
              that.el.menu.replaceChildren();
              this._.menu.collection(item);
            },
            onrclick: (e) => {
              e.preventDefault();
              this._.dialogs.remove.collection(item);
            }
          });
        },
        collection: (path, colName, item) => {
          console.log('CC', item);
          this.El('div', {
            path: path,
            class: 'mask flx',
            attr: ['item-id', item.id.stringValue],
            func: (m) => {
              this.El('div', {
                path: m,
                class: 'panel flx',
                func: (p) => {
                  o.cfg.api.tenor.item.panel.buttons.forEach(btn => {
                    this.El('button', {
                      path: p,
                      text: btn,
                      class: 'btn',
                      onclick: () => {
                        window.focus();
                        navigator.clipboard.writeText(new Tenor().formats(item.name.stringValue, item.id.stringValue, btn));
                      }
                    });
                  });
                }
              });
              El.Image({
                path: m,
                class: 'media img',
                url: new Tenor().formats(item.name.stringValue, item.id.stringValue, 'img')
              });
            },
            onmouseenter: () => {
              this.setPreview(that.el, item.name.stringValue, item.id.stringValue);
            },
            onrclick: async (e) => {
              e.preventDefault();
              if(e.currentTarget.getAttribute('menu-op')) return;
              e.target.setAttribute('menu-op', true);
              const test = await this.ctxMenu(e.target.parentNode);

              this.El('button', {
                path: test,
                text: this._.lang[o.cfg.lang].search.menu.addToCol[0],   //collection.dialogs.addToCol[0],
                class: 'btn',
                onclick: () => {
                  // console.log('TH', this.interfaces)
                  this._.interface.dialogs.collection.item.add({
                    realName: item.name.stringValue, realID:item.id.stringValue,
                  }); //dialogs.collection.item.add(item);
                }
              });
              this.El('button', {
                path: test,
                text: 'del -',
                class: 'btn',
                onclick: async () => {
                  await new Fb().collections.remove.item({
                    ...o.db,
                    group: colName,
                    name: item.id.stringValue
                  });
                  const collection = await new Fb().collections.get.item({
                    ...o.db,
                    name: colName
                  });
                  path.replaceChildren();
                  if(collection) collection.forEach(item => {
                    this._.menu.items.collection(path, colName, item.fields);
                  });
                }
              });
              // collections.forEach(c => {
              //   this.El('button', {
              //     path: test,
              //     text: c,
              //     class: 'btn',
              //     onclick: () => {
              //       new Fb().collections.add.item({
              //         ...o.db,
              //         group: c,
              //         name: item.realID,
              //         doc: {
              //           name: item.realName,
              //           id: item.realID
              //         }
              //       });
              //     }
              //   });
              // });
            }
          });
        }
      }
    }
  }
};
