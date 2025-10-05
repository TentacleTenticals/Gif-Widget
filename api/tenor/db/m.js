import {default as Firebase} from '../../firebase/m.js';

export default class {
  Firebase = new Firebase();
  start = {
    check: (o) => {
      this.Firebase.doc.get({
        db: o.secrets.db,
        path: 'gifer/tenor/main',
        name: 'groups',
        // exists: false,
        secrets: o.secrets
      }).then(
        res => {},
        err => {
          console.log('[Tenor Init]:ERR', err);
          if(err.error.code === 404) this.start.init();
        }
      )
    },
    init: async (o) => {
      return this.Firebase.doc.addOrUpdate({
        db: o.secrets.db,
        path: 'gifer/tenor/main',
        name: 'groups',
        // exists: false,
        secrets: o.secrets
      });
    }
  };
  history = {
    get: {
      item: (o) => {
        return this.Firebase.doc.get({
          db: o.secrets.db,
          path: 'gifer/tenor/history',
          name: o.name,
          secrets: o.secrets
        });
      },
      all: (o) => {
        return this.Firebase.doc.get({
          db: o.secrets.db,
          path: 'gifer/tenor/history',
          secrets: o.secrets
        });
      }
    },
    add: {
      item: (o) => {
        return this.Firebase.doc.addOrUpdate({
          db: o.secrets.db,
          path: 'gifer/tenor/history',
          name: o.doc.id,
          // exists: false,
          doc: {
            name: {
              stringValue: o.doc.name
            },
            id: {
              stringValue: o.doc.id
            }
          },
          secrets: o.secrets
        });
      }
    },
    remove: {
      item: (o) => {
        return this.Firebase.doc.remove({
          db: o.secrets.db,
          path: 'gifer/tenor/history',
          name: o.name,
          // exists: false,
          secrets: o.secrets
        });
      }
    }
  };
  collections = {
    get: {
      filter: {
        where: {
          field: {
            op: {
              array: (o) => {
                return this.Firebase.doc.get({
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  db: o.secrets.db,
                  path: 'gifer/tenor/main/groups',
                  // query: 'structuredQuery',
                  structure: {
                    from: [
                      {
                        collectionId: o.run.collection,
                        allDescendants: false
                      }
                    ],
                    where: {
                      fieldFilter: {
                        field: {
                          fieldPath: o.run.path
                        },
                        op: 'ARRAY_CONTAINS_ANY',
                        value:
                        {
                          arrayValue:{
                            values: [
                              o.run.values
                            ]
                          }
                        }
                      }
                    }
                  },
                  secrets: o.secrets
                });
              },
            }
          }
        }
      },
      item: (o) => {
        
        return this.Firebase.doc.get({
          db: o.secrets.db,
          path: 'gifer/tenor/main/groups',
          name: o.name,
          secrets: o.secrets
        });
      },
      all: (o) => {
        return this.Firebase.doc.get({
          db: o.secrets.db,
          path: 'gifer/tenor/main/groups',
          secrets: o.secrets
        });
      },
      ids: (o) => {
        return this.Firebase.doc.get({
          method: 'POST',
          db: o.secrets.db,
          path: 'gifer/tenor/main/groups',
          param: 'listCollectionIds',
          secrets: o.secrets
        });
      }
    },
    add: {
      item: (o) => {
        return this.Firebase.doc.addOrUpdate({
          db: o.secrets.db,
          path: 'gifer/tenor/main/groups/'+o.group,
          name: o.doc.id,
          // exists: false,
          doc: {
            name: {
              stringValue: o.doc.name
            },
            id: {
              stringValue: o.doc.id
            },
            ...(o.doc.tags) && {
              tags: {
                arrayValue: {values: o.doc.tags}
              }
            }
          },
          secrets: o.secrets
        });
      }
    },
    remove: {
      collection: (o) => {
        return this.Firebase.collections.collection.remove({
          db: o.secrets.db,
          // path: 'gifer/tenor/main/groups/'+o.group,
          // name: o.name,
          // exists: false,
          secrets: o.secrets,
          collections: o.collections
        });
      },
      item: (o) => {
        return this.Firebase.doc.remove({
          db: o.secrets.db,
          path: 'gifer/tenor/main/groups/'+o.group,
          name: o.name,
          // exists: false,
          secrets: o.secrets
        });
      }
    }
  };
}
