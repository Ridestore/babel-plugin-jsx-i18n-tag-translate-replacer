
module.exports = function (babel) {
  var t = babel.types

  return {
    visitor: {
      JSXElement (path) {
        const containsAttributes = path.node.openingElement.attributes.length;
        const containsAttr = attr => containsAttributes && path.node
        	.openingElement.attributes.filter(a => a.name.name === attr).length;
        const readAttr = attr => path.node
        	.openingElement.attributes.filter(a => a.name.name === attr)[0];
        const isExpr = attr => ((path.node.openingElement
        	.attributes.filter(a => a.name.name === attr))[0]).value.type === 'JSXExpressionContainer';
        if (path.node.openingElement.name.name === 'translate') {
          let translation = null;
          if (containsAttr('plural')) {
            if (!(containsAttr('n') && containsAttr('form1') && containsAttr('form5'))) { return; }
            const n = readAttr('n');
            const form1 = readAttr('form1');
            const form5 = readAttr('form5');
            translation = t.jSXExpressionContainer(
              t.callExpression(
                t.identifier('p'),
                [
                  isExpr('n') ? n.value.expression : t.numericLiteral(+n.value.value),
                  form1.value,
                  form5.value,
                ]
              )
            )
          }
          else {
           translation = t.jSXExpressionContainer(
              t.callExpression(
                t.identifier('t'),
                [t.stringLiteral(path.node.children[0].value)]
              )
            ) 
          }
          path.replaceWith(translation);
        }
        
        else if (containsAttr('translate')) {
          path.node.openingElement.attributes.forEach((a, i) => {
            if (a.name.name === 'translate') {
              path.node.openingElement.attributes.splice(i, 1);
            }
          });
          
          path.node.children[0] = t.jSXExpressionContainer(
            t.callExpression(
              t.identifier('t'),
              [t.stringLiteral(path.node.children[0].value)]
            )
          );
        }
      },
    }
  }

}


