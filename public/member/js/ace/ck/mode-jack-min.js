ace.define("ace/mode/jack",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/jack_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){var r=e("../lib/oop"),o=e("./text").Mode,i=e("./jack_highlight_rules").JackHighlightRules,a=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./behaviour/cstyle").CstyleBehaviour,u=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=i,this.$outdent=new a,this.$behaviour=new s,this.foldingRules=new u};r.inherits(c,o),function(){this.lineCommentStart="--",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t);if("start"==e){var o=t.match(/^.*[\{\(\[]\s*$/);o&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/jack"}.call(c.prototype),t.Mode=c}),ace.define("ace/mode/jack_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,i=function(){this.$rules={start:[{token:"string",regex:'"',next:"string2"},{token:"string",regex:"'",next:"string1"},{token:"constant.numeric",regex:"-?0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"(?:0|[-+]?[1-9][0-9]*)\\b"},{token:"constant.binary",regex:"<[0-9A-Fa-f][0-9A-Fa-f](\\s+[0-9A-Fa-f][0-9A-Fa-f])*>"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:"constant.language.null",regex:"null\\b"},{token:"storage.type",regex:"(?:Integer|Boolean|Null|String|Buffer|Tuple|List|Object|Function|Coroutine|Form)\\b"},{token:"keyword",regex:"(?:return|abort|vars|for|delete|in|is|escape|exec|split|and|if|elif|else|while)\\b"},{token:"language.builtin",regex:"(?:lines|source|parse|read-stream|interval|substr|parseint|write|print|range|rand|inspect|bind|i-values|i-pairs|i-map|i-filter|i-chunk|i-all\\?|i-any\\?|i-collect|i-zip|i-merge|i-each)\\b"},{token:"comment",regex:"--.*$"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"storage.form",regex:"@[a-z]+"},{token:"constant.other.symbol",regex:":+[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"variable",regex:"[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"keyword.operator",regex:"\\|\\||\\^\\^|&&|!=|==|<=|<|>=|>|\\+|-|\\*|\\/|\\^|\\%|\\#|\\!"},{token:"text",regex:"\\s+"}],string1:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:"[^'\\\\]+"},{token:"string",regex:"'",next:"start"},{token:"string",regex:"",next:"start"}],string2:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:'"',next:"start"},{token:"string",regex:"",next:"start"}]}};r.inherits(i,o),t.JackHighlightRules=i}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){var r=e("../range").Range,o=function(){};(function(){this.checkOutdent=function(e,t){return/^\s+$/.test(e)?/^\s*\}/.test(t):!1},this.autoOutdent=function(e,t){var n=e.getLine(t),o=n.match(/^(\s*\})/);if(!o)return 0;var i=o[1].length,a=e.findMatchingBracket({row:t,column:i});if(!a||a.row==t)return 0;var s=this.$getIndent(e.getLine(a.row));e.replace(new r(t,0,t,i-1),s)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(o.prototype),t.MatchingBraceOutdent=o}),ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(e,t,n){var r=e("../../lib/oop"),o=e("../behaviour").Behaviour,i=e("../../token_iterator").TokenIterator,a=e("../../lib/lang"),s=["text","paren.rparen","punctuation.operator"],u=["text","paren.rparen","punctuation.operator","comment"],c,l={},g=function(e){var t=-1;return e.multiSelect&&(t=e.selection.id,l.rangeCount!=e.multiSelect.rangeCount&&(l={rangeCount:e.multiSelect.rangeCount})),l[t]?c=l[t]:void(c=l[t]={autoInsertedBrackets:0,autoInsertedRow:-1,autoInsertedLineEnd:"",maybeInsertedBrackets:0,maybeInsertedRow:-1,maybeInsertedLineStart:"",maybeInsertedLineEnd:""})},d=function(){this.add("braces","insertion",function(e,t,n,r,o){var i=n.getCursorPosition(),s=r.doc.getLine(i.row);if("{"==o){g(n);var u=n.getSelectionRange(),l=r.doc.getTextRange(u);if(""!==l&&"{"!==l&&n.getWrapBehavioursEnabled())return{text:"{"+l+"}",selection:!1};if(d.isSaneInsertion(n,r))return/[\]\}\)]/.test(s[i.column])||n.inMultiSelectMode?(d.recordAutoInsert(n,r,"}"),{text:"{}",selection:[1,1]}):(d.recordMaybeInsert(n,r,"{"),{text:"{",selection:[1,1]})}else if("}"==o){g(n);var f=s.substring(i.column,i.column+1);if("}"==f){var h=r.$findOpeningBracket("}",{column:i.column+1,row:i.row});if(null!==h&&d.isAutoInsertedClosing(i,s,o))return d.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}else{if("\n"==o||"\r\n"==o){g(n);var m="";d.isMaybeInsertedClosing(i,s)&&(m=a.stringRepeat("}",c.maybeInsertedBrackets),d.clearMaybeInsertedClosing());var f=s.substring(i.column,i.column+1);if("}"===f){var b=r.findMatchingBracket({row:i.row,column:i.column+1},"}");if(!b)return null;var k=this.$getIndent(r.getLine(b.row))}else{if(!m)return void d.clearMaybeInsertedClosing();var k=this.$getIndent(s)}var p=k+r.getTabString();return{text:"\n"+p+"\n"+k+m,selection:[1,p.length,1,p.length]}}d.clearMaybeInsertedClosing()}}),this.add("braces","deletion",function(e,t,n,r,o){var i=r.doc.getTextRange(o);if(!o.isMultiLine()&&"{"==i){g(n);var a=r.doc.getLine(o.start.row),s=a.substring(o.end.column,o.end.column+1);if("}"==s)return o.end.column++,o;c.maybeInsertedBrackets--}}),this.add("parens","insertion",function(e,t,n,r,o){if("("==o){g(n);var i=n.getSelectionRange(),a=r.doc.getTextRange(i);if(""!==a&&n.getWrapBehavioursEnabled())return{text:"("+a+")",selection:!1};if(d.isSaneInsertion(n,r))return d.recordAutoInsert(n,r,")"),{text:"()",selection:[1,1]}}else if(")"==o){g(n);var s=n.getCursorPosition(),u=r.doc.getLine(s.row),c=u.substring(s.column,s.column+1);if(")"==c){var l=r.$findOpeningBracket(")",{column:s.column+1,row:s.row});if(null!==l&&d.isAutoInsertedClosing(s,u,o))return d.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("parens","deletion",function(e,t,n,r,o){var i=r.doc.getTextRange(o);if(!o.isMultiLine()&&"("==i){g(n);var a=r.doc.getLine(o.start.row),s=a.substring(o.start.column+1,o.start.column+2);if(")"==s)return o.end.column++,o}}),this.add("brackets","insertion",function(e,t,n,r,o){if("["==o){g(n);var i=n.getSelectionRange(),a=r.doc.getTextRange(i);if(""!==a&&n.getWrapBehavioursEnabled())return{text:"["+a+"]",selection:!1};if(d.isSaneInsertion(n,r))return d.recordAutoInsert(n,r,"]"),{text:"[]",selection:[1,1]}}else if("]"==o){g(n);var s=n.getCursorPosition(),u=r.doc.getLine(s.row),c=u.substring(s.column,s.column+1);if("]"==c){var l=r.$findOpeningBracket("]",{column:s.column+1,row:s.row});if(null!==l&&d.isAutoInsertedClosing(s,u,o))return d.popAutoInsertedClosing(),{text:"",selection:[1,1]}}}}),this.add("brackets","deletion",function(e,t,n,r,o){var i=r.doc.getTextRange(o);if(!o.isMultiLine()&&"["==i){g(n);var a=r.doc.getLine(o.start.row),s=a.substring(o.start.column+1,o.start.column+2);if("]"==s)return o.end.column++,o}}),this.add("string_dquotes","insertion",function(e,t,n,r,o){if('"'==o||"'"==o){g(n);var i=o,a=n.getSelectionRange(),s=r.doc.getTextRange(a);if(""!==s&&"'"!==s&&'"'!=s&&n.getWrapBehavioursEnabled())return{text:i+s+i,selection:!1};var u=n.getCursorPosition(),c=r.doc.getLine(u.row),l=c.substring(u.column-1,u.column);if("\\"==l)return null;for(var f=r.getTokens(a.start.row),h=0,m,b=-1,k=0;k<f.length&&(m=f[k],"string"==m.type?b=-1:0>b&&(b=m.value.indexOf(i)),!(m.value.length+h>a.start.column));k++)h+=f[k].value.length;if(!m||0>b&&"comment"!==m.type&&("string"!==m.type||a.start.column!==m.value.length+h-1&&m.value.lastIndexOf(i)===m.value.length-1)){if(!d.isSaneInsertion(n,r))return;return{text:i+i,selection:[1,1]}}if(m&&"string"===m.type){var p=c.substring(u.column,u.column+1);if(p==i)return{text:"",selection:[1,1]}}}}),this.add("string_dquotes","deletion",function(e,t,n,r,o){var i=r.doc.getTextRange(o);if(!o.isMultiLine()&&('"'==i||"'"==i)){g(n);var a=r.doc.getLine(o.start.row),s=a.substring(o.start.column+1,o.start.column+2);if(s==i)return o.end.column++,o}})};d.isSaneInsertion=function(e,t){var n=e.getCursorPosition(),r=new i(t,n.row,n.column);if(!this.$matchTokenType(r.getCurrentToken()||"text",s)){var o=new i(t,n.row,n.column+1);if(!this.$matchTokenType(o.getCurrentToken()||"text",s))return!1}return r.stepForward(),r.getCurrentTokenRow()!==n.row||this.$matchTokenType(r.getCurrentToken()||"text",u)},d.$matchTokenType=function(e,t){return t.indexOf(e.type||e)>-1},d.recordAutoInsert=function(e,t,n){var r=e.getCursorPosition(),o=t.doc.getLine(r.row);this.isAutoInsertedClosing(r,o,c.autoInsertedLineEnd[0])||(c.autoInsertedBrackets=0),c.autoInsertedRow=r.row,c.autoInsertedLineEnd=n+o.substr(r.column),c.autoInsertedBrackets++},d.recordMaybeInsert=function(e,t,n){var r=e.getCursorPosition(),o=t.doc.getLine(r.row);this.isMaybeInsertedClosing(r,o)||(c.maybeInsertedBrackets=0),c.maybeInsertedRow=r.row,c.maybeInsertedLineStart=o.substr(0,r.column)+n,c.maybeInsertedLineEnd=o.substr(r.column),c.maybeInsertedBrackets++},d.isAutoInsertedClosing=function(e,t,n){return c.autoInsertedBrackets>0&&e.row===c.autoInsertedRow&&n===c.autoInsertedLineEnd[0]&&t.substr(e.column)===c.autoInsertedLineEnd},d.isMaybeInsertedClosing=function(e,t){return c.maybeInsertedBrackets>0&&e.row===c.maybeInsertedRow&&t.substr(e.column)===c.maybeInsertedLineEnd&&t.substr(0,e.column)==c.maybeInsertedLineStart},d.popAutoInsertedClosing=function(){c.autoInsertedLineEnd=c.autoInsertedLineEnd.substr(1),c.autoInsertedBrackets--},d.clearMaybeInsertedClosing=function(){c&&(c.maybeInsertedBrackets=0,c.maybeInsertedRow=-1)},r.inherits(d,o),t.CstyleBehaviour=d}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){var r=e("../../lib/oop"),o=e("../../range").Range,i=e("./fold_mode").FoldMode,a=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};r.inherits(a,i),function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/,this.getFoldWidgetRange=function(e,t,n,r){var o=e.getLine(n),i=o.match(this.foldingStartMarker);if(i){var a=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,a);var s=e.getCommentFoldRange(n,a+i[0].length,1);return s&&!s.isMultiLine()&&(r?s=this.getSectionRange(e,n):"all"!=t&&(s=null)),s}if("markbegin"!==t){var i=o.match(this.foldingStopMarker);if(i){var a=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,a):e.getCommentFoldRange(n,a,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),i=t,a=n.length;t+=1;for(var s=t,u=e.getLength();++t<u;){n=e.getLine(t);var c=n.search(/\S/);if(-1!==c){if(r>c)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=i)break;if(l.isMultiLine())t=l.end.row;else if(r==c)break}s=t}}return new o(i,a,s,e.getLine(s).length)}}.call(a.prototype)});