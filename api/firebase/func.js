import {default as Db} from './m.js';

export default class extends Db {
  _ = {
    oauth: {
      get: (o) => this.doc.get({
        db: '(default)',
        path: 'oauth',
        name: 'tokens',
        secrets: o.secrets
      }).then(
        res => {
          console.log('Loli', res);
          if(!res) return;
          return {
            accToken: res?.fields?.accToken?.stringValue,
            refToken: res?.fields?.refToken?.stringValue
          };
        }
      )
    },
    history: {
      get: (o) => this.doc.get({
        db: '(default)',
        path: 'gifer/groups/history',
        name: o.name,
        secrets: o.secrets
      }).then(
        res => {
          if(!res) return;
          return res;
        }
      ),
      getAll: (o) => this.doc.get({
        db: '(default)',
        path: 'gifer/groups/history',
        secrets: o.secrets
      }).then(
        res => {
          // console.log('RES', res);
          if(!res) return;
          res.forEach(e => {
            e.id = e.name.split('/').at(-1);
            // console.log('Name:', e.name.split('/').at(-1));
          });
          return res;
        }
      ),
      add: (o) => this.doc.addOrUpdate({
        db: '(default)',
        path: 'gifer/groups/history',
        name: o.name,
        exists: false,
        doc: {
          name: {
            stringValue: o.doc.name
          },
          id: {
            stringValue: o.doc.id
          }
        },
        secrets: o.secrets
      }).then(
        res => {
          console.log('[FB API]:history add', res);
        }
      ),
      delete: (o) => this.doc.delete({
        db: '(default)',
        path: 'gifer/groups/history',
        name: o.name,
        secrets: o.secrets
      }).then(
        res => {
          console.log('[FB API]:history del', res);
        }
      )
    },
    collections: {
      getAll: (o) => this.collections.getAll({
        db: '(default)',
        path: 'gifer',
        name: 'groups',
        secrets: o.secrets
      }).then(
        res => {
          console.log('RES', res);
          if(!res) return;
          // res.forEach(e => {
          //   e.id = e.name.split('/').at(-1);
          //   // console.log('Name:', e.name.split('/').at(-1));
          // });
          return res;
        },
        err => {
          switch(err.error.code){
            case 401: this.oauth.refresh({
              secrets: {
                key: o.secrets.apiKey,
                accToken: o.oauth.accToken,
                refToken: o.oauth.refToken
              }
            }).then(
              res => {
                console.log('Refreshing...', res);
      
                this.oauth.saveToDB({
                  secrets: {
                    key: o.secrets.apiKey,
                    accToken: o.auth.accToken,
                    refToken: o.oauth.refToken
                  }
                }, res).then(
                  res => {
                    console.log('Yo!!!', res);
                  }
                );
              }
            );
          }
        }
      ),
    }
  }
};
