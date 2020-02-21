import { helper } from '@ember/component/helper';

export default helper(function formatXml(params/*, hash*/) {
  let raw = params[0];
  return Ember.String.htmlSafe(doformatXml(raw));
});


// modified from from https://gist.github.com/kurtsson/3f1c8efc0ccd549c9e31
function doformatXml(xml) {
  var formatted = '';
  var zapSpace = /(>)( )+(<)(\/*)/g;
  xml = xml.toString().replace(zapSpace, '$1\r\n$3$4');
  var reg = /(>)(<)(\/*)/g;
  xml = xml.toString().replace(reg, '$1\r\n$2$3');
  var pad = 0;
  var nodes = xml.split('\r\n');
  for(var n =0; n < nodes.length; n++) {
    var node = nodes[n];
    var indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    var padding = '';
    for (var i = 0; i < pad; i++) {
      //padding += '  ';
      padding += '  ';
    }

    //formatted += padding + escapeBrackets(node) + '<br/>';
    formatted += padding + escapeBrackets(node) + '\n';
    pad += indent;
  }
  return formatted;
}


function escapeBrackets(node) {
  //return formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;');
  return node.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;');
}
