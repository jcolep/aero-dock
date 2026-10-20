import{B as Je,C as et,K as tt,P as he,U as w,Ut as P,V as Nt,a as nt,bt as b,f as g,h as y,lt as ot,m as z,ot as G,p as Zt,qt as M,x as Ee}from"./vendor-charts-BA6mrMsB.js";import{C as rt,x as at}from"./vendor-grid-BBviq4iz.js";import{$p as we,Ao as it,Dr as Pt,Fs as Ot,Gl as He,Jo as oe,Oa as $t,Qo as re,Uu as Ht,Vd as Dt,Wo as O,Yc as fe,Zo as W,du as F,em as qt,fr as De,gd as Xt,h as Qt,jl as Kt,js as st,pr as Yt,qo as ae,r as K,u as zt,ul as ne,xu as Gt,ym as Jt,ys as en,yu as Ae}from"./vendor-underscore-Bz5YeRR3.js";import{_ as tn,g as lt,p as nn}from"./sfdcUrlUtils-DIgBrj5J.js";import{t as Ie}from"./_plugin-vue_export-helper-DvKAVYQk.js";import{a as ct,t as dt}from"./vendor-vueuse-Bmho6tEI.js";import{r as pt,t as ut}from"./themeHandler-Cv4WOiCZ.js";import{n as $}from"./keyboardManager-CvDdEDCh.js";import{t as on}from"./IconClose-BmFqhOU_.js";var Re=new we("content");function ge(e){Ht(e).forEach(t=>ae().getElementById(t)?.remove())}function S(e){return ae().getElementById(e)}async function ft(e){let t=0;for(;t<=3;){t+=1;const n=e();if(n&&n[0])return n;await Ae(500)}}async function rn(e){const t=await ft(()=>ae().getElementsByTagName(e));if(t)return t[0];Re.debug(`Element with tagName [${e}] not found`)}async function j(e){const t=await ft(()=>ae().getElementsByClassName(e));if(t)return t[0];Re.debug(`Element with className [${e}] not found`)}function U(e,t,n,r,o){const a=document.createElement(t);return n&&Object.keys(n).forEach(s=>a.setAttribute(s,n[s])),r&&Object.keys(r).forEach(s=>a.style[s]=r[s]),e&&e.appendChild(a),o&&a.appendChild(o),a}function an(e){const t=document.createElement("link");t.type="image/x-icon",t.href=e,t.setAttribute("rel","icon"),document.head.appendChild(t)}function be(e){return ae().createTextNode(e)}function sn(){let e=!1;try{window.top.document}catch{e=!0}return Re.debug(`${window.location} is iframe = ${e}`),e}var ln=`<html>
  <body>
    <div id="bb-app">
      <style id="bb-app-styles">
        .bb-appicon-container {
          position: fixed;
          right: -12px;
          top: {{popupIconPositionTop}};
          z-index: 100000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bb-appicon-container:hover, .bb-appicon-container.active {
          right: -5px;
          background-color: #efefef;
          border-radius: 6px;
          padding: 3px 0;
        }

        .bb-dark .bb-appicon-container:hover {
          background-color:  #737373;
        }

        .bb-appicon-draghandle {
          cursor: grab;
          visibility: hidden;
        }

        .bb-appicon-container:hover .bb-appicon-draghandle {
          visibility: visible;
        }

        .bb-appiframe-container {
          background-color: white;
          position: fixed;
          right: 25px;
          top: {{popupPositionTop}};
          z-index: 100000;
        }

        .bb-dark .bb-appiframe-container {
          background-color: #262626;
        }

        .bb-recordeditiframe-container {
          flex-wrap: wrap;
          background-color: inherit;
          z-index: 100000;
          margin: 0 auto;
          width: 90vw;
          height: 90vh;
          max-height: 1600px;
          max-width: 1200px;
          display: flex;
          align-items: center;
          align-content: center;
          justify-content: center;
          visibility: hidden;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .bb-recordeditiframe-container.active {
          visibility: visible;
        }

        .bb-dark .bb-recordeditiframe-container {
          background-color: #262626;
        }

        #bb-recordedit-iframe {
          display: block;
          height: 90vh;
          background-color: white;
          width: 90vw;
          z-index: 10000;
          max-width: 1600px;
          max-height: 1200px;
          border: 1px solid #efefef;
          position: fixed;
        }

        #bb-appiframe {
          border: 1px solid #94a3b8;
          display: none;
          width: {{popupWidth}};
          height: {{popupHeight}};
        }

        .bb-appicon, .bb-appicon-hidden {
          opacity: 0.5;
          cursor: pointer;
        }

        .bb-appicon-hidden {
          visibility: hidden;
        }

        .bb-appicon-container:hover .bb-appicon-hidden {
          visibility: visible;
        }

        .bb-appicon-hidden:hover {
          opacity: 1;
        }

        .bb-appicon-container.active .bb-appicon, .bb-appicon:hover {
          opacity: 1 !important;
        }

        #brobench-tooltip {
          position: fixed;
          z-index: 9999;
          left: 0;
          top: 0;
          background-color: #efefef;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 8px;
          font-family: 'Salesforce Sans', sans-serif;
          color: #222222;
          font-size: 12px;
          line-height: 1.2;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          display: none;
          pointer-events: none;
        }

        .bb-dark #brobench-tooltip {
          background-color: #262626;
          border-color: #525252;
          color: #bbbbbb;
        }
      </style>
      <div id="bb-app-container">
        <div id="brobench-tooltip"></div>
        <div class="bb-appicon-container">
          <svg class="bb-appicon-draghandle" fill="#000000" width="16px" height="10px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 6 14 C 4.894531 14 4 14.894531 4 16 C 4 17.105469 4.894531 18 6 18 C 7.105469 18 8 17.105469 8 16 C 8 14.894531 7.105469 14 6 14 Z M 16 14 C 14.894531 14 14 14.894531 14 16 C 14 17.105469 14.894531 18 16 18 C 17.105469 18 18 17.105469 18 16 C 18 14.894531 17.105469 14 16 14 Z M 26 14 C 24.894531 14 24 14.894531 24 16 C 24 17.105469 24.894531 18 26 18 C 27.105469 18 28 17.105469 28 16 C 28 14.894531 27.105469 14 26 14 Z"
            />
          </svg>
          <img
            id="bb-appicon"
            class="bb-appicon"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAMAAACP+FljAAACzVBMVEUAAABgYGB5Z1ZcWVVWVlVfWVVjY2NeZ2dWVVRCTVOvekeFZ09dV1NZWVhbXl52YlGXcEybjXp4Z1WJak9tYFRoXlRKTFBYVlRRU1RcV1RcWldbV1RdWVZcWVZcWVhbWlhZWVlXWl2ldUppZF+QdFVIUVWOa02acUx/d2tOU1ROUFJlYV1fWFNcWVZWVlVcV1VZWVdcWlhbWFdaWFZaWVleW1peW1lVVFRXVFRaWVhYVlVcXFxZWVlXV1ddYGBaX2TCr5OxoIisnIWxiVg2QUqml4Khflefc0uUiHiIcFWWiniGe255cWhcW1mIaU+Dem5WVVVbV1RXV1ZbWFZWVVVeXVlcWFRXVlZcWFVdXFlZWVdeXVpaV1RUVFRWVlhXV1dVVVVWVVZLUlf0sVnmqVzx1q9VVVVLTlLpz6pZV1X8oSxbWln4ny7/6Lv/uVtbV1VUVFTznTHw1q5cW1pZWVpXWFlPU1T6oC3/5rr/5Lj6tVvysFteW1g0TVhFUVY5TVU0S1VMUFRlW1MxR1NLTE+qeEnSjD3dkTrnljbwmzL737X02bHu1K3p0KrnzqnTvZ2jk35hX17pq1tJVFtFU1tUWFrJl1m3i1heWVQnR1Q6SlM2SFNqXlJHS1BFSE6SbU0/Rk0tOkcrOkYUNUbikzjqmDX1ni/43LPjy6bcxaLXwZ/LtpjHs5W4poz4tFvkqFvtrVrhplrUnlpRVlpHU1rboVk3Tlk8TlirhFdaWFeYeFY/TlUwSlVMUlQQQ1R8Z1MYQ1MgQ1KEaFA6RE0MPE0DNkkyPUi/gkS9gUS5gETDhELNiUDKiEDZkDvtmTP/4rf+4beNgHCIfG54bmV0a2Lfpl78t1vurVvnqVpOVlpAUVrPmlnDk1m7jlmFcFimgFcARFdwYlVlXVUcRlUEQlUAQFRBS1KhdUwJOkwpOUbGhUHZjzzXjjzekjn2njAaW0h4AAAAYXRSTlMABf1F7EYPB/7+/vtkURX+/v39/fz7+/r65uDbyb6faTMe/v39/f39+/v7+vr37rCWjoV7d3FkZF9YS0k9LCYZ/v39/f38/Pz7+/r6+vr6+fTz8uvp1NHKubWyqKSXbiMJlXaICwAAAsZJREFUOMtigAJGBgbTSBsQjQoQ0tahiQuyoxWBbKzSdlHZC7W95s31NWLHZgCbYWKpmGtR5SrvRWlSlpiGyAdPLdDqryjqye1ao7ywREYBVQlbeMlsUY7s7qKJymu6clMdtQ7XyNkjK7Eqlph+NTOxqG9e+qJLqyorVgi6pOuaIJnAmsRUNakgMTUjPb/myIIJfRXn+zUWJUrxAg2BKRBKTkkDCKjg2Zyzz+uOZq5NzV3uoH2sWBbkFKgJEAVz8zuy2oQbFl9Z3ZXb4yS2oNiAjwFFQUsZ/5mcZaceHlx4cSXQKR7HGoPiUBVw3KxXe511jmvnkXkTenMv9Pu0TORFVpCuJ5c/RVWpI2uJet3RmrXducv90+WRFPSmszDYymZv0znZWd52aM/iy6srBQ+bARUww01gATqKV3pqLf/pnMLjIgdeCmo0oilgA/nLOFC1fn571tLWxBdixeboChgAAkamveSMhrLWpVntAhLZ6ApA8tYyZbPncM5sOlFYyD2ZB8MNdvrZ9ZnTqzc1FTzgyhGegqygN12Pgd0wv47TbVLejR0zdu99tQxFQVFfOoup5OZmz6151dNnPK0XaM8p5N4CV5BY0N0zN7+0WWRaVdU0/oN7Dp1eVt4uoDnRAqagoGblhJZZHM7VeVtVZj+ec6Izq6NV4lZmLDtMQWZm5mLOXevzJt1v3FfQ2lHeeVy0tgQU4WAFQsnry9Kb723KS77btG/3/LM579q4AWuYCkm9EBPWbRB6dGfdtdv7Z87cf6aw/K0652RxY0SaLNGdVlV9PW/jrlkHmk6ey1rKJb59ZwxSDlIMKZ2lsnHDjsYnZUpLygtPidSWyKDmQTaDzO3ios0c89/k5LT5NWyWtMDIOrYRpWmaap1ZS9zrtuQbJWDIM4KSQfFebi6dbdn68bhyuEnA5NrSMGbs0mBRPjlpeSzSABdgJEMlmYx6AAAAAElFTkSuQmCC"
            alt=""
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" class="bb-appicon-hidden" data-tooltip="Open in Full Screen"
               data-action="openFullScreen">
            <circle cx="11.959" cy="11.934" r="10.564" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor" style="stroke-width: 1.5;"/>
            <g id="SVGRepo_iconCarrier" transform="matrix(-0.529222, -0.529227, 0.529217, -0.529222, -0.563853, -0.956788)" style="transform-origin: 12.5px 12.5px;">
              <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#000000"/>
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            class="bb-appicon-hidden"
            id="brobench-appicon-open-desktop"
            data-tooltip="Open in Desktop App"
            data-action="openInDesktopApp"
          >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M8 20h8M12 16v4" />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            class="bb-appicon-hidden"
            data-tooltip="{{popupQuickSearcherTooltip}}"
            data-action="toggleQuickSearch"
            id="brobench-appicon-toggle-search"
          >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" />
              <path d="M14.4 14.4L16 16m-.8-4.4a3.6 3.6 0 1 0-7.2 0a3.6 3.6 0 0 0 7.2 0" />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            class="bb-appicon-hidden"
            data-tooltip="Toggle Field Api Names"
            data-action="toggleFieldApiNames"
          >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
              <path
                d="M16 16c.616 0 1.116-.512 1.116-1.143v-1.24c0-.304.117-.595.326-.809l.395-.404a.58.58 0 0 0 0-.808l-.395-.404a1.16 1.16 0 0 1-.326-.808V9.143C17.116 8.512 16.616 8 16 8m-8 8c-.616 0-1.116-.512-1.116-1.143v-1.24c0-.304-.117-.595-.326-.809l-.395-.404a.58.58 0 0 1 0-.808l.395-.404c.209-.214.326-.505.326-.808V9.143C6.884 8.512 7.384 8 8 8m2 4h.009m3.982 0H14"
              />
              <circle cx="12" cy="12" r="10" />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="166 295 22.0 20.6"
            width="26"
            height="26"
            id="bb-recedit-icon"
            class="bb-appicon-hidden"
            data-tooltip="{{popupEditRecordTooltip}}"
            data-action="editRecord"
          >
            <path
              d="M 171.792 307.762 L 171.3 310.713 L 174.246 310.192 C 174.758 310.102 175.23 309.854 175.598 309.484 L 182.241 302.774 C 182.727 302.282 182.727 301.494 182.241 301.013 L 180.89 299.676 C 180.404 299.195 179.616 299.202 179.13 299.694 L 172.487 306.404 C 172.12 306.775 171.876 307.25 171.792 307.762 Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              color="currentColor"
              style="stroke-width: 1.5"
            />
            <path
              d="M 178.209 301.222 L 180.721 303.71"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              color="currentColor"
              style="stroke-width: 1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              transform="matrix(1, -0.01001300010830164, 0, 1, 164.90838623046875, 293.45416259765625)"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              color="currentColor"
            />
          </svg>
        </div>
        <div class="bb-appiframe-container">
          <iframe id="bb-appiframe" class="crx" src="{{iframeUrl}}" allow="clipboard-read; clipboard-write"></iframe>
        </div>
        <iframe class="crx bb-recordeditiframe-container" id="bb-recordedit-iframe" src="{{recEditIframeUrl}}" allow="clipboard-read; clipboard-write"></iframe>
      </div>
    </div>
  </body>
</html>
`,cn={},dn={xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 -960 960 960",width:"24px",fill:"#1f1f1f"};function pn(e,t){return w(),y("svg",dn,[...t[0]||(t[0]=[g("path",{d:"m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"},null,-1)])])}var un=Ie(cn,[["render",pn]]),fn={},hn={xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 -960 960 960",width:"24px",fill:"#1f1f1f"};function gn(e,t){return w(),y("svg",hn,[...t[0]||(t[0]=[g("path",{d:"M482-160q-134 0-228-93t-94-227v-7l-64 64-56-56 160-160 160 160-56 56-64-64v7q0 100 70.5 170T482-240q26 0 51-6t49-18l60 60q-38 22-78 33t-82 11Zm278-161L600-481l56-56 64 64v-7q0-100-70.5-170T478-720q-26 0-51 6t-49 18l-60-60q38-22 78-33t82-11q134 0 228 93t94 227v7l64-64 56 56-160 160Z"},null,-1)])])}var bn=Ie(fn,[["render",gn]]),mn={},wn={xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 -960 960 960",width:"24px",fill:"#1f1f1f"};function vn(e,t){return w(),y("svg",wn,[...t[0]||(t[0]=[g("path",{d:"M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"},null,-1)])])}var yn=Ie(mn,[["render",vn]]),Cn={class:"header"},xn={key:0,class:"bb-spinner"},kn={class:"body",ref:"resultBodyRef"},En={key:0,class:"bb-search-result-empty"},An=["data-index"],Ln=["title"],Vn=["data-index"],Sn={class:"label",style:{"padding-left":"5px"}},In={class:"category"},Rn={class:"footer"},Bn={key:0},Fn=et({__name:"CommandPalette",props:{shortcut:{}},setup(e){const t=e,n=new Dt("commandPalette-mruList","url",25),r=new we("commandPalette"),o=ct().Escape,a=b(!1),s=b(""),d=b(),u=b([]),v=b(!1),E=b([]),R=b(""),_=b("info"),B=b(""),D=b(),N=b(0);dt(D,l=>{l?.target?.closest("#brobench-appicon-toggle-search")||(a.value=!1)}),se(),G(()=>s.value,k);const q=b(!1);async function se(){await ut(),q.value=pt(),await le()}async function le(l={}){await ve(),await pe(l)}async function ve(){try{const l=await zt()||[];await Pt();const c=Yt().filter(C=>C.authType==="oauth"||C.authType==="creds").map(C=>({id:C.id,section:"Login",url:`placeholder://login-${C.id}`,name:`Login: ${C.name}`})),p=[...l,...Qt,...c,{name:"Clear Search History",url:"placeholder://clear-commandpalette-mru",section:"Action"}];K.setShortcuts(p),N.value=K.getShortcuts().length}catch(l){r.warn("Error initing Local Search",l)}}async function k(){a.value&&f(await n.getList(B.value))}function I(l){l&&(l.preventDefault(),l.stopPropagation()),a.value?a.value=!1:(a.value=!0,s.value="",u.value=[],B.value=S("bb-commandpalette-container")?.dataset.username||"",k(),he(()=>{d.value?.focus()}))}G(o,l=>{l&&(a.value=!1)}),G(s,st(250,()=>ye()));let ce,de;Je(()=>{t.shortcut&&$.addKeyHandler2("OpenCommandPalette",t.shortcut,I);const l=()=>{a.value=!1};document.addEventListener("bb-close-commandpalette",l),ce=()=>document.removeEventListener("bb-close-commandpalette",l);const c=p=>{I(p)};document.addEventListener("bb-toggle-commandpalette",c),de=()=>document.removeEventListener("bb-toggle-commandpalette",c)}),Nt(()=>{ce?.(),de?.()});async function pe(l={}){try{if(location.href==="https://"||!location.href)return;v.value=!0;const c=await O({url:location.href,type:"initSearch",value:{conn:B.value,url:location.href,forceRefresh:l.force}});r.debug("Init Remote Search Response",c),N.value=K.getShortcuts().length+c.count,v.value=!1}catch(c){r.warn("Error initing Remote Search",c)}}function X(){he(()=>{u.value.length&&m(0)})}async function ye(){if(!s.value)return;R.value="",f(K.search(s.value)),X(),v.value=!0;const l=await O({url:location.href,type:"searchItems",value:{conn:B.value,text:s.value}});f(Gt([...u.value,...l.items],"rank")),X(),v.value=!1,l.indexCount&&(N.value=K.getShortcuts().length+l.indexCount)}function f(l){u.value=l.map((c,p)=>(c.index=p,c)),X()}let h=0;function m(l){h=l,u.value.forEach(c=>c.selected=!1),h>=u.value.length?h=0:h<0&&(h=u.value.length-1),u.value[h].selected=!0,E.value[h]?.scrollIntoView({block:"nearest"})}function Q(l){l.preventDefault(),l.metaKey?m(u.value.length-1):m(h+1)}function Ut(l){l.preventDefault(),l.metaKey?m(0):m(h-1)}async function Oe(l,c){const p=u.value[h];if(!p){r.error(`Search result item not found for selectedIndex ${h}`);return}if(p.label=="Clear Search History"){await n.clear(B.value),s.value="";return}p.label.startsWith("Open Id")||n.addToList(p,B.value);let C=p.url;if(C.startsWith("placeholder://")){const Z=await O({url:location.href,type:"getSearchResultUrl",value:p});if(Z.error){r.error(`Search error: ${Z.error}`);return}C=Z.url}else p.section==="Metadata > Objects"&&(C=`/lightning/setup/ObjectManager/${p.url}/FieldsAndRelationships/view`);l.metaKey||c==="newTab"?window.open(C,"_newtab "+new Date().getTime())?.focus():Mt(C),a.value=!1}function Mt(l){const c=new URL(l,location.href);if(ne(location.href)||ne(c.toString())){window.open(c.toString(),"_top")?.focus();return}if(!c.pathname.startsWith("/lightning")){window.open(c.toString(),"_PARENT")?.focus();return}const p=c.pathname+c.search+c.hash;Wt(p,c.toString()),document.dispatchEvent(new CustomEvent("bbLightningNavigate",{detail:{url:p,fallbackURL:c.toString()},bubbles:!0,composed:!0})),document.dispatchEvent(new CustomEvent("lightningNavigate",{detail:{navigationType:"url",url:p,fallbackURL:c.toString()},bubbles:!0,composed:!0})),window.postMessage({type:"BB_LIGHTNING_NAVIGATE",url:p,fallbackURL:c.toString()},"*")}function Wt(l,c){const p=document.createElement("script"),C=JSON.stringify(l.startsWith("/")?l:`/${l}`),Z=JSON.stringify(c);p.textContent=`
    (() => {
      try {
        const navUrl = ${C};
        const fallbackURL = ${Z};
        if (typeof window.$A !== 'undefined' && window.$A.get) {
          const e = window.$A.get('e.force:navigateToURL');
          if (e) {
            e.setParams({url: navUrl});
            e.fire();
            return;
          }
        }
        if (window.sforce && window.sforce.one && window.sforce.one.navigateToURL) {
          window.sforce.one.navigateToURL(navUrl);
          return;
        }
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', navUrl);
          window.dispatchEvent(new PopStateEvent('popstate'));
          return;
        }
        window.open(fallbackURL, '_top');
      } catch (_e) {
        window.open(${Z}, '_top');
      }
    })();
  `,(document.head||document.documentElement).appendChild(p),p.remove()}function jt(l){window.open(l,"_newtab "+new Date().getTime())?.focus()}function _t(l){switch(l.key){case"ArrowDown":Q(l);break;case"ArrowUp":Ut(l);break;case"Home":m(0);break;case"End":m(u.value.length-1);break;case"Enter":Oe(l)}}function $e(l,c){l.preventDefault(),l.stopPropagation(),h=l.currentTarget.getAttribute("data-index"),Oe(l,c)}return(l,c)=>(w(),y("div",{ref_key:"appRef",ref:D,class:P({"bb-commandpalette-container":!0,"bb-dark":q.value})},[a.value?(w(),y("div",{key:0,class:"bb-search",onKeydown:_t},[g("div",Cn,[c[5]||(c[5]=g("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAMAAACP+FljAAABdFBMVEUAAAB5Z1ZdWVZOUlNWVlVaVlVpXlOFZ09cWVZZWFdaXmBjY2NeWFNbWVavekduYFSJak9nYl5cWFVcV1RaWFd3bmV2YlGXcEybjXqccktYVlRcWldbV1RcWVZcWVhXV1ZbWVlbWlhZWVlbXV1XWl2vnoeHcFaQdFWViXh/d2uFem5WVlVcWldcWlhbWFdaWVhZWVlXV1ehfldVVVVbWFdKTVHnqVxLUlfx1q/7oSz0sVnpz6o1TFb/6LtYWFn0njBGUlr6tVs7TFUrOkb/5Lj/uVtSV1r227JlW1NCTFOQbE09RU3ekTrsmDTaw6GklH/ysFvLmFm4jFishVdFUVYxR1OqeEm+gkTSjD3ZjzvnljbwmzL737Xu1K3TvZ3GspRhX17hplvurVoBQlUnR1Q2SFMZRFNFSE4LO0ykdUozPkgUNUbEhEHikzjjy6bLtpi4poyLfm/UnlrboVmYeFYQQ1QgQ1IDNkm5gETNiUDKiEDDk1lqrZINAAAAM3RSTlMA/kX97WP9/c1PFg/9tP79/fz26Hn+/v79/frg276flnBpMyUe/f39+/v686aOhVg9LPzjbK0JAAACMklEQVQ4y32Td1MiQRTEwVGSoBLMEXM4T715A6xugCXnJKAEyVG9YDr1vvztapWwgM6f835T3TWvW9Y9a7pj2RdnRIWD8G3zs/GGDpz63SYxfB86Hj/ELInaXJF9J148GpybjR6MrhhbgckX9U5Wtd73XMXWFRi8tpK+mGdsWygIK5peQA0oUQZsO2sS55+Ii/k51yEGU699q9xhwQJAAFrB6BnjutoTrKh7gdM3wK+4bJ//hd82xlvUd2B5vR8gkKUupujr6V95prBFgrCq6QPQzCvF3Uw+vVvZ7ZCDNSmAPXTgkgpPQKv5ZmWalNQSYHQF7NZ2lrqdF614Ge8+MUsB2cky0NrnHHWhFK245oJjUkAwpV7y0DMvFJeZbDjn9kgfMC56MhmsdCBEhdO4RWAYINMYtTRKh6nQLBoKjKhQXeGv+TIcp7QPeBCDQUMidufD1Qlqqh+QyQ7h3P/D4rYktTy64QaANaMntX3vjiW0VXo2REklvAUCbGoy7nDEZ55o5Qsnmix1AYhECY+TMff9Tr2hyOSobBrZYfVjFwBw7X8QxckjTmepXEZBs8LCPwBEUtt37tOE75EX9sUJX+1ZPOpJVEXu+yeIy2s1+asgPu+3L5i6mWQNcUes4i4/8A3fc1hY9wIvadDmKMvvlCtJUkXtWzEwNKs6luZ+FfgFRQoL4mLkPMaxgeac6FiMAjkxKXYYXj71EiDlhJYG3cZn9TUd2AXxkS/6r1lZMg+5/g9+BpMPm1eWfgAAAABJRU5ErkJggg=="},null,-1)),ot(g("input",{autofocus:"","onUpdate:modelValue":c[0]||(c[0]=p=>s.value=p),ref_key:"searchInput",ref:d,type:"text",class:"bb-search-input",placeholder:"Search for Shortcuts, Logins and Others"},null,512),[[rt,s.value]]),v.value?(w(),y("span",xn)):(w(),Zt(bn,{key:1,class:"bb-icon",onClick:c[1]||(c[1]=()=>le({force:!0}))})),Ee(yn,{class:"bb-icon",onClick:c[2]||(c[2]=()=>jt("https://help.datasert.com/docs/brobench/ui-enhancements/quick-searcher"))}),Ee(un,{class:"bb-icon",onClick:c[3]||(c[3]=p=>a.value=!1)})]),g("div",kn,[u.value.length?(w(!0),y(nt,{key:1},tt(u.value,p=>(w(),y("div",{ref_for:!0,ref_key:"resultItemRefs",ref:E,class:P({"bb-search-result-item":!0,selected:p.selected}),"data-index":p.index,onClick:$e},[g("div",{style:{display:"flex","align-items":"center"},title:p.url},[g("span",{class:"external-link","data-index":p.index,onClick:c[4]||(c[4]=C=>$e(C,"newTab"))},[...c[6]||(c[6]=[g("svg",{fill:"#6b7280",width:"22px",height:"22px",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},[g("path",{d:"M18,10.82a1,1,0,0,0-1,1V19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8A1,1,0,0,1,5,7h7.18a1,1,0,0,0,0-2H5A3,3,0,0,0,2,8V19a3,3,0,0,0,3,3H16a3,3,0,0,0,3-3V11.82A1,1,0,0,0,18,10.82Zm3.92-8.2a1,1,0,0,0-.54-.54A1,1,0,0,0,21,2H15a1,1,0,0,0,0,2h3.59L8.29,14.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L20,5.41V9a1,1,0,0,0,2,0V3A1,1,0,0,0,21.92,2.62Z"})],-1)])],8,Vn),g("span",Sn,M(p.label),1),g("span",In,M(p.section),1)],8,Ln)],10,An))),256)):(w(),y("div",En,"Enter Search term to search "+M(N.value)+" shortcuts",1))],512),g("div",Rn,[R.value?(w(),y("div",Bn,[g("span",{class:P({"bb-message":!0,"bb-message-error":_.value==="error","bb-message-info":_.value==="info"})},M(R.value),3)])):z("",!0)])],32)):z("",!0)],2))}}),Tn=Fn,Be="#ef5f3b",Un="#ffffff",Mn="#ef5f3b",Fe=!1;function J(e,t){for(const n of Object.keys(t))e.style.setProperty(n,t[n])}function ht(){return[...document.querySelectorAll('.forcegenerated-flexipage-module,[data-page-type="RecordPage"]')].filter(e=>e.localName.startsWith("forcegenerated-flexipage_"))}function Wn(e){return e.replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/__/g,"##").replace(/-/g,"_").toLowerCase().replace(/##/g,"__")}function jn(e,t){let n=e.replace(/^forcegenerated-flexipage_/,"").replace(/___lmt___\d+$/,"").trim();if(n=n.replace(/__view_js__$/,"").replace(/_view_js__$/,"").replace(/__view_js$/,"").replace(/_view_js$/,""),t){const r=`_${Wn(t)}`;n.endsWith(r)&&(n=n.slice(0,-r.length))}return n||"Flexipage"}function _n(e){const t=document.createElement("span");return t.innerHTML=e.createIcon(),t.title=e.tooltip,J(t,{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"18px",height:"18px",cursor:"pointer",opacity:"0",transition:"opacity 0.2s ease-in-out, transform 0.1s ease-in-out",color:Be,lineHeight:"0"}),t.addEventListener("mouseenter",()=>{t.style.opacity="1",t.style.transform="scale(1.12)"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1)"}),t.addEventListener("click",e.onClick),t}function Nn(e,t){const n=document.createElement("div");n.className="bb-flexipage-info",J(n,{display:"inline-flex",alignItems:"center",gap:"4px",marginBottom:"4px",padding:"1px 5px",border:`1px solid ${Be}`,borderRadius:"4px",background:Un,color:Mn,fontSize:"11px",lineHeight:"1.2",fontWeight:"500",maxWidth:"100%",boxSizing:"border-box"});const r=document.createElement("span");if(r.textContent=`Flexi Page: ${e}`,r.title=`Flexi Page: ${e}`,J(r,{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"default"}),n.appendChild(r),t.length){const o=document.createElement("span");J(o,{display:"inline-flex",alignItems:"center",gap:"4px",marginLeft:"2px"});for(const a of t)o.appendChild(_n(a));n.addEventListener("mouseenter",()=>{o.querySelectorAll("span").forEach(a=>{a.style.opacity="1"})}),n.addEventListener("mouseleave",()=>{o.querySelectorAll("span").forEach(a=>{a.style.opacity="0",a.style.transform="scale(1)"})}),n.appendChild(o)}return n}function Zn(e){e.dataset.bbFlexipageInfoApplied!=="true"&&(e.dataset.bbFlexipageInfoApplied="true",e.dataset.bbFlexipageInfoBorder=e.style.border||"",e.dataset.bbFlexipageInfoBorderRadius=e.style.borderRadius||"",J(e,{border:`1px dashed ${Be}`,borderRadius:"4px"}))}function Pn(e){e.dataset.bbFlexipageInfoApplied==="true"&&(e.style.border=e.dataset.bbFlexipageInfoBorder||"",e.style.borderRadius=e.dataset.bbFlexipageInfoBorderRadius||"",delete e.dataset.bbFlexipageInfoApplied,delete e.dataset.bbFlexipageInfoBorder,delete e.dataset.bbFlexipageInfoBorderRadius)}function On(){return Fe}function $n(){ht().forEach(e=>{Pn(e),e.querySelectorAll(".bb-flexipage-info").forEach(t=>t.remove())}),Fe=!1}function Hn(e={}){let t=0;ht().forEach(n=>{if(n.dataset.bbFlexipageInfoApplied==="true")return;const r=jn(n.localName,e.sobjName);Zn(n),n.insertBefore(Nn(r,e.getActions?.(r)||[]),n.firstChild),t++}),Fe=t>0}var Te="#ef5f3b",Dn="rgba(239, 95, 59, 0.08)",qn="#ef5f3b",Ue=!1;function Xn(e){return e.localName.startsWith("c-")||e.getAttribute("is")?.startsWith("c-")}function Me(e,t){for(const n of e)Xn(n)&&t.push(n),n.shadowRoot&&Me(n.shadowRoot.querySelectorAll("*"),t);return t}function ee(e,t){for(const n of Object.keys(t))e.style.setProperty(n,t[n])}function Qn(e){const[t,...n]=e.split("-");return n.length?`${t}-${n.map((r,o)=>o===0?r:r.charAt(0).toUpperCase()+r.slice(1)).join("")}`:e}function gt(e){return Qn(e).replace(/^c-/,"")}function Kn(e){const t=document.createElement("span");return t.innerHTML=e.createIcon(),t.title=e.tooltip,ee(t,{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"18px",height:"18px",cursor:"pointer",opacity:"0",transition:"opacity 0.2s ease-in-out, transform 0.1s ease-in-out",color:Te,lineHeight:"0"}),t.addEventListener("mouseenter",()=>{t.style.opacity="1",t.style.transform="scale(1.12)"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1)"}),t.addEventListener("click",e.onClick),t}function Yn(e,t){const n=document.createElement("div");n.className="bb-lwc-info";const r=gt(e);ee(n,{display:"inline-flex",alignItems:"center",gap:"4px",position:"absolute",top:"4px",left:"4px",zIndex:"1",padding:"1px 5px",border:`1px solid ${Te}`,borderRadius:"4px",background:Dn,color:qn,fontSize:"11px",lineHeight:"1.2",fontWeight:"500",maxWidth:"100%",boxSizing:"border-box"});const o=document.createElement("span");if(o.textContent=`LWC: ${r}`,o.title=`LWC: ${r}`,ee(o,{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"default"}),n.appendChild(o),t.length){const a=document.createElement("span");ee(a,{display:"inline-flex",alignItems:"center",gap:"4px",marginLeft:"2px"});for(const s of t)a.appendChild(Kn(s));n.addEventListener("mouseenter",()=>{a.querySelectorAll("span").forEach(s=>{s.style.opacity="1"})}),n.addEventListener("mouseleave",()=>{a.querySelectorAll("span").forEach(s=>{s.style.opacity="0",s.style.transform="scale(1)"})}),n.appendChild(a)}return n}function zn(e){e.dataset.bbLwcInfoApplied!=="true"&&(e.dataset.bbLwcInfoApplied="true",e.dataset.bbLwcInfoBorder=e.style.border||"",e.dataset.bbLwcInfoBorderRadius=e.style.borderRadius||"",e.dataset.bbLwcInfoDisplay=e.style.display||"",e.dataset.bbLwcInfoPosition=e.style.position||"",ee(e,{display:getComputedStyle(e).display==="inline"?"block":e.style.display||getComputedStyle(e).display,position:e.style.position||"relative",border:`1px dashed ${Te}`,borderRadius:"4px"}))}function Gn(e){e.dataset.bbLwcInfoApplied==="true"&&(e.style.border=e.dataset.bbLwcInfoBorder||"",e.style.borderRadius=e.dataset.bbLwcInfoBorderRadius||"",e.style.display=e.dataset.bbLwcInfoDisplay||"",e.style.position=e.dataset.bbLwcInfoPosition||"",delete e.dataset.bbLwcInfoApplied,delete e.dataset.bbLwcInfoBorder,delete e.dataset.bbLwcInfoBorderRadius,delete e.dataset.bbLwcInfoDisplay,delete e.dataset.bbLwcInfoPosition)}function bt(){return Ue}function mt(){const e=Me(document.querySelectorAll("*"),[]);for(const t of e)Gn(t),t.querySelectorAll(":scope > .bb-lwc-info").forEach(n=>n.remove());Ue=!1}function wt(e={}){const t=Me(document.querySelectorAll("*"),[]);let n=0,r=0;for(const o of t){if(o.querySelector(":scope > .bb-lwc-info")){r++;continue}const a=o.localName,s=e.getActions?.(a)||[];zn(o),o.insertBefore(Yn(a,s),o.firstChild),n++}Ue=n>0||r>0}function Jn(e={}){bt()?mt():wt(e)}var We="#ef5f3b",eo="#ffffff",to="#ef5f3b",je=!1;function te(e,t){for(const n of Object.keys(t))e.style.setProperty(n,t[n])}function vt(e){const t=["lightning-flow","[flow-api-name]","[data-flow-api-name]","[flow-api-name]",'[data-aura-class*="flow"]',"flowruntime-flow","runtime_flow-flow"],n=new Set;for(const r of t)e.querySelectorAll(r).forEach(o=>n.add(o));return[...n]}function no(e){return[e.getAttribute("flow-api-name"),e.getAttribute("flowapiname"),e.getAttribute("data-flow-api-name"),e.getAttribute("name"),e.flowApiName,e.flowName,e.name].find(t=>typeof t=="string"&&t.trim())?.trim()}function yt(e){return e.parentElement||e}function oo(e){const t=document.createElement("span");return t.innerHTML=e.createIcon(),t.title=e.tooltip,te(t,{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"18px",height:"18px",cursor:"pointer",opacity:"0",transition:"opacity 0.2s ease-in-out, transform 0.1s ease-in-out",color:We,lineHeight:"0"}),t.addEventListener("mouseenter",()=>{t.style.opacity="1",t.style.transform="scale(1.12)"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1)"}),t.addEventListener("click",e.onClick),t}function ro(e,t){const n=document.createElement("div");n.className="bb-flow-info",te(n,{display:"inline-flex",alignItems:"center",gap:"4px",marginBottom:"4px",padding:"1px 5px",border:`1px solid ${We}`,borderRadius:"4px",background:eo,color:to,fontSize:"11px",lineHeight:"1.2",fontWeight:"500",maxWidth:"100%",boxSizing:"border-box"});const r=document.createElement("span");if(r.textContent=e,r.title=`Flow: ${e}`,te(r,{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"default"}),n.appendChild(r),t.length){const o=document.createElement("span");te(o,{display:"inline-flex",alignItems:"center",gap:"4px",marginLeft:"2px"});for(const a of t)o.appendChild(oo(a));n.addEventListener("mouseenter",()=>{o.querySelectorAll("span").forEach(a=>{a.style.opacity="1"})}),n.addEventListener("mouseleave",()=>{o.querySelectorAll("span").forEach(a=>{a.style.opacity="0",a.style.transform="scale(1)"})}),n.appendChild(o)}return n}function ao(e){e.dataset.bbFlowInfoApplied!=="true"&&(e.dataset.bbFlowInfoApplied="true",e.dataset.bbFlowInfoBorder=e.style.border||"",e.dataset.bbFlowInfoBorderRadius=e.style.borderRadius||"",te(e,{border:`1px dashed ${We}`,borderRadius:"4px"}))}function io(e){e.dataset.bbFlowInfoApplied==="true"&&(e.style.border=e.dataset.bbFlowInfoBorder||"",e.style.borderRadius=e.dataset.bbFlowInfoBorderRadius||"",delete e.dataset.bbFlowInfoApplied,delete e.dataset.bbFlowInfoBorder,delete e.dataset.bbFlowInfoBorderRadius)}function so(){return je}function lo(){vt(document).forEach(e=>{const t=yt(e);io(t),t.querySelectorAll(".bb-flow-info").forEach(n=>n.remove())}),je=!1}function co(e={}){let t=0;vt(document).forEach(n=>{const r=no(n)||"Flow",o=yt(n);o.dataset.bbFlowInfoApplied!=="true"&&(ao(o),o.insertBefore(ro(r,e.getActions?.(r)||[]),o.firstChild),t++)}),je=t>0}var po={class:"header"},uo={key:0,class:"bb-spinner"},fo={class:"body",ref:"resultBodyRef"},ho={key:0,class:"bb-search-result-empty"},go=["data-index"],bo={style:{display:"flex","align-items":"center"}},mo={class:"label"},wo={class:"category"},vo={class:"footer"},yo={key:0},Co=et({__name:"RecordEditor",props:{shortcut:{}},setup(e){const t=e,n=new we("recordEditor"),r=ct().Escape,o=b(!1),a=b(""),s=b(),d=b({}),u=b(!1),v=b([]),E=b(""),R=b("info"),_=b(""),B=b();dt(B,()=>o.value=!1),N();const D=b(!1);async function N(){await ut(),D.value=pt()}function q(){o.value?o.value=!1:(o.value=!0,a.value="",d.value={items:[]},_.value=S("bb-recordeditor-app")?.dataset.username||"",le(),he(()=>{s.value?.focus()}))}G(r,f=>{f&&(o.value=!1)}),G(a,st(250,()=>ve()));let se=!1;Je(()=>{const f=document.getElementById("bb-appicon-toggle-editor");f&&!se&&(f.addEventListener("click",q),t.shortcut&&$.addKeyHandler2("RecordEditor",t.shortcut,q),se=!0)});async function le(){u.value=!0,E.value=(await O({url:location.href,type:"initSearch",value:{conn:_.value,url:location.href}})).message,R.value="info",u.value=!1}async function ve(){a.value&&(E.value="",u.value=!0,d.value=await O({url:location.href,type:"searchItems",value:{conn:_.value,text:a.value}}),he(()=>{d.value.items?.length&&I(0)}),E.value=d.value.message||"",u.value=!1)}let k=0;function I(f){k=f,d.value.items.forEach(h=>h.selected=!1),k>=d.value.items.length?k=0:k<0&&(k=d.value.items.length-1),d.value.items[k].selected=!0,v.value[k].scrollIntoView({block:"nearest"})}function ce(f){f.preventDefault(),f.metaKey?I(d.value.items.length-1):I(k+1)}function de(f){f.preventDefault(),f.metaKey?I(0):I(k-1)}async function pe(f){const h=d.value.items[k];if(!h){n.error(`Search result item not found for selectedIndex ${k}`);return}let m=h.url;if(m.startsWith("placeholder://")){const Q=await O({url:location.href,type:"getSearchResultUrl",value:h});if(Q.error){n.error(`Search error: ${Q.error}`);return}m=Q.url}f.metaKey?window.open(m,"_newtab"):window.open(m,"_PARENT"),o.value=!1}function X(f){switch(f.key){case"ArrowDown":ce(f);break;case"ArrowUp":de(f);break;case"Home":I(0);break;case"End":I(d.value.items.length-1);break;case"Enter":pe(f)}}function ye(f){k=f.currentTarget.getAttribute("data-index"),pe(f)}return(f,h)=>(w(),y("div",{ref_key:"appRef",ref:B,class:P({"bb-recordeditor-container":!0,"bb-dark":D.value})},[o.value?(w(),y("div",{key:0,class:"bb-search",onKeydown:X},[g("div",po,[h[2]||(h[2]=g("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAMAAACP+FljAAABdFBMVEUAAAB5Z1ZdWVZOUlNWVlVaVlVpXlOFZ09cWVZZWFdaXmBjY2NeWFNbWVavekduYFSJak9nYl5cWFVcV1RaWFd3bmV2YlGXcEybjXqccktYVlRcWldbV1RcWVZcWVhXV1ZbWVlbWlhZWVlbXV1XWl2vnoeHcFaQdFWViXh/d2uFem5WVlVcWldcWlhbWFdaWVhZWVlXV1ehfldVVVVbWFdKTVHnqVxLUlfx1q/7oSz0sVnpz6o1TFb/6LtYWFn0njBGUlr6tVs7TFUrOkb/5Lj/uVtSV1r227JlW1NCTFOQbE09RU3ekTrsmDTaw6GklH/ysFvLmFm4jFishVdFUVYxR1OqeEm+gkTSjD3ZjzvnljbwmzL737Xu1K3TvZ3GspRhX17hplvurVoBQlUnR1Q2SFMZRFNFSE4LO0ykdUozPkgUNUbEhEHikzjjy6bLtpi4poyLfm/UnlrboVmYeFYQQ1QgQ1IDNkm5gETNiUDKiEDDk1lqrZINAAAAM3RSTlMA/kX97WP9/c1PFg/9tP79/fz26Hn+/v79/frg276flnBpMyUe/f39+/v686aOhVg9LPzjbK0JAAACMklEQVQ4y32Td1MiQRTEwVGSoBLMEXM4T715A6xugCXnJKAEyVG9YDr1vvztapWwgM6f835T3TWvW9Y9a7pj2RdnRIWD8G3zs/GGDpz63SYxfB86Hj/ELInaXJF9J148GpybjR6MrhhbgckX9U5Wtd73XMXWFRi8tpK+mGdsWygIK5peQA0oUQZsO2sS55+Ii/k51yEGU699q9xhwQJAAFrB6BnjutoTrKh7gdM3wK+4bJ//hd82xlvUd2B5vR8gkKUupujr6V95prBFgrCq6QPQzCvF3Uw+vVvZ7ZCDNSmAPXTgkgpPQKv5ZmWalNQSYHQF7NZ2lrqdF614Ge8+MUsB2cky0NrnHHWhFK245oJjUkAwpV7y0DMvFJeZbDjn9kgfMC56MhmsdCBEhdO4RWAYINMYtTRKh6nQLBoKjKhQXeGv+TIcp7QPeBCDQUMidufD1Qlqqh+QyQ7h3P/D4rYktTy64QaANaMntX3vjiW0VXo2REklvAUCbGoy7nDEZ55o5Qsnmix1AYhECY+TMff9Tr2hyOSobBrZYfVjFwBw7X8QxckjTmepXEZBs8LCPwBEUtt37tOE75EX9sUJX+1ZPOpJVEXu+yeIy2s1+asgPu+3L5i6mWQNcUes4i4/8A3fc1hY9wIvadDmKMvvlCtJUkXtWzEwNKs6luZ+FfgFRQoL4mLkPMaxgeac6FiMAjkxKXYYXj71EiDlhJYG3cZn9TUd2AXxkS/6r1lZMg+5/g9+BpMPm1eWfgAAAABJRU5ErkJggg=="},null,-1)),ot(g("input",{autofocus:"","onUpdate:modelValue":h[0]||(h[0]=m=>a.value=m),ref_key:"searchInput",ref:s,type:"text",class:"bb-search-input",placeholder:"Search for Shortcuts, Logins and Others"},null,512),[[rt,a.value]]),u.value?(w(),y("span",uo)):z("",!0),Ee(on,{class:"bb-close-icon",onClick:h[1]||(h[1]=m=>o.value=!1)})]),g("div",fo,[d.value.length?(w(!0),y(nt,{key:1},tt(d.value,m=>(w(),y("div",{ref_for:!0,ref_key:"resultItemRefs",ref:v,class:P({"bb-search-result-item":!0,selected:m.selected}),"data-index":m.index,onClick:ye},[g("div",bo,[g("span",mo,M(m.label),1),g("span",wo,M(m.category),1)])],10,go))),256)):(w(),y("div",ho,"No Fields to show!"))],512),g("div",vo,[E.value?(w(),y("div",yo,[g("span",{class:P({"bb-message":!0,"bb-message-error":R.value==="error","bb-message-info":R.value==="info"})},M(E.value),3)])):z("",!0)])],32)):z("",!0)],2))}}),xo=Co,i=new we("content"),x;qt(Jt()||Kt(fe(location.href,"bbdebug")||window.bbdebug));function Ct(e){const t=S("theloginform");t.insertBefore(U(void 0,"div",{class:"loginError"},{display:"block"},be(e)),t.firstChild)}async function ko(e){switch(e.type){case"toggleFieldInfo":Tt();break;case"hidePagePopup":await A(!0);break;case"hideRecordEdit":_e(),e.value?.reload&&window.location.reload();break;case"reloadWindow":(!e.conn||e.conn===x?.connUsername)&&window.location.reload();break;default:i.debug("Unknown message so ignoring")}}async function Eo(e){const t=fe(e,"bb_conn_name"),n=fe(e,"bb_conn_id"),r=fe(e,"startURL");if(n){const o=await re({url:location.href,type:"getLogin",value:{name:t,id:n,startUrl:r}});return i.debug("Received login resp",Ot(o)),o||Ct("Could not get Brobench Login details. Check if it is unlocked with Master Password or if details are entered."),o}else return}async function xt(e){await Ae(500);const t=document.querySelector("[data-message-id='loginAsSystemMessage']"),n=5;let r;for(let o=1;o<=n;o++)try{x=await re({url:location.href,type:"getOrgTab",value:{url:e,sessionMode:t?"Impersonation":"Normal"}});break}catch(a){r=a,i.warn(`Error getting OrgTab from background. attempt=${o} maxAttempts=${n}. ${a.message}`,{url:location.href}),o<n&&await Ae(1e3)}if(!x&&r)throw r;return i.debug("Received orgtab response",x),x}async function Ao(){i.debug("Starting Brobench Login injection");const e=await Eo(location.href);if(!e){i.debug("Brobench params not present or login details not found so not logging in");return}if(i.debug("Received login response",e),!e)return;if(e.error){alert("Brobench could not login. "+e.error);return}if(!e.username||!e.password)return;ge(["login_form","forgot_password_link","mydomainLink"]);const t=S("theloginform");t.insertBefore(be("Brobench logging you in as "+e.username+"..."),t.firstChild);const n=U(await rn("body"),"form",{style:"display:hidden;",action:e.url,method:"post"});n.innerHTML=`<input type='hidden' name='un' value='${e.username}' /><input type='hidden' name='pw' value='${e.password}' />`,n.submit()}function qe(e){const t=`[${e}]`;if(window?.top?.document?.title&&!window.top.document.title.includes(t))try{window.top.document.title=`${t} ${window.top.document.title}`}catch(n){i.debug(`[warn] Error setting title ${n.message}`)}}async function Lo(e){try{if(e.headerBarEnabled&&e.color){const t=document.createElement("div"),n=e.headerBarAnimation;(!n||n==="Blink Background"||n==="Blink Text")&&(t.className="slds-notify_alert bb-header-banner"),t.style.backgroundColor=e.color,t.style.fontWeight="bold",t.style.fontSize="1.1em",e.headerBarAnimation&&(t.style.setProperty("--bb-header-banner-bg-color-from",e.color),t.style.setProperty("--bb-header-banner-bg-color-to","white"),t.style.animationDuration="1s",t.style.animationIterationCount="infinite",t.style.animationName=e.headerBarAnimation==="Blink Text"?"headerBannerAnimationBlinkText":"headerBannerAnimationBlinkBg");const r=document.createElement("span");r.textContent=e.headerBarText||e.name,t.appendChild(r);let o;ne(window.location.href)&&(o=document.getElementsByTagName("builder_platform_interaction-header")[0]),o||(o=document.querySelector(Se)),o?o.insertBefore(t,o.firstChild):kt(Se,a=>a.appendChild(t))}}catch(t){i.warn("Error injecting header banner",t)}}function Vo(e){try{e.tabIconEnabled&&e.iconUrl&&an(e.iconUrl)}catch(t){i.warn("Error injecting Tab Icon",t)}}function kt(e,t){const n=document.querySelector(e);n&&t(n),new MutationObserver((r,o)=>{const a=document.querySelector(e);a&&(t(a),o.disconnect())}).observe(document,{childList:!0,subtree:!0})}function So(e){try{if(e.tabTitlePrefixEnabled&&e.name){qe(e.name);const t=document.querySelector("title");new MutationObserver(()=>qe(e.name)).observe(t,{childList:!0,attributes:!0,characterData:!0})}}catch(t){i.warn("Error injecting Tab Prefix",t)}}async function Io(e){try{if(e.nameBoxEnabled&&e.name){const t=await j("slds-global-actions");if(t){const n=U(void 0,"li",{id:"brobench-orgtab-name",className:"brobench-org-name",title:"Brobench Org name"},void 0,U(void 0,"span",void 0,{display:"inline-block",backgroundColor:e.color||"#0f0f0f",color:"white",padding:"4px 6px",borderRadius:"6px",fontWeight:700},be(e.name)));ge("brobench-orgtab-name"),t.insertBefore(n,t.firstChild)}else{const n=await j("linkElements");if(n){const r=U(void 0,"span",{id:"brobench-orgtab-name",className:"brobench-org-name",title:"Brobench Org Name"},{display:"inline-block"},U(void 0,"span",void 0,{display:"inline-block",backgroundColor:e.color||"#0f0f0f",color:"white",padding:"4px 6px",borderRadius:"6px",fontWeight:700},be(e.name)));ge("brobench-orgtab-name"),n.insertBefore(r,n.firstChild)}}}}catch(t){i.warn("Error injecting Conn Name",t)}}async function Le(e){i.debug("Coming to app launch click handler",e);const t=Pe(location.href);if(Vt()==="Full Page"||e.metaKey&&e.type==="click")await A(),window.open(t,"brobench")?.focus();else{const n=S("bb-appiframe");if(n){const r=await j("bb-appicon-container");if(!r){i.warn("Brobench app launcher container was not found while toggling popup",{url:location.href});return}n.style.display==="block"?await A(!0):(await A(!1),i.debug("Showing UI with tabUrl ",encodeURIComponent(location.href)),St(),n.src=t,n.style.display="block",r.className="bb-appicon-container active")}else i.warn("Brobench app iframe was not found while toggling popup",{url:location.href})}}var Xe=0;function Ve(e,t){window.postMessage({type:"SHOW_SFDC_TOAST",title:e,message:t},"*")}function Ro(){const e=document.createElement("script");e.src=W().getRuntime().getURL("/src/pages/app/toast-injector.js"),e.type="text/javascript",(document.head||document.documentElement).appendChild(e),e.onload=()=>{e.remove()}}try{Ro()}catch(e){i.error("Error injecting Toast Script",e)}window.addEventListener("message",e=>{e.data?.type==="BB_HIDE_PAGE_POPUP"&&A(!0).catch(t=>i.warn("Error closing page popup from iframe message",t))});async function Et(e=!0){if(new Date().getTime()-Xe<500)return;Xe=new Date().getTime();const t=await j("bb-recordeditiframe-container");if(!t){i.warn("Brobench record editor container was not found while opening record editor",{url:location.href});return}if(t.className.includes("active")){await A();return}e?await A():await _e();let n=$t(location.href);if(!n){x||await xt(location.href);const a=it(location.href),s=x?.connUsername?De(x.connUsername):De(a.username||"");n=nn(a.actualUrlObj.path,s?.userId)?.recordId}if(!n){Ve("Brobench","Could not find Record Id in the URL. Please open a record page and try again.");return}const r=W().getRuntime().getURL("src/pages/recEdit.html?")+`#recordId=${n}&conn=${x?.connUsername}&t=${Date.now()}`,o=S("bb-recordedit-iframe");o?(o.onload=()=>{o.contentWindow?.postMessage({type:"INIT_REC_EDIT",conn:x.connUsername},"*")},t.className="bb-recordeditiframe-container active",o.src=r):i.warn("Brobench record editor iframe was not found while opening record editor",{url:location.href})}async function _e(){const e=await j("bb-recordeditiframe-container");e&&(e.className="bb-recordeditiframe-container")}async function A(e=!0){if(e){const t=S("bb-appiframe");if(t&&t.style.display==="block"){const n=await j("bb-appicon-container");n?n.className="bb-appicon-container":i.warn("Brobench app launcher container was not found while closing popup",{url:location.href}),t.style.display="none"}}await _e(),document.dispatchEvent(new CustomEvent("bb-close-commandpalette"))}function Bo(e,t){const n=`data-${t}`,r=e.currentTarget;if(r?.getAttribute){const a=r.getAttribute(n);if(a)return a}const o=e.target;if(o?.closest){const a=o.closest(`[${n}]`)?.getAttribute(n);if(a)return a}}async function Fo(){await A(),i.debug("Opening Brobench in full screen");const e=Pe(location.href);window.open(e,"brobench")?.focus()}async function To(){try{const e=(await re({url:location.href,type:"getDesktopOpenUrl",value:{connUsername:x?.connUsername}}))?.url;if(!e){Ve("Brobench","Could not build desktop deep link URL.");return}window.open(e,"_blank")?.focus()}catch(e){Ve("Brobench",e?.message||"Failed to open desktop app.")}}async function Uo(e){const t=Bo(e,"action");if(i.debug("Coming to secondary app icon click handler",t),t==="editRecord"){if((await j("bb-recordeditiframe-container")).className.includes("active")){await A();return}await A(),await Et(!1);return}if(t==="toggleQuickSearch"){const n=!!document.querySelector(".bb-commandpalette-container .bb-search");await A(),n||document.dispatchEvent(new CustomEvent("bb-toggle-commandpalette"));return}await A(),t==="openFullScreen"?Fo():t==="openInDesktopApp"?await To():t==="toggleFieldApiNames"?Tt():t==="toggleLwcApiNames"&&Jn({getActions:Ft})}async function Mo(e){try{if(e.searchControlEnabled){const t=U(void 0,"div",{id:"bb-commandpalette-container","data-username":e.connUsername});document.body.insertBefore(t,document.body.firstChild),at(Tn,{shortcut:e.shortcutOpenCommandPalette}).mount("#bb-commandpalette-container")}}catch(t){i.warn("Error injecting Quick Searcher",t)}}async function Wo(e){try{const t=U(void 0,"div",{id:"bb-recordeditor-app","data-username":e.connUsername});document.body.insertBefore(t,document.body.firstChild),at(xo,{shortcut:""}).mount("#bb-recordeditor-app")}catch(t){i.warn("Error injecting Record Editor",t)}}function jo(e){const t=document.getElementById("brobench-tooltip");if(!t)return;const n=e.currentTarget,r=n?.getAttribute("data-tooltip")?.trim();if(!r){t.style.display="none";return}t.textContent=r,t.style.display="block";const o=n.getBoundingClientRect(),a=t.getBoundingClientRect(),s=8;let d=o.left-a.width-s,u=o.top+(o.height-a.height)/2;d<s&&(d=o.right+s);const v=window.innerWidth-a.width-s,E=window.innerHeight-a.height-s;d=Math.max(s,Math.min(d,v)),u=Math.max(s,Math.min(u,E)),t.style.left=`${d}px`,t.style.top=`${u}px`}function _o(){const e=document.getElementById("brobench-tooltip");e&&(e.style.display="none")}var Ce,me,V,Ne=!1,T=625,At=725,Lt=175,xe,H,Qe=!1,Ke=!1,Y=0,No=5,Ye=1e3;function Vt(){const e=x?.pagePopupMode;return e==="Default"?"Side":e==="New Tab"?"Full Page":e||"Side"}function St(){const e=S("bb-appiframe");if(!(!e||!V)){if(Vt()==="Center"){V.style.right="auto",V.style.left="50%",V.style.top="50%",V.style.transform="translate(-50%, -50%)",e.style.width="90vw",e.style.height="90vh",e.style.maxWidth="1600px",e.style.maxHeight="1200px";return}V.style.right="25px",V.style.left="auto",V.style.top=`${Lt}px`,V.style.transform="none",e.style.width=`${At}px`,e.style.height=`${T}px`,e.style.maxWidth="",e.style.maxHeight=""}}function It(e){Ne&&me&&e.clientY>=0&&e.clientY<=window.innerHeight-50&&(me.style.top=e.clientY+"px",e.clientY+T<window.innerHeight&&(V.style.top=e.clientY+"px"))}async function Rt(){Ne=!1,window.removeEventListener("mousemove",It),window.removeEventListener("mouseup",Rt);try{await re({url:location.href,type:"updateAppIconPosition",value:{popupPositionTop:me.style.top}})}catch(e){i.warn("Error updating popup icon position",e)}}function Zo(e){e.button===0&&(e.preventDefault(),e.stopPropagation(),Ne=!0,window.addEventListener("mousemove",It),window.addEventListener("mouseup",Rt))}function Po(){Ce=document.querySelector(".bb-appicon-draghandle"),me=document.querySelector(".bb-appicon-container"),V=document.querySelector(".bb-appiframe-container"),Ce?Ce.addEventListener("mousedown",Zo):i.warn("Brobench app launcher drag handle was not found after injection",{url:location.href})}function Oo(){const e=S("bb-appicon");if(e){const n=e.cloneNode(!0);e.parentNode.replaceChild(n,e),i.debug("Attaching app launcher click handler"),n.addEventListener("click",Le)}else i.warn("Brobench app launcher icon was not found after injection",{url:location.href});const t=document.querySelectorAll(".bb-appicon-hidden");t.length||i.warn("Brobench secondary app launcher icons were not found after injection",{url:location.href});for(const n of t)n.addEventListener("mousemove",jo),n.addEventListener("mouseout",_o),n.addEventListener("click",Uo);return!!e}function $o(e){Qe||(e.shortcutOpenPopup&&$.addKeyHandler2("OpenPopup",e.shortcutOpenPopup,Le),e.shortcutEditRecord&&$.addKeyHandler2("EditRecord",e.shortcutEditRecord,Et),e.shortcutOpenPopupFullPage&&$.addKeyHandler2("OpenPopupFullPage",e.shortcutOpenPopupFullPage,()=>Le({type:"click",metaKey:!0})),Qe=!0)}function Ho(e){if(!xe){if(!document.documentElement){i.warn("Brobench app launcher observer could not start because document.documentElement is not available",{url:location.href});return}xe=new MutationObserver(()=>{document.getElementById("bb-app")||(H&&window.clearTimeout(H),H=window.setTimeout(()=>{document.getElementById("bb-app")||(i.warn("Brobench app launcher disappeared from the page, reinjecting",{url:location.href}),Ze(e,"observer").catch(t=>i.warn("Error reinjecting App Launcher",t)))},500))}),xe.observe(document.documentElement,{childList:!0,subtree:!0})}}function Do(){return!!document.getElementById("bb-appicon")&&!!document.querySelector(".bb-appicon-container")&&!!document.getElementById("bb-appiframe")}function ue(e,t){if(Y>=No){i.warn(`Brobench app launcher retry limit reached after ${Y} attempts. Last reason: ${t}`,{url:location.href});return}Y+=1,H&&window.clearTimeout(H),i.warn(`Brobench app launcher was not added, retrying in ${Ye}ms. Reason: ${t}`,{attempt:Y,url:location.href}),H=window.setTimeout(()=>{Ze(e,t).catch(n=>i.warn("Error retrying App Launcher injection",n))},Ye)}async function Ze(e,t){try{if(!e.popupLauncherEnabled)return;if(en(location.href,"sfdcIFrameOrigin=")){i.debug("Inside sfdcIFrameOrigin hence not injecting App launcher icon",location.href);return}if(!document.body){i.warn("Brobench app launcher could not be injected because document.body is not available",{url:location.href}),ue(e,"document.body not available");return}let n=e.popupPositionTop??175;n<=0&&(n=0),n>=window.innerHeight-50&&(n=window.innerHeight-50);let r=e.popupWidth||725;T=e.popupHeight||625,T+50>window.innerHeight&&(T=window.innerHeight-50);let o=n;o+T>window.innerHeight&&(o=window.innerHeight-T-2),At=r,Lt=o;let a=F(ln,"iframeUrl",W().getRuntime().getURL("src/pages/app.html")+"?bbAppMode=iframe");a=F(a,"recEditIframeUrl",W().getRuntime().getURL("src/pages/recEdit.html")+"?bbAppMode=iframe"),a=F(a,"popupIconPositionTop",n+"px"),a=F(a,"popupPositionTop",o+"px"),a=F(a,"popupWidth",r+"px"),a=F(a,"popupHeight",T+"px"),a=F(a,"popupQuickSearcherTooltip",`Toggle Quick Searcher${e.shortcutOpenCommandPalette?" ("+He(e.shortcutOpenCommandPalette)+")":""}`),a=F(a,"popupEditRecordTooltip",`Edit Current Record${e.shortcutEditRecord?" ("+He(e.shortcutEditRecord)+")":""}`);const s=new DOMParser().parseFromString(a,"text/html").body.firstElementChild;if(!s){i.warn("Brobench app launcher template did not produce an element",{url:location.href}),ue(e,"template parse failed");return}ge("bb-app"),document.body.append(s);const d=Oo();if(window.navigation&&!Ke&&(window.navigation.addEventListener("navigate",()=>qo()),Ke=!0),Po(),St(),e.openInDesktopEnabled||document.getElementById("brobench-appicon-open-desktop")?.remove(),$o(e),Ho(e),!d||!Do()){ue(e,t||"required launcher elements missing");return}Y=0}catch(n){i.warn("Error injecting App Launcher",n),ue(e,n?.message||"injection error")}}function qo(){const e=S("bb-appiframe");e&&e.style.display==="block"&&setTimeout(()=>{e.src=Pe(location.href)},100)}function Pe(e){const t=new URL(W().getRuntime().getURL("src/pages/app.html"));return t.searchParams.set("source","pagepopup"),x?.connUsername&&t.searchParams.set("sfdcUsername",x.connUsername),t.hash=`sfdcUrl=${encodeURIComponent(e)}`,t.toString()}var ke={};async function Xo(e){if(!e)return{};const t=e.toLowerCase();if(!ke[t]){const n=await re({url:location.href,type:"getSobject",value:{sobjName:e,domain:oe(location.href),username:x?.connUsername}});if(n){const r={};for(const o of n.fields)r[o.nameLower]=o;ke[t]=r}}return ke[t]||{}}function ie(e,t){const n=document.createElement("span");n.className="bb-icon-tooltip",n.innerText=t,n.style.width="max-content",e.appendChild(n),e.title=t}function Qo(e){const t=document.createElement("span");return t.className="bb-field-info-copy-icon",t.innerHTML=`
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
  `,ie(t,"Copy Name"),t.addEventListener("click",n=>{n.stopPropagation(),navigator.clipboard.writeText(e).then(()=>{const r=t.innerHTML;t.innerHTML=`
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8L6 11L13 4" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,setTimeout(()=>{t.innerHTML=r},1e3)}).catch(r=>{i.error("Failed to copy API name",r)})}),t}function Ko(e,t,n,r){const o=document.createElement("span");return o.className="bb-field-info-brobench-icon",o.innerHTML=`
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 3H13V5M13 3L8 8M13 8V13H3V3H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,ie(o,"Open in Brobench"),o.addEventListener("click",a=>{a.stopPropagation();const s=oe(location.href),d=W().getRuntime().getURL("src/pages/app.html"),u=encodeURIComponent(x?.connUsername||""),v=r?"object-link":"field-link";let E;if(r)E=`${d}?username=${u}&source=${v}#sfdcUrl=${encodeURIComponent(`https://${s}/lightning/setup/ObjectManager/${e}/FieldsAndRelationships/view`)}&sobjName=${e}`;else{const R=lt(e,n?.Id||"",n?.relationshipName,n?.custom);E=`${d}?username=${u}&source=${v}#sfdcUrl=${encodeURIComponent(`https://${s}/lightning/setup/ObjectManager/${t.sobjName}/FieldsAndRelationships/view`)}&sobjName=${t.sobjName}&field=${R}`}window.open(E,"_blank")?.focus()}),o}function Yo(e,t,n,r){const o=document.createElement("span");return o.className="bb-field-info-sfdc-icon",o.innerHTML=`
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3C5.5 3 4.5 4 4.5 5C4.5 5.2 4.52 5.4 4.55 5.6C3.3 5.9 2.5 7 2.5 8.5C2.5 10.2 3.8 11.5 5.5 11.5H11.5C13.2 11.5 14.5 10.2 14.5 8.5C14.5 7 13.7 5.9 12.45 5.6C12.48 5.4 12.5 5.2 12.5 5C12.5 4 11.5 3 10 3C9 3 8.2 3.4 7.7 4C7.3 3.4 6.5 3 5.5 3H7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,ie(o,"Open in Setup UI"),o.addEventListener("click",a=>{a.stopPropagation();const s=oe(location.href);let d;if(r)d=`https://${s}/lightning/setup/ObjectManager/${e}/FieldsAndRelationships/view`;else{const u=lt(e,n?.Id||"",n?.relationshipName,n?.custom);d=tn(s,t.sobjName,u,n?.Id||"")}window.open(d,"_blank")?.focus()}),o}function Bt(){const e=`https://${oe(location.href)}/lightning/setup/LightningComponentBundles/home`;window.open(e,"_blank")?.focus()}function zo(e){const t=document.createElement("span");return t.className="bb-field-info-sfdc-icon",t.innerHTML=`
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3C5.5 3 4.5 4 4.5 5C4.5 5.2 4.52 5.4 4.55 5.6C3.3 5.9 2.5 7 2.5 8.5C2.5 10.2 3.8 11.5 5.5 11.5H11.5C13.2 11.5 14.5 10.2 14.5 8.5C14.5 7 13.7 5.9 12.45 5.6C12.48 5.4 12.5 5.2 12.5 5C12.5 4 11.5 3 10 3C9 3 8.2 3.4 7.7 4C7.3 3.4 6.5 3 5.5 3H7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,ie(t,"Open LWC Setup"),t.addEventListener("click",n=>{n.stopPropagation(),Bt()}),t.setAttribute("data-component-name",e),t}function Ft(e){const t=gt(e);return[{tooltip:"Copy Name",createIcon:()=>`
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        `,onClick:n=>{n.stopPropagation(),navigator.clipboard.writeText(t).catch(r=>i.error("Failed to copy LWC name",r))}},{tooltip:"Open LWC Setup",createIcon:()=>zo(e).innerHTML,onClick:n=>{n.stopPropagation(),Bt()}}]}function Go(){const e=`https://${oe(location.href)}/lightning/setup/Flows/home`;window.open(e,"_blank")?.focus()}function Jo(e){return[{tooltip:"Copy Name",createIcon:()=>`
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        `,onClick:t=>{t.stopPropagation(),navigator.clipboard.writeText(e).catch(n=>i.error("Failed to copy Flow name",n))}},{tooltip:"Open Flows Setup",createIcon:()=>`
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3C5.5 3 4.5 4 4.5 5C4.5 5.2 4.52 5.4 4.55 5.6C3.3 5.9 2.5 7 2.5 8.5C2.5 10.2 3.8 11.5 5.5 11.5H11.5C13.2 11.5 14.5 10.2 14.5 8.5C14.5 7 13.7 5.9 12.45 5.6C12.48 5.4 12.5 5.2 12.5 5C12.5 4 11.5 3 10 3C9 3 8.2 3.4 7.7 4C7.3 3.4 6.5 3 5.5 3H7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        `,onClick:t=>{t.stopPropagation(),Go()}}]}function er(e){return[{tooltip:"Copy Name",createIcon:()=>`
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        `,onClick:t=>{t.stopPropagation(),navigator.clipboard.writeText(e).catch(n=>i.error("Failed to copy Flexipage name",n))}}]}function ze(e,t,n,r=!1){const o=document.createElement("span");o.className="bb-field-info";const a=r?void 0:n[e.toLowerCase()],s=document.createElement("span");if(s.className="bb-field-info-text",s.innerText=e,a){const d=`${a.typeInfo}

${a.Description||""}`.trim();d&&ie(s,d)}return o.appendChild(s),o.appendChild(Qo(e)),o.appendChild(Ko(e,t,a,r)),o.appendChild(Yo(e,t,a,r)),o}async function Tt(){if(document.querySelector(".bb-field-info")||bt()||so()||On())i.debug("Hiding Field Info..."),document.querySelectorAll(".bb-field-info").forEach(e=>e.remove()),document.querySelectorAll(".bb-object-info").forEach(e=>e.remove()),mt(),lo(),$n();else{i.debug("Showing Field Info...");const e=it(location.href);if(!e.recordId||!e.sobjName)i.debug("Not in Record page so skipping field/object info and only showing LWC info...");else{const t=await Xo(e.sobjName),n=document.querySelector("records-entity-label");if(n&&!n.querySelector(".bb-object-info")&&n.textContent?.trim()){const r=ze(e.sobjName,e,t,!0);r.className="bb-object-info",n.appendChild(document.createTextNode(" ")),n.appendChild(r)}document.querySelectorAll("record_flexipage-record-field > div, records-record-layout-item > div, div .forcePageBlockItemView").forEach(r=>{let o=r.querySelector("span");if(r.dataset.targetSelectionName&&o.querySelector(".bb-field-info")==null){o.innerText=o.innerText+" ";const a=r.dataset.targetSelectionName.split(".")[2],s=ze(a,e,t,!1);o.appendChild(s)}})}wt({getActions:Ft}),co({getActions:Jo}),Hn({sobjName:e?.sobjName,getActions:er})}}function tr(){W().getRuntime().onMessage.addListener(async(e,t,n)=>{i.isDebug()&&i.debug(`Received message ${JSON.stringify(e)}`);try{const r=await ko(e);i.isDebug()&&i.debug(`Sending response ${JSON.stringify(r)}`),n(r)}catch(r){i.error("Sending error",r),n({error:r.message,stack:r.stack})}return!0})}var Se="div.slds-color__background_gray-1.slds-text-align_center.slds-size_full.slds-text-body_regular.oneSystemMessage";async function nr(e){e.alertBarColorEnabled&&e.color&&kt(Se,t=>rr(t,e.color))}var or=".navBar-container.slds-sticky.slds-top.slds-theme_default.slds-grid.slds-grid_align-spread.slds-grid_vertical-align-center";function rr(e,t){let n=document.querySelector(or);n?(n.classList.remove("navBar-container"),n.style.backgroundColor=`${t}`,[...n.querySelectorAll("p")].forEach(r=>{r.style.color="white"})):e.style.backgroundColor!==t&&(e.style.backgroundColor=t)}function ar(e){const t=e.newTab?"_blank":"_self";return`
<li role="presentation" class="oneConsoleTabItem tabItem slds-context-bar__item borderRight navexConsoleTabItem" data-aura-class="navexConsoleTabItem" data-bb-shortcut="true" data-url="${e.path}" data-newtab="${e.newTab?"true":"false"}">
  <a role="tab" tabindex="-1" title="${e.name}" aria-selected="false" href="${e.path}" target="${t}" class="tabHeader slds-context-bar__label-action">
    <span class="title slds-truncate">${e.name}</span>
  </a>
</li>`}function ir(e){const t=new URL(e,location.href);if(ne(location.href)||ne(t.toString())){window.open(t.toString(),"_top");return}const n=t.pathname+t.search+t.hash;sr(n,t.toString()),document.dispatchEvent(new CustomEvent("bbLightningNavigate",{detail:{url:n,fallbackURL:t.toString()},bubbles:!0,composed:!0})),document.dispatchEvent(new CustomEvent("lightningNavigate",{detail:{navigationType:"url",url:n,fallbackURL:t.toString()},bubbles:!0,composed:!0})),window.postMessage({type:"BB_LIGHTNING_NAVIGATE",url:n,fallbackURL:t.toString()},"*")}function sr(e,t){const n=document.createElement("script"),r=JSON.stringify(e.startsWith("/")?e:`/${e}`),o=JSON.stringify(t);n.textContent=`
    (() => {
      try {
        const navUrl = ${r};
        const fallbackURL = ${o};
        if (typeof window.$A !== 'undefined' && window.$A.get) {
          const e = window.$A.get('e.force:navigateToURL');
          if (e) {
            e.setParams({url: navUrl});
            e.fire();
            return;
          }
        }
        if (window.sforce && window.sforce.one && window.sforce.one.navigateToURL) {
          window.sforce.one.navigateToURL(navUrl);
          return;
        }
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', navUrl);
          window.dispatchEvent(new PopStateEvent('popstate'));
          return;
        }
        window.open(fallbackURL, '_top');
      } catch (_e) {
        window.open(${o}, '_top');
      }
    })();
  `,(document.head||document.documentElement).appendChild(n),n.remove()}async function lr(e){try{if(!e.pinnedShortcuts||!e.pinnedShortcuts?.length||location.href.indexOf("/lightning/setup/")<=0)return;try{await Xt("Setup Tab Bar",30,1e3,()=>document.getElementsByClassName("tabBarItems slds-grid")[0]);const t=e.pinnedShortcuts.map(r=>ar(r)),n=document.getElementsByClassName("tabBarItems slds-grid")[0];n.insertAdjacentHTML("beforeend",t.join("")),n.dataset.bbPinnedDelegatedClick||(n.dataset.bbPinnedDelegatedClick="true",n.addEventListener("click",r=>{const o=r,a=o.target?.closest('li[data-bb-shortcut="true"][data-url] a');if(!a)return;const s=a.closest('li[data-bb-shortcut="true"][data-url]');if(!s)return;const d=s.getAttribute("data-url")||"",u=s.getAttribute("data-newtab")==="true";if(!d||u||o.metaKey||o.ctrlKey||o.button===1)return;o.preventDefault(),o.stopPropagation();const v=new URL(d,location.href);v.pathname.startsWith("/lightning")?ir(v.toString()):window.open(v.toString(),"_self")}))}catch(t){i.error(`Error injecting Pinned Shortcuts. ${t.message}`,t)}}catch(t){i.warn("Error injecting Pinned Shortcuts",t)}}async function L(e,t){try{await t()}catch(n){i.error(`Error during init step [${e}]. ${n.message}`,n,{url:location.href})}}function cr(e){return{enabled:!!e?.enabled,popupLauncherEnabled:!!e?.popupLauncherEnabled,body:!!document.body,documentElement:!!document.documentElement,appRoot:!!document.getElementById("bb-app"),appIcon:!!document.getElementById("bb-appicon"),appIconContainer:!!document.querySelector(".bb-appicon-container"),appIframe:!!document.getElementById("bb-appiframe"),recordEditorApp:!!document.getElementById("bb-recordeditor-app"),commandPaletteContainer:!!document.getElementById("bb-commandpalette-container")}}function Ge(e,t="injected"){const n=cr(e),r=Object.entries(n).map(([a,s])=>`${a}=${s}`).join(" "),o=e?.message?` message="${e.message}"`:"";i.info(`Brobench Injected status=${t} ${r}${o}`,{url:location.href,connUsername:e?.connUsername,orgTabMessage:e?.message})}async function dr(){i.debug("Coming to inject OrgTab..."),await L("keyboardManager.Mount",()=>$.Mount()),await L("registerForMessages",()=>tr());let e;try{e=await xt(location.href)}catch(t){i.error(`Error during init step [getOrgTab]. ${t.message}`,t,{url:location.href});return}if(!e||!e.enabled){i.info("Brobench injection skipped because OrgTab is not enabled",{url:location.href,orgTabMessage:e?.message,enabled:!!e?.enabled,popupLauncherEnabled:!!e?.popupLauncherEnabled,connUsername:e?.connUsername}),Ge(e,"skipped");return}await L("injectAlertBarColor",()=>nr(e)),await L("injectHeaderBanner",()=>Lo(e)),await L("injectTabIcon",()=>Vo(e)),await L("injectTabPrefix",()=>So(e)),await L("injectConnNameBox",()=>Io(e)),await L("injectAppLauncher",()=>Ze(e)),await L("injectSearchControl",()=>Mo(e)),await L("injectRecordEditor",()=>Wo(e)),await L("injectPinnedShortcuts",()=>lr(e)),Ge(e)}function pr(){return!!S("theloginform")}sn()||(pr()?Ao().catch(e=>{const t=`Error injecting Brobench login [${e.message}]`;Ct(t),i.error(t,e)}):dr().then(()=>i.debug("OrgTab injection is complete")).catch(e=>i.error(`Error injecting Org tab ${e.message}`,e)));
