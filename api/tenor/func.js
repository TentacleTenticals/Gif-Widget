import {default as Tenor} from './m.js';

export default class extends Tenor {
  _ = {
    search: {
      gif: (o) => {
        return this.search.gif(o).then(
          res => {
            if(!res) return;
            if(!res.results) return;
            console.log('rrr', res);
            
            if(res.results) res.results.forEach(e => {
              const data = this.getID(e.media_formats.gif.url);
              e.realName = data.name;
              e.realID = data.id;
            });
            if(res.results.length) return {
              next: res.next,
              data: res.results
            };
          }
        )
      }
    }
  };
}
