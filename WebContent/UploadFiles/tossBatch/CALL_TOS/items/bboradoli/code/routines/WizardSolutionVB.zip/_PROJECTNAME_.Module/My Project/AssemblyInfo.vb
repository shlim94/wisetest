a&&0===m.length&&("R"===m[0]||"r"===m[0]||"C"===m[0]||"c"===m[0]))return A=p,"continue";S(m,c.slice(p,h)),p=h-1}else{if(13===W||10===W)return A=p,"continue";if(35===W)I=Q(c,p),I?(i.push(new z(I.result,0,p,p+I.result.length-1,6)),o=p+1,p=I.endIndex):m.push(T);else if(33===W)0===m.length,J=i.length,J>0&&0===i[J-1].Nc?(K=i[J-1],y.apply(K.Qb,m),i[J-1]=new z(K.Qb,0,K.mi,p,12)):i.push(new z(m,0,o,p,12)),m=[],o=p+1;else if(43===W||45===W)M=0===i.length?null:i[i.length-1],0!==m.length?(i.push(new z(m,0,o)),i.push(new z(T,5,p)),m=[],o=p+1):(M&&7===M.Nc&&i.pop(),!M||2!==M.hi&&6!==M.Nc&&0!==M.Nc?(i.push(new z(T,4,p)),o=p+1):(i.push(new z(T,5,p)),o=p+1));else if(T===t||L(W))m.length>0?m.push(T):(N=R(c,p,t),N.num?(q=N.endIndex,O=N.num,q<=h-2&&"!"===c[q+1]?(S(m,O),o=q):(i.push(new z(O,0,p,q,4)),o=q+1),p=q):m.push(T));else if(123===W)m.length>0&&d&&G(T,p),n=new z(l,1,p,p,1),i.push(n),j[++k]=n,o=p+1;else if(T===v&&k>=0&&j[k].value===l)m=g(i,m,o),k<0&&d&&G(T,p),i.push(new z(v,3,p,p)),o=p+1;else if(125===W)m=