<div class="main-pocket-wrap-top">
{{each cardarr as v i}}
    {{if i < 10}}
    <img class="pok" src="{{carddata[v]}}" pknum="{{v}}" />
    {{/if}}
{{/each}}
</div>
<div class="main-pocket-wrap-bottom">
{{each cardarr as v i}}
    {{if i >= 10}}
    <img class="pok" src="{{carddata[v]}}" pknum="{{v}}" />
    {{/if}}
{{/each}}
</div>