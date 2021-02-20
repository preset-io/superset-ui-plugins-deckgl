(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{1004:function(e,t,i){"use strict";var a,n=i(951),r=i(954),o=i(945),s=i(946),u=i(1294),g=i(1280),l=i(1281),c=i(1191),f=i(994),d=i(1272),h=i(1136),v=i(1291),m=i(1283),p=i(966),x=i(1054),M=i(982),w={dataChanged:!0,viewportChanged:!0,cellSizeChanged:!0},b={changeFlags:w,projectPoints:!1,useGPU:!0,fp64:!1,viewport:null,gridTransformMatrix:null,createBufferObjects:!0},A=[32775,32774],y=[32776,32774],C=[32776,32775],S=(a={},Object(n.a)(a,M.a.SUM,32774),Object(n.a)(a,M.a.MEAN,32774),Object(n.a)(a,M.a.MIN,A),Object(n.a)(a,M.a.MAX,y),a),P={size:1,operation:M.a.SUM,needMin:!1,needMax:!1,combineMaxMin:!1},j=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],z="#define SHADER_NAME gpu-aggregation-to-grid-vs\n\nattribute vec2 positions;\nattribute vec3 weights;\nuniform vec2 windowSize;\nuniform vec2 cellSize;\nuniform vec2 gridSize;\nuniform mat4 uProjectionMatrix;\nuniform bool projectPoints;\n\nvarying vec3 vWeights;\n\nvec2 project_to_pixel(vec4 pos) {\n  vec4 result =  uProjectionMatrix * pos;\n  return result.xy/result.w;\n}\n\nvoid main(void) {\n\n  vWeights = weights;\n\n  vec4 windowPos = vec4(positions, 0, 1.);\n  if (projectPoints) {\n    windowPos = project_position_to_clipspace(vec3(positions, 0), vec2(0, 0), vec3(0, 0, 0));\n  }\n\n  vec2 pos = project_to_pixel(windowPos);\n  pos = floor(pos / cellSize);\n  pos = (pos * (2., 2.) / (gridSize)) - (1., 1.);\n  vec2 offset = 1.0 / gridSize;\n  pos = pos + offset;\n\n  gl_Position = vec4(pos, 0.0, 1.0);\n}\n",T="#define SHADER_NAME gpu-aggregation-to-grid-vs-64\n\nattribute vec2 positions;\nattribute vec2 positions64xyLow;\nattribute vec3 weights;\nuniform vec2 windowSize;\nuniform vec2 cellSize;\nuniform vec2 gridSize;\nuniform vec2 uProjectionMatrixFP64[16];\nuniform bool projectPoints;\n\nvarying vec3 vWeights;\n\nvoid project_to_pixel(vec2 pos, vec2 pos64xyLow, out vec2 pixelXY64[2]) {\n\n  vec2 result64[4];\n  vec2 position64[4];\n  position64[0] = vec2(pos.x, pos64xyLow.x);\n  position64[1] = vec2(pos.y, pos64xyLow.y);\n  position64[2] = vec2(0., 0.);\n  position64[3] = vec2(1., 0.);\n  mat4_vec4_mul_fp64(uProjectionMatrixFP64, position64,\n  result64);\n\n  pixelXY64[0] = div_fp64(result64[0], result64[3]);\n  pixelXY64[1] = div_fp64(result64[1], result64[3]);\n}\n\nvoid main(void) {\n\n  vWeights = weights;\n\n  vec2 windowPos = positions;\n  vec2 windowPos64xyLow = positions64xyLow;\n  if (projectPoints) {\n    vec2 projectedXY[2];\n    project_position_fp64(windowPos, windowPos64xyLow, projectedXY);\n    windowPos.x = projectedXY[0].x;\n    windowPos.y = projectedXY[1].x;\n    windowPos64xyLow.x = projectedXY[0].y;\n    windowPos64xyLow.y = projectedXY[1].y;\n  }\n\n  vec2 pixelXY64[2];\n  project_to_pixel(windowPos, windowPos64xyLow, pixelXY64);\n  vec2 gridXY64[2];\n  gridXY64[0] = div_fp64(pixelXY64[0], vec2(cellSize.x, 0));\n  gridXY64[1] = div_fp64(pixelXY64[1], vec2(cellSize.y, 0));\n  float x = floor(gridXY64[0].x);\n  float y = floor(gridXY64[1].x);\n  vec2 pos = vec2(x, y);\n  pos = (pos * (2., 2.) / (gridSize)) - (1., 1.);\n  vec2 offset = 1.0 / gridSize;\n  pos = pos + offset;\n\n  gl_Position = vec4(pos, 0.0, 1.0);\n}\n",F="#define SHADER_NAME gpu-aggregation-to-grid-fs\n\nprecision highp float;\n\nvarying vec3 vWeights;\n\nvoid main(void) {\n  gl_FragColor = vec4(vWeights, 1.0);\n}\n",D=i(1085),O=i(1016);function _(e,t){var i,a=t.width,r=void 0===a?1:a,o=t.height,s=void 0===o?1:o;return new D.a(e,{data:null,format:34836,type:5126,border:0,mipmaps:!1,parameters:(i={},Object(n.a)(i,10240,9728),Object(n.a)(i,10241,9728),i),dataFormat:6408,width:r,height:s})}function B(e,t){var i=t.id,a=t.width,r=void 0===a?1:a,o=t.height,s=void 0===o?1:o,u=t.texture;return new O.a(e,{id:i,width:r,height:s,attachments:Object(n.a)({},36064,u)})}function k(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return!e||e.length<t?new Float32Array(t).fill(i):e}i.d(t,"a",(function(){return I}));var E=u.a.fp64ifyMatrix4,N=["aggregationBuffer","maxMinBuffer","minBuffer","maxBuffer"],U={maxData:"maxBuffer",minData:"minBuffer",maxMinData:"maxMinBuffer"},I=function(){function e(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Object(o.a)(this,e),this.id=i.id||"gpu-grid-aggregator",this.shaderCache=i.shaderCache||null,this.gl=t,this.state={weights:null,gridPositions:null,positionsBuffer:null,positions64xyLowBuffer:null,vertexCount:0,fp64:null,useGPU:null,numCol:0,numRow:0,windowSize:null,cellSize:null,weightAttributes:{},textures:{},meanTextures:{},buffers:{},framebuffers:{},maxMinFramebuffers:{},minFramebuffers:{},maxFramebuffers:{},equations:{},resources:{},results:{}},this._hasGPUSupport=Object(g.d)(t)&&Object(l.c)(this.gl,c.a.BLEND_EQUATION_MINMAX,c.a.COLOR_ATTACHMENT_RGBA32F,c.a.TEXTURE_FLOAT)}return Object(s.a)(e,null,[{key:"getAggregationData",value:function(e){var t=e.aggregationData,i=e.maxData,a=e.minData,n=e.maxMinData,r=4*e.pixelIndex,o={};return t&&(o.cellCount=t[r+3],o.cellWeight=t[r]),n?(o.maxCellWieght=n[0],o.minCellWeight=n[3]):(i&&(o.maxCellWieght=i[0],o.totalCount=i[3]),a&&(o.minCellWeight=a[0],o.totalCount=i[3])),o}},{key:"getCellData",value:function(e){for(var t=e.countsData,i=e.size,a=void 0===i?1:i,n=t.length/4,r=new Float32Array(n*a),o=new Uint32Array(n),s=0;s<n;s++){for(var u=0;u<a;u++)r[s*a+u]=t[4*s+u];o[s]=t[4*s+3]}return{cellCounts:o,cellWeights:r}}},{key:"isSupported",value:function(e){return Object(g.d)(e)&&Object(l.c)(e,c.a.BLEND_EQUATION_MINMAX,c.a.COLOR_ATTACHMENT_RGBA32F,c.a.TEXTURE_FLOAT)}}]),Object(s.a)(e,[{key:"delete",value:function(){var e=this.gridAggregationModel,t=this.allAggregationModel,i=this.meanTransform,a=this.state,n=a.positionsBuffer,r=a.positions64xyLowBuffer,o=a.textures,s=a.framebuffers,u=a.maxMinFramebuffers,g=a.minFramebuffers,l=a.maxFramebuffers,c=a.meanTextures,f=a.resources;e&&e.delete(),t&&t.delete(),i&&i.delete(),n&&n.delete(),r&&r.delete(),this.deleteResources([s,o,u,g,l,c,f])}},{key:"run",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.setState({results:{}});var t=this.getAggregationParams(e);this.updateGridSize(t);var i=t.useGPU;return this._hasGPUSupport&&i?this.runAggregationOnGPU(t):(i&&p.a.info("GPUGridAggregator: GPU Aggregation not supported, falling back to CPU")(),this.runAggregationOnCPU(t))}},{key:"getData",value:function(e){var t={},i=this.state.results;for(var a in i[e].aggregationData||(i[e].aggregationData=i[e].aggregationBuffer.getData()),t.aggregationData=i[e].aggregationData,U){var n=U[a];(i[e][a]||i[e][n])&&(i[e][a]=i[e][a]||i[e][n].getData(),t[a]=i[e][a])}return t}},{key:"deleteResources",value:function(e){(e=Array.isArray(e)?e:[e]).forEach((function(e){for(var t in e)e[t].delete()}))}},{key:"getAggregationParams",value:function(e){var t=Object.assign({},b,e),i=t.useGPU,a=t.gridTransformMatrix,n=t.viewport,r=t.weights,o=t.projectPoints,s=t.cellSize;return this.state.useGPU!==i&&(t.changeFlags=Object.assign({},t.changeFlags,w)),!s||this.state.cellSize&&this.state.cellSize[0]===s[0]&&this.state.cellSize[1]===s[1]||(t.changeFlags.cellSizeChanged=!0,this.setState({cellSize:s})),this.validateProps(t,e),this.setState({useGPU:i}),t.gridTransformMatrix=(o?n.viewportMatrix:a)||j,r&&(t.weights=this.normalizeWeightParams(r),this.setState({weights:t.weights})),t}},{key:"normalizeWeightParams",value:function(e){var t={};for(var i in e)t[i]=Object.assign({},P,e[i]);return t}},{key:"setState",value:function(e){Object.assign(this.state,e)}},{key:"shouldTransformToGrid",value:function(e){var t=e.projectPoints,i=e.changeFlags;return!!(!this.state.gridPositions||i.dataChanged||t&&i.viewportChanged)}},{key:"updateGridSize",value:function(e){var t=e.viewport,i=e.cellSize,a=e.width||t.width,n=e.height||t.height,r=Math.ceil(a/i[0]),o=Math.ceil(n/i[1]);this.setState({numCol:r,numRow:o,windowSize:[a,n]})}},{key:"validateProps",value:function(e,t){var i=e.changeFlags,a=e.projectPoints,n=e.gridTransformMatrix;p.a.assert(i.dataChanged||i.viewportChanged||i.cellSizeChanged),p.a.assert(!i.dataChanged||t.positions&&t.weights&&(!t.projectPositions||t.viewport)&&t.cellSize),p.a.assert(!i.cellSizeChanged||t.cellSize),p.a.assert(!(i.viewportChanged&&a)||t.viewport),a&&n&&p.a.warn("projectPoints is true, gridTransformMatrix is ignored")()}},{key:"calculateAggregationData",value:function(e){var t=e.weights,i=e.results,a=e.cellIndex,n=e.posIndex;for(var r in t){for(var o=t[r],s=o.values,u=o.size,g=o.operation,l=i[r].aggregationData,c=0;c<u;c++){var f=a+c,d=s[3*n+c];if(0===l[a+3])l[f]=d;else switch(g){case M.a.SUM:case M.a.MEAN:l[f]+=d;break;case M.a.MIN:l[f]=Math.min(l[f],d);break;case M.a.MAX:l[f]=Math.max(l[f],d);break;default:p.a.assert(!1)}}l[a+3]++}}},{key:"calculateMeanMaxMinData",value:function(e){var t=e.validCellIndices,i=e.results,a=e.weights;t.forEach((function(e){for(var t in i){for(var n=a[t],r=n.size,o=n.needMin,s=n.needMax,u=n.operation,g=i[t],l=g.aggregationData,c=g.minData,f=g.maxData,d=g.maxMinData,h=o||s,v=u===M.a.MEAN,m=o&&s&&a[t].combineMaxMin,p=l[e+4-1],x=0;x<r&&(h||v);x++){var w=e+x,b=l[w];v&&(l[w]/=p,b=l[w]),m?d[x]=Math.max(d[x],b):(o&&(c[x]=Math.min(c[x],b)),s&&(f[x]=Math.max(f[x],b)))}m?d[3]=Math.min(d[3],l[e+0]):(o&&(c[3]+=p),s&&(f[3]+=p))}}))}},{key:"initCPUResults",value:function(e){var t=e.weights||this.state.weights,i=this.state,a=i.numCol,n=i.numRow,r={};for(var o in t){var s=t[o],u=s.aggregationData,g=s.minData,l=s.maxData,c=s.maxMinData,f=t[o],d=f.needMin,h=f.needMax,v=d&&h&&t[o].combineMaxMin;u=k(u,a*n*4),v?((c=k(c,4)).fill(-1/0,0,3),c[3]=1/0):(d&&((g=k(g,4,1/0))[3]=0),h&&((l=k(l,4,-1/0))[3]=0)),r[o]=Object.assign({},t[o],{aggregationData:u,minData:g,maxData:l,maxMinData:c})}return r}},{key:"runAggregationOnCPU",value:function(e){var t,i,a=e.positions,n=e.cellSize,o=e.gridTransformMatrix,s=e.viewport,u=e.projectPoints,g=e.weights,l=this.state,c=l.numCol,f=l.numRow,d=this.initCPUResults(e),h=this.shouldTransformToGrid(e),v=[0,0,0];p.a.assert(h||e.changeFlags.cellSizeChanged),h?(i=a.length/2,t=new Float64Array(a.length),this.setState({gridPositions:t})):(t=this.state.gridPositions,g=this.state.weights,i=t.length/2);for(var m=new Set,M=0;M<i;M++){var w=void 0,b=void 0;if(h){if(v[0]=a[2*M],v[1]=a[2*M+1],u){var A=s.project(v),y=Object(r.a)(A,2);w=y[0],b=y[1]}else{var C=Object(x.k)(v,o),S=Object(r.a)(C,2);w=S[0],b=S[1]}t[2*M]=w,t[2*M+1]=b}else w=t[2*M],b=t[2*M+1];var P=Math.floor(w/n[0]),j=Math.floor(b/n[1]);if(P>=0&&P<c&&j>=0&&j<f){var z=4*(P+j*c);m.add(z),this.calculateAggregationData({weights:g,results:d,cellIndex:z,posIndex:M})}}return this.calculateMeanMaxMinData({validCellIndices:m,results:d,weights:g}),this.updateAggregationBuffers(e,d),this.setState({results:d}),d}},{key:"updateCPUResultBuffer",value:function(e){var t=e.gl,i=e.bufferName,a=e.id,n=e.data,r=e.result,o=this.state.resources,s="cpu-result-".concat(a,"-").concat(i);r[i]=r[i]||o[s],r[i]?r[i].setData({data:n}):(o[s]=new f.a(t,n),r[i]=o[s])}},{key:"updateAggregationBuffers",value:function(e,t){if(e.createBufferObjects){var i=e.weights||this.state.weights;for(var a in t){var n=t[a],r=n.aggregationData,o=n.minData,s=n.maxData,u=n.maxMinData,g=i[a],l=g.needMin,c=g.needMax,f=l&&c&&i[a].combineMaxMin;this.updateCPUResultBuffer({gl:this.gl,bufferName:"aggregationBuffer",id:a,data:r,result:t[a]}),f?this.updateCPUResultBuffer({gl:this.gl,bufferName:"maxMinBuffer",id:a,data:u,result:t[a]}):(l&&this.updateCPUResultBuffer({gl:this.gl,bufferName:"minBuffer",id:a,data:o,result:t[a]}),c&&this.updateCPUResultBuffer({gl:this.gl,bufferName:"maxBuffer",id:a,data:s,result:t[a]}))}}}},{key:"getAggregateData",value:function(e){var t={},i=this.state,a=i.textures,n=i.framebuffers,r=i.maxMinFramebuffers,o=i.minFramebuffers,s=i.maxFramebuffers,u=i.weights;for(var g in u){t[g]={};var l=u[g],c=l.needMin,f=l.needMax,h=l.combineMaxMin;t[g].aggregationTexture=a[g],t[g].aggregationBuffer=Object(d.c)(n[g],{target:u[g].aggregationBuffer,sourceType:5126}),c&&f&&h?t[g].maxMinBuffer=Object(d.c)(r[g],{target:u[g].maxMinBuffer,sourceType:5126}):(c&&(t[g].minBuffer=Object(d.c)(o[g],{target:u[g].minBuffer,sourceType:5126})),f&&(t[g].maxBuffer=Object(d.c)(s[g],{target:u[g].maxBuffer,sourceType:5126})))}return this.trackGPUResultBuffers(t,u),t}},{key:"getAggregationModel",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.gl,i=this.shaderCache;return new h.a(t,{id:"Gird-Aggregation-Model",vs:e?T:z,fs:F,modules:e?["fp64","project64"]:["project32"],shaderCache:i,vertexCount:0,drawMode:0})}},{key:"getAllAggregationModel",value:function(){var e=this.gl,t=this.shaderCache,i=this.state,a=i.numCol,n=i.numRow;return new h.a(e,{id:"All-Aggregation-Model",vs:"#version 300 es\n#define SHADER_NAME gpu-aggregation-all-vs-64\n\nin vec2 position;\nuniform ivec2 gridSize;\nout vec2 vTextureCoord;\n\nvoid main(void) {\n  vec2 pos = vec2(-1.0, -1.0);\n  vec2 offset = 1.0 / vec2(gridSize);\n  pos = pos + offset;\n\n  gl_Position = vec4(pos, 0.0, 1.0);\n\n  int yIndex = gl_InstanceID / gridSize[0];\n  int xIndex = gl_InstanceID - (yIndex * gridSize[0]);\n\n  vec2 yIndexFP64 = vec2(float(yIndex), 0.);\n  vec2 xIndexFP64 = vec2(float(xIndex), 0.);\n  vec2 gridSizeYFP64 = vec2(gridSize[1], 0.);\n  vec2 gridSizeXFP64 = vec2(gridSize[0], 0.);\n\n  vec2 texCoordXFP64 = div_fp64(yIndexFP64, gridSizeYFP64);\n  vec2 texCoordYFP64 = div_fp64(xIndexFP64, gridSizeXFP64);\n\n  vTextureCoord = vec2(texCoordYFP64.x, texCoordXFP64.x);\n}\n",fs:"#version 300 es\n#define SHADER_NAME gpu-aggregation-all-fs\n\nprecision highp float;\n\nin vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform bool combineMaxMin;\nout vec4 fragColor;\nvoid main(void) {\n  vec4 textureColor = texture(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n  if (textureColor.a == 0.) {\n    discard;\n  }\n  fragColor.rgb = textureColor.rgb;\n  fragColor.a = combineMaxMin ? textureColor.r : textureColor.a;\n}\n",modules:["fp64"],shaderCache:t,vertexCount:1,drawMode:0,isInstanced:!0,instanceCount:a*n,attributes:{position:[0,0]}})}},{key:"getMeanTransform",value:function(e){return this.meanTransform?this.meanTransform.update(e):this.meanTransform=new v.a(this.gl,Object.assign({},{vs:"#define SHADER_NAME gpu-aggregation-transform-mean-vs\nattribute vec4 aggregationValues;\nvarying vec4 meanValues;\n\nvoid main()\n{\n  bool isCellValid = bool(aggregationValues.w > 0.);\n  meanValues.xyz = isCellValid ? aggregationValues.xyz/aggregationValues.w : vec3(0, 0, 0);\n  meanValues.w = aggregationValues.w;\n}\n",_targetTextureVarying:"meanValues"},e)),this.meanTransform}},{key:"renderAggregateData",value:function(e){var t=e.cellSize,i=e.viewport,a=e.gridTransformMatrix,n=e.projectPoints,r=this.state,o=r.numCol,s=r.numRow,u=r.windowSize,g=r.maxMinFramebuffers,l=r.minFramebuffers,c=r.maxFramebuffers,f=r.weights,d=[o,s],h={blend:!0,depthTest:!1,blendFunc:[1,1]},v={viewport:i},m={windowSize:u,cellSize:t,gridSize:d,uProjectionMatrix:a,uProjectionMatrixFP64:E(a),projectPoints:n};for(var p in f){var x=f[p],M=x.needMin,w=x.needMax,b=M&&w&&f[p].combineMaxMin;this.renderToWeightsTexture({id:p,parameters:h,moduleSettings:v,uniforms:m,gridSize:d}),b?this.renderToMaxMinTexture({id:p,parameters:Object.assign({},h,{blendEquation:C}),gridSize:d,minOrMaxFb:g[p],clearParams:{clearColor:[0,0,0,3402823466e29]},combineMaxMin:b}):(M&&this.renderToMaxMinTexture({id:p,parameters:Object.assign({},h,{blendEquation:A}),gridSize:d,minOrMaxFb:l[p],clearParams:{clearColor:[3402823466e29,3402823466e29,3402823466e29,0]},combineMaxMin:b}),w&&this.renderToMaxMinTexture({id:p,parameters:Object.assign({},h,{blendEquation:y}),gridSize:d,minOrMaxFb:c[p],combineMaxMin:b}))}}},{key:"renderToMaxMinTexture",value:function(e){var t=e.id,i=e.parameters,a=e.gridSize,n=e.minOrMaxFb,r=e.combineMaxMin,o=e.clearParams,s=void 0===o?{}:o,u=this.state.framebuffers,g=this.gl,l=this.allAggregationModel;n.bind(),g.viewport(0,0,a[0],a[1]),Object(m.a)(g,s,(function(){g.clear(16384)})),l.draw({parameters:i,uniforms:{uSampler:u[t].texture,gridSize:a,combineMaxMin:r}}),n.unbind()}},{key:"renderToWeightsTexture",value:function(e){var t=e.id,i=e.parameters,a=e.moduleSettings,r=e.uniforms,o=e.gridSize,s=this.state,u=s.framebuffers,g=s.equations,l=s.weightAttributes,c=s.weights,f=this.gl,d=this.gridAggregationModel,h=c[t].operation;u[t].bind(),f.viewport(0,0,o[0],o[1]);var v=h===M.a.MIN?[3402823466e29,3402823466e29,3402823466e29,0]:[0,0,0,0];Object(m.a)(f,{clearColor:v},(function(){f.clear(16384)}));var p={weights:l[t]};if(d.draw({parameters:Object.assign({},i,{blendEquation:g[t]}),moduleSettings:a,uniforms:r,attributes:p}),u[t].unbind(),h===M.a.MEAN){var x=this.state,w=x.meanTextures,b=x.textures,A={_sourceTextures:{aggregationValues:w[t]},_targetTexture:b[t],elementCount:b[t].width*b[t].height};this.getMeanTransform(A).run({parameters:{blend:!1,depthTest:!1}}),u[t].attach(Object(n.a)({},36064,b[t]))}}},{key:"runAggregationOnGPU",value:function(e){this.updateModels(e),this.setupFramebuffers(e),this.renderAggregateData(e);var t=this.getAggregateData(e);return this.setState({results:t}),t}},{key:"setupFramebuffers",value:function(e){var t=this.state,i=t.numCol,a=t.numRow,r=t.textures,o=t.framebuffers,s=t.maxMinFramebuffers,u=t.minFramebuffers,g=t.maxFramebuffers,l=t.resources,c=t.meanTextures,f=t.equations,d=t.weights,h={width:i,height:a};for(var v in d){var m=d[v],p=m.needMin,x=m.needMax,w=m.combineMaxMin,b=m.operation;r[v]=d[v].aggregationTexture||r[v]||_(this.gl,{id:"".concat(v,"-texture"),width:i,height:a}),r[v].resize(h);var A=r[v];b===M.a.MEAN&&(c[v]=c[v]||_(this.gl,{id:"".concat(v,"-mean-texture"),width:i,height:a}),c[v].resize(h),A=c[v]),o[v]?o[v].attach(Object(n.a)({},36064,A)):o[v]=B(this.gl,{id:"".concat(v,"-fb"),width:i,height:a,texture:A}),o[v].resize(h),f[v]=S[b],(p||x)&&(p&&x&&w?s[v]||(l["".concat(v,"-maxMin")]=_(this.gl,{id:"".concat(v,"-maxMinTex")}),s[v]=B(this.gl,{id:"".concat(v,"-maxMinFb"),texture:l["".concat(v,"-maxMin")]})):(p&&(u[v]||(l["".concat(v,"-min")]=_(this.gl,{id:"".concat(v,"-minTex")}),u[v]=B(this.gl,{id:"".concat(v,"-minFb"),texture:l["".concat(v,"-min")]}))),x&&(g[v]||(l["".concat(v,"-max")]=_(this.gl,{id:"".concat(v,"-maxTex")}),g[v]=B(this.gl,{id:"".concat(v,"-maxFb"),texture:l["".concat(v,"-max")]})))))}}},{key:"setupModels",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.gridAggregationModel&&this.gridAggregationModel.delete(),this.gridAggregationModel=this.getAggregationModel(e),this.allAggregationModel||(this.allAggregationModel=this.getAllAggregationModel())}},{key:"setupWeightAttributes",value:function(e){var t=this.state,i=t.weightAttributes,a=t.vertexCount,n=t.weights,r=t.resources;for(var o in n){var s=n[o].values;if(Array.isArray(s)||s.constructor===Float32Array){p.a.assert(s.length/3===a);var u=Array.isArray(s)?new Float32Array(s):s;i[o]instanceof f.a?i[o].setData(u):(r["".concat(o,"-buffer")]=new f.a(this.gl,u),i[o]=r["".concat(o,"-buffer")])}else p.a.assert(s instanceof f.a),i[o]=s}}},{key:"trackGPUResultBuffers",value:function(e,t){var i=this.state.resources;for(var a in e)if(e[a])for(var n=0;n<N.length;n++){var r=N[n];if(e[a][r]&&t[a][r]!==e[a][r]){var o="gpu-result-".concat(a,"-").concat(r);i[o]&&i[o].delete(),i[o]=e[a][r]}}}},{key:"updateModels",value:function(e){var t=this.gl,i=e.positions,a=e.positions64xyLow,n=e.changeFlags,r=this.state,o=r.numCol,s=r.numRow,u={},g=!1;if(e.fp64!==this.state.fp64&&(this.setupModels(e.fp64),this.setState({fp64:e.fp64}),g=!0),n.dataChanged||!this.state.positionsBuffer){var l=this.state,c=l.positionsBuffer,d=l.positions64xyLowBuffer;c&&c.delete(),d&&d.delete();var h=i.length/2;c=new f.a(t,new Float32Array(i)),d=new f.a(t,{data:new Float32Array(a),accessor:{size:2}}),this.setState({positionsBuffer:c,positions64xyLowBuffer:d,vertexCount:h}),this.setupWeightAttributes(e),g=!0}if(g){var v=this.state,m=v.vertexCount,p=v.positionsBuffer,x=v.positions64xyLowBuffer;u.positions=p,e.fp64&&(u.positions64xyLow=x),this.gridAggregationModel.setVertexCount(m),this.gridAggregationModel.setAttributes(u)}(n.cellSizeChanged||n.viewportChanged)&&this.allAggregationModel.setInstanceCount(o*s)}}]),e}()},981:function(e,t,i){"use strict";i.d(t,"b",(function(){return a})),i.d(t,"a",(function(){return n}));var a=[[255,255,178],[254,217,118],[254,178,76],[253,141,60],[240,59,32],[189,0,38]];function n(e,t,i){var a=new t(4*e.length);return e.forEach((function(e,t){var n=4*t;a[n]=e[0],a[n+1]=e[1],a[n+2]=e[2],a[n+3]=Number.isFinite(e[3])?e[3]:i})),a}},982:function(e,t,i){"use strict";i.d(t,"a",(function(){return a})),i.d(t,"b",(function(){return s}));var a={SUM:1,MEAN:2,MIN:3,MAX:4};function n(e,t){return e+t}function r(e,t){return t>e?t:e}function o(e,t){return t<e?t:e}function s(e,t){switch(a[e.toUpperCase()]||a.SUM){case a.MIN:return function(e){return function(e,t){var i=e.map(t).filter(Number.isFinite);return i.length?i.reduce(o,1/0):null}(e,t)};case a.SUM:return function(e){return function(e,t){var i=e.map(t).filter(Number.isFinite);return i.length?i.reduce(n,0):null}(e,t)};case a.MEAN:return function(e){return function(e,t){var i=e.map(t).filter(Number.isFinite);return i.length?i.reduce(n,0)/i.length:null}(e,t)};case a.MAX:return function(e){return function(e,t){var i=e.map(t).filter(Number.isFinite);return i.length?i.reduce(r,-1/0):null}(e,t)};default:return null}}}}]);