(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{1283:function(e,a){e.exports=function(e){var a={begin:"`[\\s\\S]"};return{case_insensitive:!0,aliases:["ahk"],keywords:{keyword:"Break Continue Critical Exit ExitApp Gosub Goto New OnExit Pause return SetBatchLines SetTimer Suspend Thread Throw Until ahk_id ahk_class ahk_pid ahk_exe ahk_group",literal:"A|0 true false NOT AND OR",built_in:"ComSpec Clipboard ClipboardAll ErrorLevel"},contains:[{className:"built_in",begin:"A_[a-zA-Z0-9]+"},a,e.inherit(e.QUOTE_STRING_MODE,{contains:[a]}),e.COMMENT(";","$",{relevance:0}),e.C_BLOCK_COMMENT_MODE,{className:"number",begin:e.NUMBER_RE,relevance:0},{className:"subst",begin:"%(?=[a-zA-Z0-9#_$@])",end:"%",illegal:"[^a-zA-Z0-9#_$@]"},{className:"built_in",begin:"^\\s*\\w+\\s*,"},{className:"meta",begin:"^\\s*#w+",end:"$",relevance:0},{className:"symbol",contains:[a],variants:[{begin:'^[^\\n";]+::(?!=)'},{begin:'^[^\\n";]+:(?!=)',relevance:0}]},{begin:",\\s*,"}]}}}}]);