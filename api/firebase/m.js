import {El} from '../../base/class/m.js';
import {Ut} from '../../func/utils.js';
import {default as Oauth} from '../google/oauth/m.js';

export default class {
  urls = {
    auth: {
      refresh: 'https://securetoken.googleapis.com/v1/token'
    },
    oauth: {
      token: 'https://oauth2.googleapis.com/token'
    },
    firestore: {
      main: 'https://firestore.googleapis.com/v1/'
    }
  };
  url = 'https://firestore.googleapis.com/v1/';
  identitlyUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  urler = (o, target, type, path, name, param) => {
    const check = (val, res) => val ? res : '';
    const url = ['projects', o.secrets.projectID, ...(o.db) && ['databases', o.db], o.target, o.path, o.name].filter(e => e);
    // param && (url[url.length-1] += ':'+param);
    o.param && (url[url.length-1] += ':'+o.param);
    // const url = `${o.secrets.projectID}/databases/(default)${path ? '/'+path : ''}`;
    // if(o.secrets.projectID) url.push(o.secrets.projectID);
    // if(o.db) url.push('databases', o.db);
    // switch(target){
    //   case 'document': url.push('document');
    //   break;
    //   case 'documents': url.push('documents');
    //   break;
    // }
    // if(path) url.push(path);
    // if(name) url.push(name);
    // console.log('UUU', url.at(-1))
    // if(param) url[url.length-1] = (url[url.length-1]+':'+param);
    // switch(o.type){
    //   case 'query': url.push(':runQuery');
    //   break;
    // }

    return url.join('/');
  };
  oauth = {
    code: (o) => {
      const url = new Oauth().urlsGen.firebase.code({
        secrets: o.secrets
      });
      return new Promise((success, error) => {
        El.Dialog({
          path: document.body,
          class: 'flx ver',
          showM: true,
          autoDel: true,
          onclose: () => error('Closed!'),
          func: (m) => {
            El.Div({
              path: m,
              class: 'header',
              text: '-'
            });
            El.Div({
              path: m,
              class: 'list flx ver',
              func: (l) => {
                El.Button({
                  path: l,
                  text: 'Auth',
                  // func: (e) => this.el[api.name].btnLogin = e,
                  onclick: () => {
                    // const Mal = new MalApi();
                    console.log('CLICK', url);
                    // api.secrets.codeChall = Mal.fc.auth.cc(128);
                    // const data = new Proxy({}, El.ProxyHandler(this.upd, api));
                    const win = window.open(url);
                    const receive = (msg) => {
                      console.log('MSG', msg);
          
                      if(!msg.data) error('No data!!!');
                      if(msg.data?.type && msg.data?.type === 'PREVIEW_INSTANTIATE_DIFF') return;
                      console.log('Message from window!', msg.data);
                      success(msg.data);
                      // data.i = msg.data;
                      {
                        win?.postMessage({MSG:`Код получен, данная вкладка будет закрыта через 5 секунд`}, '*');
                        setTimeout(() => {
                          win && win?.postMessage({type:'close'}, '*');
                          window.removeEventListener('message', receive);
                        }, 5000);
                      }
                    };
                    window.addEventListener('message', receive);
                  }
                });
              }
            });
          }
        });
      });
    },
    check: (o, err, func) => {
      switch(err){
        case 401:
        case 403: {
          console.log('Lol');
          this.oauth.refresh({
            secrets: o.secrets
          }).then(
            res => {
              console.log('[Check]', res);
              this.oauth.saveToDB({
                secrets: {
                  ...o.secrets,
                  oauth: {
                    accToken: res.access_token,
                    refToken: o.secrets.oauth.refToken
                  }
                }
              }).then(
                res => {
                  console.log('Yo!!!', res);
                }
              );
              // if(res['access_token']){
              //   o.secrets.accToken = res['access_token'];
              //   if(!o.secrets.db) o.secrets.db = {};
              //   o.secrets.db.access_token = res['access_token'];
              //   o.secrets.db.refresh_token = res['refresh_token'];
              //   func(o);
              // }
            }
          )
        }
      }
    },
    token: (o) => {
      return new Oauth().token({
        code: o.code,
        secrets: o.secrets
      });
    },
    refresh: (o) => new Oauth().refresh({
      secrets: o.secrets
    }),
    saveToDB: (o) => {
      console.log('SAVE', o)
      return this.doc.addOrUpdate({
        db: '(default)',
        path: 'oauth',
        name: 'tokens',
        // exists: false,
        doc: {
          accToken: {
            stringValue: o.secrets.oauth.accToken
          },
          ...(o.secrets.oauth?.refToken) && {
            refToken: {
              stringValue: o.secrets.oauth.refToken
            }
          }
        },
        secrets: o.secrets
      }).then(
        res => {
          console.log('[FB API]:tokens saved', res);
          return res;
        }
      )
    }
  };
  auth = {
    refresh: (o, res) => {
      o.secrets?.url && (o.proxyUrl = o.secrets.url);
      o.method = 'POST';

      o.url = this.urls.auth.refresh;
      o.urlParams = {
        key: o.secrets.apiKey
      };
      o.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      o.data = {
        grant_type: 'refresh_token',
        refresh_token: res.refToken
      };

      return this.fetch(o).then(
        res => {
          console.log('R', res);
          return res;
        }
      );
    },
    type: (cmd, type) => {
      const list = {
        add: {
          userMail: 'signUp',
          anon: 'signUp'
        },
        login: {
          userMail: 'signInWithPassword',
          jwt: 'signInWithCustomToken',
          check: 'verifyCustomToken'
        }
      }
      return this.identitlyUrl+':'+list[cmd][type];
    },
    create: (o) => {
      o.secrets?.url && (o.proxyUrl = o.secrets.url);
      o.method = 'POST';

      o.url = this.auth.type('add', o.type);
      o.urlParams = {
        key: o.secrets.apiKey
      };
      o.headers = {
        'Content-Type': 'application/json'
      };
      o.data = {
        ...(o.secrets.email) && {email: o.secrets.email},
        ...(o.secrets.password) && {password: o.secrets.password},
        returnSecureToken: true
      };

      return this.fetch(o).then(
        res => {
          console.log('R', res);
        }
      );
    },
    login: (o) => {
      //o.secrets?.url && (o.proxyUrl = o.secrets.url);
      o.method = 'POST';

      o.url = this.auth.type('login', o.type);
      o.urlParams = {
        key: o.secrets.apiKey
      };
      o.headers = {
        'Content-Type': 'application/json'
      };
      o.data = {
        ...(o.secrets.email) && {email: o.secrets.email},
        ...(o.secrets.password) && {password: o.secrets.password},
        ...(o.secrets.apiKey) && {key: o.secrets.apiKey},
        ...(o.secrets.token) && {token: o.secrets.token},
        returnSecureToken: true
      };

      return this.fetch(o).then(
        res => {
          console.log('R', res);
          if(res.idToken) return {
            access_token: res.idToken,
            refresh_token: res.refreshToken,
            // info: new Ut().token.jwt.time(res.idToken)
          };
        }
      );
    }
  };
  query = (from, target) => {
    let _where;
    // const _from = (from) => {
    //   from.forEach(e => {
    //     if(e.coll) e = 'collectionId';
    //   })
    // };
    switch(target.type){
      case 'filter': _where = {
        fieldFilter: {
          field: {
            fieldPath: target.path,
            ...(target.op) && {op: target.op},
            value: {
              ...(target.string) && {stringValue: target.string}
            }
          }
        }
      }
    }
    return {
      structuredQuery: {
        ...(from) && {from: from},
        where: _where
        
      }
    };
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
  fetch = (o) => new Ut().fetch.run(o);
  db = {
    get: (o) => {
      o.url = this.url+this.urler(o);
      // console.log('U', url);
      // o.headers = {
      //   url: url
      // };
      return this.fetch(o);
    }
  };
  doc = {
    schemes: {
      def: (o) => ({
        name: {
          stringValue: o.name
        },
        list: {
          arrayValue: {
            values: o.list
          }
        }
      }),
    },
    builder: {
      build: (name, fields) => {
        const res = {};
  
        for(const i in fields){
          console.log('Item', i, fields[i])
          this.doc.builder.blocks(i, fields[i], res);
        }
  
        return {
          name: name,
          fields: res
        };
      },
      blocks: (key, item, path) => {
        const res = {};
        const typ = new Ut().getType(item);
        const type = {
          Null: (value) => ({nullValue:value}),
          Boolean: (value) => ({booleanValue:value}),
          Integer: (value) => ({integerValue:value}),
          Double: (value) => ({doubleValue:value}),
          time: (value) => ({timestampValue:value}),
          String: (value) => ({stringValue:value}),
          Bytes: (value) => ({bytesValue:value}),
          ref: (value) => ({referenceValue:value}),
          geo: (lat, long) => ({geoPointValue: {
            latitude: lat,
            longitude: long
          }}),
          Array: (values) => {
            const arr = [];
            values.forEach(e => arr.push(this.doc.builder.blocks(e)));
            return {
              arrayValue: {
                values: arr
              }
            }
          },
          Object: (values) => {
            const fields = {};
            console.log('MAP', values);
            for(const i in values){
              // console.log('Log', i, values[i]);
              fields[i] = this.doc.builder.blocks(i, values[i], fields[i]);
            }
            return {
              mapValue: {
                fields: fields
              }
            }
          }
        };
        const types = {
          null(value){return {nullValue:value}},
          boolean(value){return {booleanValue:value}},
          integer(value){return {integerValue:value}},
          double(value){return {doubleValue:value}},
          time(value){return {timestampValue:value}},
          string(value){return {stringValue:value}},
          bytes(value){return {bytesValue:value}},
          ref(value){return {referenceValue:value}},
          geo(lat, long){return {geoPointValue: {
            latitude: lat,
            longitude: long
          }}},
          array(values){
            const arr = [];
            values.forEach(e => arr.push(this.doc.builder.blocks(e)));
            return {
              arrayValue: {
                values: arr
              }
            }
          },
          map(values){
            const item = {};
            console.log('MAP', values, this);
            for(const i in values){
              // console.log('Log', i, values[i]);
              item[i] = this[values[i][0]](values[i][1]);
            }
            return {
              mapValue: {
                fields: item
              }
            }
          }
        };

        console.log('!!!', key, item);
        // console.log(item[0]);
        // console.log('AO', item);

        console.log('Yo', types[item[0]](item[1]))
        path[key] = types[item[0]](item[1]);

        // switch(typ){
        //   case 'Object':
        //     const p = {};
        //     console.log('Object', fields);
        //     for(const i in fields){
        //       console.log('It', i);
        //       res[key] = type[typ](fields[i]);
        //     };
        //     console.log('RESULT', res);
        //     // path[key] = types[fields[0]](fields[1])
        //   break;
        // }

        // for(const i of fields){
        //   const type = new Ut().getType(i);
        //   switch(type){
        //     case 'Object':
        //       console.log('IT', i);
        //       for(const item in i){
        //         console.log('Item', item, i[item]);
        //       }
        //       path[key] = i;
        //     break;
        //     case 'Array': path[key] = types[[i][0]]([i][1]);
        //     break;
        //     case 'String': console.log('SS', i);
        //     break;
        //   }
        //   console.log('Ins', i, type);
        // }

        // if(fields[0])

        // res[key] = types[[fields][0]]([fields][1]);
  
        // for(const i of fields){
        //   console.log('Q', i)
        //   res[key] = types[[i][0]]([i][1]);
        // }
  
        return path;
      },
    },
    get: (o) => {
      let q;
      // o.structure && (o.method = 'POST');
      o.secrets?.proxyUrl && (o.proxyUrl = o.secrets.proxyUrl);
      o.target = 'documents';
      if(o.structure) o.param = 'runQuery';
      // o.path = '';
      o.url = this.url+this.urler(o);
      // const url = this.url+this.urler(o, 'documents', '', o.path, o.name);
      // if(o.query) q = {
      //   runQuery: this.urler(o, 'documents', o.query, o.path, o.name),
      //   ...(o.secrets.apiKey) && {key: o.secrets.apiKey}
      // };
      o.headers = {
        ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
        ...(o.secrets?.proxyUrl) && {url: o.url},
        ...o.headers
        // url: !q ? url : url+'?'+ new URLSearchParams(q)
      };
      if(o.structure) o.data = {
        structuredQuery: o.structure
      }
      // o.query && (o.data = {
      //   structuredQuery:
      //     {
      //       from: [
      //         {
      //           collectionId: "Loli laugh"
      //         }
      //       ],
      //       where: {
      //         fieldFilter: {
      //           field: {
      //             fieldPath: 'tags'
      //           },
      //           op: "ARRAY_CONTAINS_ANY",
      //           "value":
      //           {
      //             arrayValue:{
      //               values: [
      //                 {
      //                   stringValue: "loli"
      //                 }
      //               ]
      //             }
      //           }
      //         }
      //       }
      //     }
      //   });
      // o.urlParams = q;
      console.log('GET', o)

      return this.fetch(o).then(
        res => {
          console.log('RES', res);
          if(!res) return;
          // const ut = new ut();
          const type = new Ut().getType(res);
          if(type === 'Object'){
            const len = new Ut().object.length(type);
            if(!len) return [];
          }

          switch(true){
            case !!res.collectionIds: return res.collectionIds;
            case !!res.documents: return res.documents;
            case !!res.length: return res;
            default: return [];
          }
          // if(!res) return;
          if(res.collectionsIds) return res.collectionsIds;
          if(!res.documents) return [];
          if(res.documents.length) return res.documents;
          else return [];
        },
        err => {throw err?.options?.response}//?.options?.response
      );
    },
    create: (o) => {
      let q;
      o.secrets?.proxyUrl && (o.proxyUrl = o.secrets.proxyUrl);
      o.method = 'POST';
      o.url = this.url+this.urler(o, 'documents', '', o.path, o.name);
      q = {
        ...(o.docID) && {documentId: o.docID}
      };
      o.data = {
        ...(o.doc) && {fields: o.doc}
      };
      o.headers = {
        'Content-Type': 'application/json',
        ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
        ...(o.secrets?.proxyUrl) && {url: o.url}
      };
      console.log(o)

      return this.fetch(o);
    },
    addOrUpdate: (o) => {
      let q;
      o.method = 'PATCH';
      o.secrets?.proxyUrl && (o.proxyUrl = o.secrets.proxyUrl);
      o.target = 'documents';
      o.url = this.urls.firestore.main+this.urler(o);
      o.urlParams = q;

      o.data = {
        ...(o.doc) && {fields: o.doc}
      }

      q = {
        ...(o.mask) && {'updateMask.fieldPaths': o.mask},
        ...(o.exists != null) && {'currentDocument.exists': o.exists}
      }
      o.headers = {
        'Content-Type': 'application/json',
        ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
        ...(o.secrets?.proxyUrl) && {url: o.url}
      };

      console.log(o)

      return this.fetch(o);
    },
    remove: (o) => {
      let q;
      o.method = 'DELETE';
      o.secrets?.proxyUrl && (o.proxyUrl = o.secrets.proxyUrl);
      o.target = 'documents';
      o.url = this.urls.firestore.main+this.urler(o);
      o.urlParams = q;

      q = {
        ...(o.mask) && {'updateMask.fieldPaths': o.mask},
        ...(o.exists != null) && {'currentDocument.exists': o.exists}
      }
      o.headers = {
        'Content-Type': 'application/json',
        ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
        ...(o.secrets?.proxyUrl) && {url: o.url}
      };

      return this.fetch(o);
    }
  };
  collections = {
    collection: {
      remove: (o) => {
        `curl --request POST \
        'https://firestore.googleapis.com/v1/projects/database-f4d24/databases/(default):bulkDeleteDocuments?key=[YOUR_API_KEY]' \
        --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --data '{"collectionIds":["ha"]}' \
        --compressed
        `

        o.method = 'POST';
        o.secrets?.proxyUrl && (o.proxyUrl = o.secrets.proxyUrl);
        o.param = 'bulkDeleteDocuments';
        o.url = this.urls.firestore.main+this.urler(o);
        // o.urlParams = q;

        // q = {
        //   ...(o.mask) && {'updateMask.fieldPaths': o.mask},
        //   ...(o.exists != null) && {'currentDocument.exists': o.exists}
        // }
        o.headers = {
          'Content-Type': 'application/json',
          ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
          ...(o.secrets?.proxyUrl) && {url: o.url}
        };
        o.data = {
          collectionIds: o.collections
        };

        return this.fetch(o);
      }
    },
    getAll: (o) => {
      `curl --request POST \
      'https://firestore.googleapis.com/v1/projects/database-f4d24/databases/(default)/documents/gifer/groups:listCollectionIds?key=[YOUR_API_KEY]' \
      --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
      --header 'Accept: application/json' \
      --header 'Content-Type: application/json' \
      --data '{}' \
      --compressed
      `

      let q;
      o.secrets?.url && (o.proxyUrl = o.secrets.url);
      o.method = 'POST';
      o.target = 'documents';
      o.param = 'listCollectionIds';
      o.url = this.url+this.urler(o);
      o.urlParams = {
        key: o.secrets.apiKey
      }
      // q = {
      //   groups: ''
      // }
      o.headers = {
        'Content-Type': 'application/json',
        ...(o.secrets.accToken) && {Authorization: 'Bearer '+o.secrets.accToken},
        // ...(o.secrets.accToken) && {Authorization: 'Bearer ' + o.secrets.accToken},
        // url: url+'?'+ new URLSearchParams(q)
      };
      console.log('Co', o);

      return this.fetch(o).then(
        res => {
          console.log('RES', res);
          if(!res) return;
          return res.collectionIds;
          // if(!res.documents) return;
          // if(res.documents.length) return res.documents;
        },
        err => {
          // console.log('e', err.options.response.error.code)
          if(!err) return;
          if(!err.options) return;
          if(!err.options.response) return;
          if(!err.options.response.error) return;
          // this.oauth.check(o, err.options.response.error.code, this.collections.getAll);
        }
      );
    },
    get: (o) => this.doc.get({
      db: '(default)',
      path: 'gifer/groups',
      name: o.name,
      secrets: o.secrets
    }).then(
      res => {
        if(!res) return;
        return res//.map(e => e.fields);
      }
    )
  };
  search = {
    document: (o) => {
      const data = {
        q: o.search?.text,
        key: o.secrets?.accToken,
        client_key: o.secrets?.appName,
        limit: o.search?.limit
      };
      o.url = this.urler(o, o.db.path, 'query')//+new URLSearchParams(data);

      console.log(o);
  
      return this.fetch(o);
    }
  };
  formats = (url, type) => {
    const lll = 'https://media.tenor.com/Vo3CcpuPFYwAAAAe/teehee-funny.png';
    const formats = {
      gif: ['gif', 'gif', 'AC'],
      img: ['gifpreview', 'png', 'Ae'],
      looped: ['loopedmp4', 'mp4', 'Pw'],
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
    const typer = (url, type) => {
      const gp = (t, path) => {
        console.log('Path', path);
        return path.split('.').reduce((r, k) => k ? r[k] : r, t);
      };
      const regex = /https:\/\/[^/]+\/(?<id>[^/]+)\/(?<name>[^/]+)\..+/gm;
      const data = {};
      url.replace(regex, (_, id, name) => {
        if(id){
          data.id = id.slice(0, -2);
          // data.type = id.slice(id.length-2);
        }
        if(name) data.name = name;
      });
      return [this.mediaUrl, data.id, gp(formats, type)[2], '/', data.name, '.', gp(formats, type)[1]].join('');
    };

    switch(type){
      case 'gif': return typer(url, 'gif');
      break;
      case 'img': return typer(url, 'img');
      break;
      case 'img nano': return typer(url, 'nano.img');
      break;
    }
  };
};
