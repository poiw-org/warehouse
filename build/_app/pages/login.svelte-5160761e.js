import{S as a,i as s,s as r,e as t,j as e,c as n,a as c,m as o,d as l,b as i,f as h,o as u,x as f,u as d,v as m,t as p,k as g,g as w,n as y,D as v,h as x,l as $,w as b,A as k,r as A}from"../chunks/vendor-76b514ea.js";import{a as E}from"../chunks/authService-8b029167.js";import{L as S}from"../chunks/loading-1fd50be2.js";function j(a){let s,r,p;return r=new S({}),{c(){s=t("span"),e(r.$$.fragment),this.h()},l(a){s=n(a,"SPAN",{class:!0});var t=c(s);o(r.$$.fragment,t),t.forEach(l),this.h()},h(){i(s,"class","flex pb-20")},m(a,t){h(a,s,t),u(r,s,null),p=!0},i(a){p||(f(r.$$.fragment,a),p=!0)},o(a){d(r.$$.fragment,a),p=!1},d(a){a&&l(s),m(r)}}}function N(a){let s,r,e,o,u,f,d;return{c(){s=t("span"),r=t("span"),e=p("An error occurred while trying to login. Try to clear your session data."),o=g(),u=t("p"),f=p("Error: "),d=p(a[0]),this.h()},l(t){s=n(t,"SPAN",{class:!0});var i=c(s);r=n(i,"SPAN",{});var h=c(r);e=w(h,"An error occurred while trying to login. Try to clear your session data."),h.forEach(l),o=y(i),u=n(i,"P",{class:!0});var m=c(u);f=w(m,"Error: "),d=w(m,a[0]),m.forEach(l),i.forEach(l),this.h()},h(){i(u,"class","text-gray-300"),i(s,"class","flex px-10 pt-20 w-full justify-center items-center flex-col gap-6")},m(a,t){h(a,s,t),v(s,r),v(r,e),v(s,o),v(s,u),v(u,f),v(u,d)},p(a,s){1&s&&x(d,a[0])},d(a){a&&l(s)}}}function P(a){let s,r,t,e=!a[0]&&j(),n=a[0]&&N(a);return{c(){e&&e.c(),s=g(),n&&n.c(),r=$()},l(a){e&&e.l(a),s=y(a),n&&n.l(a),r=$()},m(a,c){e&&e.m(a,c),h(a,s,c),n&&n.m(a,c),h(a,r,c),t=!0},p(a,[t]){a[0]?e&&(A(),d(e,1,1,(()=>{e=null})),b()):e?1&t&&f(e,1):(e=j(),e.c(),f(e,1),e.m(s.parentNode,s)),a[0]?n?n.p(a,t):(n=N(a),n.c(),n.m(r.parentNode,r)):n&&(n.d(1),n=null)},i(a){t||(f(e),t=!0)},o(a){d(e),t=!1},d(a){e&&e.d(a),a&&l(s),n&&n.d(a),a&&l(r)}}}function C(a,s,r){let t="";return k((async()=>{let a=await E.createClient();try{try{await a.handleRedirectCallback()}catch(s){}void 0===await a.getUser()?await E.login(a):(await a.checkSession(),window.location="/")}catch(s){r(0,t=s.message)}})),[t]}class T extends a{constructor(a){super(),s(this,a,C,P,r,{})}}export{T as default};