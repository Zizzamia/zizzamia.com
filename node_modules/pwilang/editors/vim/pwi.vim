"Vim syntax file
" Language:	Vim 7.2 script
" Filenames:    *.ini, .hgrc, */.hg/hgrc
" Maintainer:	Peter Hosey
" Last Change:	Nov 11, 2008
" Version:	7.2-02

" Quit when a syntax file was already loaded
if exists("b:current_syntax")
  finish
endif

runtime! syntax/jinja.vim
unlet! b:current_syntax

runtime! syntax/html.vim

syn match   blockRule "%.*" contains=@NoSpell,jinjaTagBlock,jinjaStatement

syn match commentRule "^\s*#.*$" contains=@NoSpell
syn match variableRule +\$[a-zA-Z_][a-zA-Z0-9_]*+ nextgroup=varParenRule,varBracketRule,varDotRule
syn match varDotRule +\.[a-zA-Z_][[:alnum:]_]*+ nextgroup=varParenRule,varBracketRule contained
syn region varParenRule start=+(+ skip=+\\)+ end=+)+ nextgroup=varParenRule,varBracketRule,varDotRule contains=varParenRule,varBracketRule
syn region varBracketRule start=+\[+ end=+\]+ nextgroup=varParenRule,varBracketRule,varDotRule contains=varParenRule,varBracketRule

syn region variableRule start=+\$(+ end=+)+ contains=varParenRule2
syn region varParenRule2 start=+\$\@<!(+ skip=+\\)+ end=+)+ contains=varParenRule2

syn match  escapedRule '\\.'
"syn match   bigTagRule  '^@/\?[[:alnum:]_-]\+\(\s*\.[[:alnum:]_-]\+\|\s*#[[:alnum:]_-]\+\|\s*[[:alnum:]_-]\+=\"\(.\|\\\"\)*\"\)*' contains=tagRule,classRule,keyRule,idRule,valueRule,@NoSpell
syn match   bigTagRule  '@/\?[$[:alnum:]_-]\+\(\s*\.[$[:alnum:]_-]\+\|\s*#[$[:alnum:]_-]\+\|\s*[$[:alnum:]_-]\+=\"\(.\|\\\"\)*\"\|\s*[$[:alnum:]_-]\+=\'\(.\|\\\'\)*\'\|\s*[$[:alnum:]_-]\+=[^\'\"]\(\\ \|[^ \t]\)*\|\s*\\[$[:alnum:]_-]\+\)*' contains=tagRule,classRule,keyRule,idRule,valueRule,@NoSpell

"syn match   tagRule     '[^\\]@[a-zA-Z0-9_-]\+'ms=s+1 
"syn match   tagRule     '^@[a-zA-Z0-9_-]\+' 
syn match   tagRule     '@/\?[$a-zA-Z0-9_-]\+' contained contains=@NoSpell
syn match   htmlCharRule '&[a-z]\+;' contains=@NoSpell

syn match   idRule  "\#[$()\[\]\"\'[:alnum:]_-]\+" contained contains=@NoSpell,variableRule
syn match   classRule   '\.[$()\[\]\"\'[:alnum:]_-]\+' contained contains=@NoSpell,variableRule
syn match   keyRule     "[$()\[\]\"\'[:alnum:]_-]\+="me=e-1 contained contains=@NoSpell,variableRule
syn match   keyRule     "\\[$()\[\]\"\'/[:alnum:]_-]\+" contained contains=@NoSpell,variableRule
syn region  valueRule  start=+="+ms=s+1 end=+"+ skip=+\\"+ contained contains=@NoSpell,escapedRule,bigTagRule,variableRule
syn region  valueRule  start=+='+ end=+'+ skip=+\\"+ contained contains=@NoSpell,escapedRule,bigTagRule,variableRule
syn match   valueRule "=[^\"']\(\\ \|[^ \t]\)*"ms=s+1  contained contains=@NoSpell,variableRule


syn match PwiTitle "^ *@h1 .*$" contains=classRule,keyRule,idRule,valueRule,@NoSpell
syn match PwiSection "^ *@h2 .*$"
syn match PwiSubsection "^ *@h3 .*$"

" Highlighting Settings
" ====================
hi def link variableRule Number
hi def link varParenRule Number
hi def link varParenRule2 Number
hi def link varBracketRule Number
hi def link varDotRule Number

hi def link blockRule PreProc
hi def link escapedRule Statement
hi def link htmlCharRule Statement

hi def link tagRule Constant
hi def link classRule Keyword
hi def link idRule Function
hi def link valueRule String
hi def link keyRule Identifier
hi def link commentRule Comment

let b:current_syntax = "pwi"

