"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3089],{46:(e,t,a)=>{a.r(t),a.d(t,{default:()=>d});var n=a(7294),r=a(6010),i=a(2263),s=a(833),l=a(5281),o=a(9058),c=a(9703),m=a(197),g=a(9985);function u(e){const{metadata:t}=e,{siteConfig:{title:a}}=(0,i.Z)(),{blogDescription:r,blogTitle:l,permalink:o}=t,c="/"===o?a:l;return n.createElement(n.Fragment,null,n.createElement(s.d,{title:c,description:r}),n.createElement(m.Z,{tag:"blog_posts_list"}))}function p(e){const{metadata:t,items:a,sidebar:r}=e;return n.createElement(o.Z,{sidebar:r},n.createElement(g.Z,{items:a}),n.createElement(c.Z,{metadata:t}))}function d(e){return n.createElement(s.FG,{className:(0,r.Z)(l.k.wrapper.blogPages,l.k.page.blogListPage)},n.createElement(u,e),n.createElement(p,e))}},9703:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),r=a(5999),i=a(2244);function s(e){const{metadata:t}=e,{previousPage:a,nextPage:s}=t;return n.createElement("nav",{className:"pagination-nav","aria-label":(0,r.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"})},a&&n.createElement(i.Z,{permalink:a,title:n.createElement(r.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)"},"Newer Entries")}),s&&n.createElement(i.Z,{permalink:s,title:n.createElement(r.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)"},"Older Entries"),isNext:!0}))}},9985:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),r=a(9460),i=a(857);function s(e){let{items:t,component:a=i.Z}=e;return n.createElement(n.Fragment,null,t.map((e=>{let{content:t}=e;return n.createElement(r.n,{key:t.metadata.permalink,content:t},n.createElement(a,null,n.createElement(t,null)))})))}},857:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(390),r=a(7294),i=a(2949),s=a(9460);const l=function(e){const{colorMode:t}=(0,i.I)(),{isBlogPostPage:a}=(0,s.C)(),l="dark"===t?"dark":"light",o=(0,r.useRef)(null);return(0,r.useEffect)((()=>{if(!a)return;const e=o.current.querySelector("iframe.giscus-frame");e?(()=>{const t={setConfig:{theme:l}};e.contentWindow.postMessage({giscus:t},"https://giscus.app")})():(()=>{const e=document.createElement("script");e.src="https://giscus.app/client.js",e.setAttribute("data-repo","zip-go/zip-go.github.io"),e.setAttribute("data-repo-id","R_kgDOJ67O1Q"),e.setAttribute("data-category","Announcements"),e.setAttribute("data-category-id","DIC_kwDOJ67O1c4CX2n1"),e.setAttribute("data-mapping","pathname"),e.setAttribute("data-strict","0"),e.setAttribute("data-reactions-enabled","1"),e.setAttribute("data-emit-metadata","0"),e.setAttribute("data-input-position","bottom"),e.setAttribute("data-theme",l),e.setAttribute("data-lang","ko"),e.crossOrigin="anonymous",e.async=!0,o.current.appendChild(e)})()}),[l]),r.createElement(r.Fragment,null,r.createElement(n.Z,e),a&&r.createElement("div",{ref:o}))}}}]);