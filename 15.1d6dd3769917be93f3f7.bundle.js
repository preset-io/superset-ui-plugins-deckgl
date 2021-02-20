(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{1087:function(e,t,o){"use strict";o.r(t),o.d(t,"getLayer",(function(){return h}));var a=o(1267),r=o(1),i=o.n(r),n=o(25),s=o(962),l=o(971),c=o(964);function p(){return(p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e}).apply(this,arguments)}function h(e,t,o,r){const l=t.data.features,h=e.color_picker,u=e.target_color_picker;return new a.a(p({data:l,getSourceColor:e=>e.sourceColor||e.color||[h.r,h.g,h.b,255*h.a],getTargetColor:e=>e.targetColor||e.color||[u.r,u.g,u.b,255*u.a],id:"path-layer-"+e.slice_id,strokeWidth:e.stroke_width?e.stroke_width:3},Object(s.a)(e,r,(d=e,e=>i.a.createElement("div",{className:"deckgl-tooltip"},i.a.createElement(c.a,{label:Object(n.b)("Start (Longitude, Latitude)")+": ",value:e.object.sourcePosition[0]+", "+e.object.sourcePosition[1]}),i.a.createElement(c.a,{label:Object(n.b)("End (Longitude, Latitude)")+": ",value:e.object.targetPosition[0]+", "+e.object.targetPosition[1]}),d.dimension&&i.a.createElement(c.a,{label:d.dimension+": ",value:""+e.object.cat_color}))))));var d}t.default=Object(l.a)(h,(function(e){const t=[];return e.forEach(e=>{t.push(e.sourcePosition),t.push(e.targetPosition)}),t}))},971:function(e,t,o){"use strict";var a=o(1),r=o.n(a),i=o(0),n=o.n(i),s=o(287),l=o(970),c=o(471),p=o(976),h=o(972),u=o(965),d=o(975),g=o(956),f=o(968);function m(){return(m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e}).apply(this,arguments)}function b(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}const{getScale:y}=c.a;const w={formData:n.a.object.isRequired,mapboxApiKey:n.a.string.isRequired,setControlValue:n.a.func.isRequired,viewport:n.a.object.isRequired,getLayer:n.a.func.isRequired,getPoints:n.a.func.isRequired,payload:n.a.object.isRequired,onAddFilter:n.a.func,width:n.a.number.isRequired,height:n.a.number.isRequired};class v extends r.a.PureComponent{constructor(e){super(e),b(this,"containerRef",r.a.createRef()),b(this,"setTooltip",e=>{const{current:t}=this.containerRef;t&&t.setTooltip(e)}),this.state=this.getStateFromProps(e),this.getLayers=this.getLayers.bind(this),this.onValuesChange=this.onValuesChange.bind(this),this.toggleCategory=this.toggleCategory.bind(this),this.showSingleCategory=this.showSingleCategory.bind(this)}UNSAFE_componentWillReceiveProps(e){e.payload.form_data!==this.state.formData&&this.setState(m({},this.getStateFromProps(e)))}onValuesChange(e){this.setState({values:Array.isArray(e)?e:[e,e+this.state.getStep(e)]})}getStateFromProps(e,t){const o=e.payload.data.features||[],a=o.map(e=>e.__timestamp),r=function(e,t){const o=e.color_picker||{r:0,g:0,b:0,a:1},a=[o.r,o.g,o.b,255*o.a],r=y(e.color_scheme),i={};return t.forEach(t=>{if(null!=t.cat_color&&!i.hasOwnProperty(t.cat_color)){let n;n=e.dimension?Object(u.hexToRGB)(r(t.cat_color),255*o.a):a,i[t.cat_color]={color:n,enabled:!0}}}),i}(e.formData,o);if(t&&e.payload.form_data===t.formData)return m({},t,{categories:r});const i=e.payload.form_data.time_grain_sqla||e.payload.form_data.granularity||"P1D",{start:n,end:s,getStep:l,values:c,disabled:p}=Object(d.a)(a,i),{width:h,height:g,formData:b}=e;let{viewport:w}=e;return b.autozoom&&(w=Object(f.a)(w,{width:h,height:g,points:e.getPoints(o)})),{start:n,end:s,getStep:l,values:c,disabled:p,viewport:w,selected:[],lastClick:0,formData:e.payload.form_data,categories:r}}getLayers(e){const{getLayer:t,payload:o,formData:a,onAddFilter:r}=this.props;let i=o.data.features?[...o.data.features]:[];if(i=this.addColor(i,a),a.js_data_mutator){i=Object(g.a)(a.js_data_mutator)(i)}i=e[0]===e[1]||e[1]===this.end?i.filter(t=>t.__timestamp>=e[0]&&t.__timestamp<=e[1]):i.filter(t=>t.__timestamp>=e[0]&&t.__timestamp<e[1]);const n=this.state.categories;return a.dimension&&(i=i.filter(e=>n[e.cat_color]&&n[e.cat_color].enabled)),[t(a,m({},o,{data:m({},o.data,{features:i})}),r,this.setTooltip)]}addColor(e,t){const o=t.color_picker||{r:0,g:0,b:0,a:1},a=y(t.color_scheme);return e.map(e=>{let r;return t.dimension?(r=Object(u.hexToRGB)(a(e.cat_color),255*o.a),m({},e,{color:r})):e})}toggleCategory(e){const t=this.state.categories[e],o=m({},this.state.categories,{[e]:m({},t,{enabled:!t.enabled})});Object.values(o).every(e=>!e.enabled)&&Object.values(o).forEach(e=>{e.enabled=!0}),this.setState({categories:o})}showSingleCategory(e){const t=m({},this.state.categories);Object.values(t).forEach(e=>{e.enabled=!1}),t[e].enabled=!0,this.setState({categories:t})}render(){return r.a.createElement("div",{style:{position:"relative"}},r.a.createElement(p.a,{ref:this.containerRef,getLayers:this.getLayers,start:this.state.start,end:this.state.end,getStep:this.state.getStep,values:this.state.values,disabled:this.state.disabled,viewport:this.state.viewport,mapboxApiAccessToken:this.props.mapboxApiKey,mapStyle:this.props.formData.mapbox_style,setControlValue:this.props.setControlValue,width:this.props.width,height:this.props.height},r.a.createElement(h.a,{categories:this.state.categories,toggleCategory:this.toggleCategory,showSingleCategory:this.showSingleCategory,position:this.props.formData.legend_position,format:this.props.formData.legend_format})))}}function C(){return(C=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e}).apply(this,arguments)}function _(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}v.propTypes=w,o.d(t,"b",(function(){return O})),o.d(t,"a",(function(){return R}));const S={formData:n.a.object.isRequired,payload:n.a.object.isRequired,setControlValue:n.a.func.isRequired,viewport:n.a.object.isRequired,onAddFilter:n.a.func,width:n.a.number.isRequired,height:n.a.number.isRequired},j={onAddFilter(){}};function O(e,t){class o extends r.a.PureComponent{constructor(e){super(e),_(this,"containerRef",r.a.createRef()),_(this,"setTooltip",e=>{const{current:t}=this.containerRef;t&&t.setTooltip(e)});const{width:o,height:a,formData:i}=e;let{viewport:n}=e;i.autozoom&&(n=Object(f.a)(n,{width:o,height:a,points:t(e.payload.data.features)})),this.state={viewport:n,layer:this.computeLayer(e)},this.onViewportChange=this.onViewportChange.bind(this)}UNSAFE_componentWillReceiveProps(e){const t=C({},e.formData,{viewport:null}),o=C({},this.props.formData,{viewport:null});Object(s.isEqual)(t,o)&&e.payload===this.props.payload||this.setState({layer:this.computeLayer(e)})}onViewportChange(e){this.setState({viewport:e})}computeLayer(t){const{formData:o,payload:a,onAddFilter:r}=t;return e(o,a,r,this.setTooltip)}render(){const{formData:e,payload:t,setControlValue:o,height:a,width:i}=this.props,{layer:n,viewport:s}=this.state;return r.a.createElement(l.a,{ref:this.containerRef,mapboxApiAccessToken:t.data.mapboxApiKey,viewport:s,layers:[n],mapStyle:e.mapbox_style,setControlValue:o,width:i,height:a,onViewportChange:this.onViewportChange})}}return o.propTypes=S,o.defaultProps=j,o}function R(e,t){function o(o){const{formData:a,payload:i,setControlValue:n,viewport:s,width:l,height:c}=o;return r.a.createElement(v,{formData:a,mapboxApiKey:i.data.mapboxApiKey,setControlValue:n,viewport:s,getLayer:e,payload:i,getPoints:t,width:l,height:c})}return o.propTypes=S,o.defaultProps=j,o}},972:function(e,t,o){"use strict";o.d(t,"a",(function(){return c}));var a=o(1),r=o.n(a),i=o(0),n=o.n(i),s=o(1021);o(973);const l={categories:n.a.object,toggleCategory:n.a.func,showSingleCategory:n.a.func,format:n.a.string,position:n.a.oneOf([null,"tl","tr","bl","br"])};class c extends r.a.PureComponent{format(e){if(!this.props.format)return e;const t=parseFloat(e);return Object(s.a)(this.props.format,t)}formatCategoryLabel(e){if(!this.props.format)return e;if(e.includes(" - ")){const t=e.split(" - ");return this.format(t[0])+" - "+this.format(t[1])}return this.format(e)}render(){if(0===Object.keys(this.props.categories).length||null===this.props.position)return null;const e=Object.entries(this.props.categories).map(e=>{let[t,o]=e;const a={color:"rgba("+o.color.join(", ")+")"},i=o.enabled?"◼":"◻";return r.a.createElement("li",{key:t},r.a.createElement("a",{href:"#",onClick:()=>this.props.toggleCategory(t),onDoubleClick:()=>this.props.showSingleCategory(t)},r.a.createElement("span",{style:a},i)," ",this.formatCategoryLabel(t)))}),t={position:"absolute",["t"===this.props.position.charAt(0)?"top":"bottom"]:"0px",["r"===this.props.position.charAt(1)?"right":"left"]:"10px"};return r.a.createElement("div",{className:"legend",style:t},r.a.createElement("ul",{className:"categories"},e))}}c.propTypes=l,c.defaultProps={categories:{},toggleCategory:()=>{},showSingleCategory:()=>{},format:null,position:"tr"}},973:function(e,t,o){var a=o(466),r=o(974);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1},n=(a(r,i),r.locals?r.locals:{});e.exports=n},974:function(e,t,o){(t=o(467)(!1)).push([e.i,'/**\n * Licensed to the Apache Software Foundation (ASF) under one\n * or more contributor license agreements.  See the NOTICE file\n * distributed with this work for additional information\n * regarding copyright ownership.  The ASF licenses this file\n * to you under the Apache License, Version 2.0 (the\n * "License"); you may not use this file except in compliance\n * with the License.  You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing,\n * software distributed under the License is distributed on an\n * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n * KIND, either express or implied.  See the License for the\n * specific language governing permissions and limitations\n * under the License.\n */\ndiv.legend {\n  font-size: 90%;\n  position: absolute;\n  background: #fff;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);\n  margin: 24px;\n  padding: 12px 20px;\n  outline: none;\n  overflow-y: scroll;\n  max-height: 200px;\n}\n\nul.categories {\n  list-style: none;\n  padding-left: 0;\n  margin: 0;\n}\n\nul.categories li a {\n  color: rgb(51, 51, 51);\n  text-decoration: none;\n}\n\nul.categories li a span {\n  margin-right: 10px;\n}\n',""]),e.exports=t}}]);