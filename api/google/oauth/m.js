import {default as Ut} from '../../../func/utils.js';

export default class {
  urls = {
    oauth: {
      auth: 'https://accounts.google.com/o/oauth2/v2/auth',
      token: 'https://oauth2.googleapis.com/token'
    }
  };
  urlsGen = {
    firebase: {
      code: (o) => {
        const url = new URL(this.urls.oauth.auth);
        const params = {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
          redirect_uri: o.secrets.redirectUri,
          client_id: o.secrets.googleID,
          scope: 'https://www.googleapis.com/auth/datastore'
        }
        for(const param in params){
          url.searchParams.set(param, params[param]);
        };
        return url;
      }
    }
  }
  check = (o, err, func) => {
    switch(err){
      case 401: {
        console.log('Lol');
        this.oauth.get({
          secrets: o.secrets
        }).then(
          res => {
            console.log('Col', res);
            if(res['access_token']){
              o.secrets.accToken = res['access_token'];
              if(!o.secrets.db) o.secrets.db = {};
              o.secrets.db.access_token = res['access_token'];
              o.secrets.db.refresh_token = res['refresh_token'];
              func(o);
            }
          }
        )
      }
    }
  };
  code = (o) => this.urlsGen.firebase.code(o);
  token = (o) => {
    o.secrets?.url && (o.proxyUrl = o.secrets.url);
    o.method = 'POST';

    o.url = this.urls.oauth.token;
    o.headers = {
      'Content-Type': 'application/json'
    };
    o.data = {
      code: o.code,
      client_id: o.secrets.clientID,
      client_secret: o.secrets.clientSecret,
      redirect_uri: o.secrets.redirectUri,
      grant_type: 'authorization_code',
    };

    return this.fetch(o).then(
      res => {
        console.log('Result', res);
        if(!res) return;
        const ut = new Ut();
        const ms = ut.date.seconds.toMS(res.expires_in);
        const msNow = ut.date.get(null, 'ms');
        res.info = {
          date: ut.date.get(msNow),
          dateExp: ut.date.get(ms+msNow),
          ms: ms,
          msExp: ms+msNow,
          timePer: ut.date.ms.toTimePer(ms)
        };
        return res;
      }
    );
  };
  refresh = (o) => {
    o.secrets?.url && (o.proxyUrl = o.secrets.url);
    o.method = 'POST';

    o.url = this.urls.oauth.token;
    o.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    o.data = {
      client_id: o.secrets.clientID,
      client_secret: o.secrets.clientSecret,
      redirect_uri: o.secrets.redirectUri,
      refresh_token: o.secrets?.oauth.refToken,
      grant_type: 'refresh_token',
    };

    return this.fetch(o).then(
      res => {
        console.log('Refresh', res);
        if(!res) return;
        const ut = new Ut();
        const ms = ut.date.seconds.toMS(res.expires_in);
        const msNow = ut.date.get(null, 'ms');
        res.info = {
          date: ut.date.get(msNow),
          dateExp: ut.date.get(ms+msNow),
          ms: ms,
          msExp: ms+msNow,
          timePer: ut.date.ms.toTimePer(ms)
        };
        return {
          accToken: res.access_token,
          refToken: o.secrets.oauth.refToken,
          expires: res.expires_in,
          info: res.info
        };
      }
    );
  };
  fetch = (o) => new Ut().fetch.run(o)
};
