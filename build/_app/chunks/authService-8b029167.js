import{Q as t}from"./vendor-76b514ea.js";const e="poiw.eu.auth0.com",a="FX1Is0mT4DyDfzh4MsE3xtBk4Wer7ioK";let i={createClient:async()=>await t({domain:e,client_id:a,audience:"https://api.warehouse.poiw.org",redirect_uri:"http://localhost:3000/login",cacheLocation:"localstorage"}),async login(t){await t.loginWithRedirect()},async logout(){return(await this.createClient()).logout({redirect_uri:"http://localhost:3000"})},async checkSession(){},async isAuthenticated(){return(await this.createClient()).isAuthenticated()},async getUser(){return(await this.createClient()).getUser()}};export{i as a};