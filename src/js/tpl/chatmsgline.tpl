{{ if data.ct == '1'}}
<li>{{data.name}}:{{data.msg}}</li>
{{ else if data.ct == '2'}}
<li>{{data.name}}:<img class="e-unit" src="../img/page/face/{{data.msg * 1 + 1
}}.png" /></li>
{{/if}}